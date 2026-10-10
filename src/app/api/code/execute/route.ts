// src/app/api/code/execute/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const JUDGE0  = "https://ce.judge0.com";
const LANG_ID: Record<string, number> = {
  javascript: 63, typescript: 74, python: 71,
  java: 62, cpp: 54, c: 50,
};

// ─── Parse input lines into typed JS values ───────────────────────────────────
function parseArgs(input: string): any[] {
  return input.trim().split("\n")
    .map(l => l.trim()).filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return l; } });
}

// ─── Convert a JS value to a Java literal expression ─────────────────────────
function javaLiteral(val: any): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return "new int[]{}";
    if (typeof val[0] === "number") return `new int[]{${val.join(", ")}}`;
    if (typeof val[0] === "string") return `new String[]{${val.map((s: string) => `"${s}"`).join(", ")}}`;
    return `new Object[]{${val.map(javaLiteral).join(", ")}}`;
  }
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "boolean") return String(val);
  if (val === null) return "null";
  return String(val);
}

// ─── Build the full runnable source for a test case ──────────────────────────
function buildSource(language: string, userCode: string, input: string): string {
  const args    = parseArgs(input);
  const argsStr = args.map((a: any) => JSON.stringify(a)).join(", ");

  // ── JavaScript ────────────────────────────────────────────────────────────
  if (language === "javascript") {
    const m  = userCode.match(/^function\s+(\w+)\s*\(/m)
            ?? userCode.match(/^(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\()/m);
    const fn = m?.[1];
    if (!fn) return userCode;
    return `${userCode}\n\nconst __r = ${fn}(${argsStr});\nif (__r !== undefined && __r !== null) process.stdout.write(JSON.stringify(__r));`;
  }

  // ── TypeScript (ts-node on Judge0) ────────────────────────────────────────
  if (language === "typescript") {
    // Strip return type annotations so ts-node doesn't complain about strict types
    const m  = userCode.match(/^function\s+(\w+)\s*\(/m)
            ?? userCode.match(/^(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\()/m);
    const fn = m?.[1];
    if (!fn) return userCode;
    return `${userCode}\n\nconst __r: any = (${fn} as any)(${argsStr});\nif (__r !== undefined && __r !== null) process.stdout.write(JSON.stringify(__r));`;
  }

  // ── Python ────────────────────────────────────────────────────────────────
  if (language === "python") {
    const header = "from typing import List, Optional, Dict, Tuple, Any, Set\nimport json as _json\n";
    // class Solution style
    const method = userCode.match(/class\s+Solution[\s\S]*?def\s+(\w+)\s*\(self/m);
    if (method) {
      const fn = method[1];
      return `${header}\n${userCode}\n\n_sol = Solution()\n_r = _sol.${fn}(${argsStr})\nprint(_json.dumps(_r), end="")`;
    }
    // plain def style
    const plain = userCode.match(/^def\s+(\w+)\s*\(/m);
    if (plain) {
      const fn = plain[1];
      return `${header}\n${userCode}\n\n_r = ${fn}(${argsStr})\nif _r is not None:\n    print(_json.dumps(_r), end="")`;
    }
    return `${header}\n${userCode}`;
  }

  // ── Java ──────────────────────────────────────────────────────────────────
  if (language === "java") {
    // Find user's method (not main)
    const allMethods = [...userCode.matchAll(/public\s+\S+\s+(\w+)\s*\([^)]*\)\s*\{/g)];
    const fn = allMethods.map(m => m[1]).find(n => n !== "main") ?? "solve";
    const javaArgs = args.map(javaLiteral).join(", ");

    const toJsonHelper = `
    static String _toJson(Object o) {
        if (o == null) return "null";
        if (o instanceof int[]) {
            int[] a = (int[]) o;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (o instanceof boolean[]) {
            boolean[] a = (boolean[]) o;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (o instanceof List) {
            @SuppressWarnings("unchecked") List<Object> list = (List<Object>) o;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) { if (i > 0) sb.append(","); sb.append(_toJson(list.get(i))); }
            return sb.append("]").toString();
        }
        if (o instanceof String) return "\\"" + o.toString().replace("\\\\","\\\\\\\\").replace("\\"","\\\\\\"") + "\\"";
        return o.toString();
    }`;

    const newMain = `    public static void main(String[] args) {
        Solution _sol = new Solution();
        Object _r = _sol.${fn}(${javaArgs});
        System.out.print(_toJson(_r));
    }${toJsonHelper}`;

    // Replace existing main body
    const replaced = userCode.replace(
      /public\s+static\s+void\s+main\s*\(String\[\]\s+\w+\)\s*\{[\s\S]*?\n(\s*)\}/,
      newMain
    );
    // If no main was found, inject one before the last closing brace
    if (replaced === userCode) {
      return userCode.replace(/\}\s*$/, `\n${newMain}\n}`);
    }
    return replaced;
  }

  // ── C++ / C — user writes their own main ─────────────────────────────────
  return userCode;
}

export async function POST(req: NextRequest) {
  try {
    const { language, code, stdin } = await req.json();
    const id = LANG_ID[language];
    if (!id) return NextResponse.json({ stdout: "", stderr: `Unsupported: ${language}` });

    const source = buildSource(language, code, stdin ?? "");

    const res = await fetch(`${JUDGE0}/submissions?wait=true&base64_encoded=false`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language_id: id, source_code: source, stdin: "",
        cpu_time_limit: 5, wall_time_limit: 10, memory_limit: 128000,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) return NextResponse.json({ stdout: "", stderr: `Judge0 ${res.status}` });
    const d = await res.json();
    return NextResponse.json({
      stdout: (d.stdout ?? "").trim(),
      stderr: (d.stderr ?? d.compile_output ?? "").trim(),
      error:  (d.status?.id ?? 0) > 3 ? (d.compile_output || d.stderr || d.status?.description) : null,
    });
  } catch (err: any) {
    return NextResponse.json({ stdout: "", stderr: err.message, error: err.message }, { status: 500 });
  }
}