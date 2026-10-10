// src/app/api/code/seed-days-51-60/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 51,
    "topic": "Advanced Graph: Strongly Connected Components",
    "lesson": "Kosaraju's: (1) DFS on original graph, push finish order to stack. (2) Transpose graph. (3) DFS on transposed in reverse finish order — each DFS tree is an SCC. Tarjan's: single DFS with discovery time and low-link values; stack tracks current SCC. SCCs reduce a directed graph to a DAG. Used in: 2-SAT, compiler optimizations, deadlock detection.",
    "problems": [
      {
        "title": "Number of Strongly Connected Components",
        "slug": "number-of-sccs",
        "difficulty": "hard",
        "category": "graph",
        "description": "Given directed graph with n nodes and edges, return the number of strongly connected components.",
        "examples": [
          { "input": "n=5,edges=[[0,1],[1,2],[2,0],[1,3],[3,4]]", "output": "3" },
          { "input": "n=3,edges=[[0,1],[1,2],[2,0]]", "output": "1" }
        ],
        "constraints": ["1<=n<=10^4", "0<=edges.length<=3*10^4"],
        "hints": [
          "Kosaraju's: first DFS to get finish order, transpose graph, second DFS",
          "Or Tarjan's single-pass DFS with low-link values"
        ],
        "tags": ["graph", "dfs", "strongly-connected-components"],
        "js": "function countSCCs(n, edges) {\n  // your code here\n}",
        "py": "def count_sccs(n, edges):\n    pass",
        "testCases": [
          { "input": "5\n[[0,1],[1,2],[2,0],[1,3],[3,4]]", "expectedOutput": "3" },
          { "input": "3\n[[0,1],[1,2],[2,0]]", "expectedOutput": "1" },
          { "input": "4\n[[0,1],[1,2],[2,3]]", "expectedOutput": "4", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Critical Connections in a Network",
        "slug": "critical-connections-network",
        "difficulty": "hard",
        "category": "graph",
        "description": "Find all critical connections (bridges) in an undirected graph — edges whose removal disconnects the network.",
        "examples": [
          { "input": "n=4,connections=[[0,1],[1,2],[2,0],[1,3]]", "output": "[[1,3]]" },
          { "input": "n=2,connections=[[0,1]]", "output": "[[0,1]]" }
        ],
        "constraints": ["2<=n<=10^5", "n-1<=connections.length<=3*10^5"],
        "hints": [
          "Tarjan's bridge finding: disc[u] and low[u]",
          "Edge (u,v) is bridge if low[v] > disc[u]"
        ],
        "tags": ["graph", "dfs", "bridge-finding"],
        "js": "function criticalConnections(n, connections) {\n  // your code here\n}",
        "py": "def critical_connections(n, connections):\n    pass",
        "testCases": [
          { "input": "4\n[[0,1],[1,2],[2,0],[1,3]]", "expectedOutput": "[[1,3]]" },
          { "input": "2\n[[0,1]]", "expectedOutput": "[[0,1]]" }
        ],
        "xpReward": 130
      },
      {
        "title": "Reconstruct Itinerary",
        "slug": "reconstruct-itinerary",
        "difficulty": "hard",
        "category": "graph",
        "description": "Given list of airline tickets [from,to], reconstruct itinerary starting from JFK. Use all tickets. Return lexicographically smallest valid itinerary.",
        "examples": [
          { "input": "tickets=[[MUC,LHR],[JFK,MUC],[SFO,SJC],[LHR,SFO]]", "output": "[JFK,MUC,LHR,SFO,SJC]" },
          { "input": "tickets=[[JFK,SFO],[JFK,ATL],[SFO,ATL],[ATL,JFK],[ATL,SFO]]", "output": "[JFK,ATL,JFK,SFO,ATL,SFO]" }
        ],
        "constraints": ["1<=tickets.length<=300"],
        "hints": [
          "Eulerian path: Hierholzer's algorithm",
          "Sort adjacency lists; DFS, add to result when backtracking"
        ],
        "tags": ["graph", "dfs", "eulerian-path"],
        "js": "function findItinerary(tickets) {\n  // your code here\n}",
        "py": "def find_itinerary(tickets):\n    pass",
        "testCases": [
          { "input": "[[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]", "expectedOutput": "[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]" },
          { "input": "[[\"JFK\",\"SFO\"],[\"JFK\",\"ATL\"],[\"SFO\",\"ATL\"],[\"ATL\",\"JFK\"],[\"ATL\",\"SFO\"]]", "expectedOutput": "[\"JFK\",\"ATL\",\"JFK\",\"SFO\",\"ATL\",\"SFO\"]" }
        ],
        "xpReward": 120
      },
      {
        "title": "Maximize the Number of Target Nodes After Connecting Trees",
        "slug": "maximize-target-nodes",
        "difficulty": "hard",
        "category": "graph",
        "description": "Two trees with n and m nodes. Connect one node from tree1 to one from tree2. For each node in tree1, return max nodes reachable within k edges after best connection.",
        "examples": [
          { "input": "edges1=[[0,1],[0,2],[2,3],[2,4]],edges2=[[0,1],[0,2],[0,3],[2,7],[1,4],[4,5],[4,6]],k=2", "output": "[9,7,9,8,8]" },
          { "input": "edges1=[[0,1],[0,2],[0,3],[0,4]],edges2=[[0,1],[1,2],[2,3]],k=1", "output": "[6,3,3,3,3]" }
        ],
        "constraints": ["2<=n,m<=1000", "0<=k<=1000"],
        "hints": [
          "BFS from each node counting reachable within k steps",
          "Best connection = max reachable from tree2 within k-1 steps"
        ],
        "tags": ["graph", "bfs", "tree"],
        "js": "function maxTargetNodes(edges1, edges2, k) {\n  // your code here\n}",
        "py": "def max_target_nodes(edges1, edges2, k):\n    pass",
        "testCases": [
          { "input": "[[0,1],[0,2],[2,3],[2,4]]\n[[0,1],[0,2],[0,3],[2,7],[1,4],[4,5],[4,6]]\n2", "expectedOutput": "[9,7,9,8,8]" },
          { "input": "[[0,1],[0,2],[0,3],[0,4]]\n[[0,1],[1,2],[2,3]]\n1", "expectedOutput": "[6,3,3,3,3]" }
        ],
        "xpReward": 140
      },
      {
        "title": "Evaluate Division",
        "slug": "evaluate-division",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given equations A/B = k, answer queries C/D. Return -1 if not determinable.",
        "examples": [
          { "input": "equations=[[a,b],[b,c]],values=[2.0,3.0],queries=[[a,c],[b,a],[a,e],[a,a],[x,x]]", "output": "[6.0,0.5,-1.0,1.0,-1.0]" },
          { "input": "equations=[[a,b],[b,c],[bc,cd]],values=[1.5,2.5,5.0],queries=[[a,c],[c,b],[bc,cd],[cd,bc]]", "output": "[3.75,0.4,5.0,0.2]" }
        ],
        "constraints": ["1<=equations.length<=20"],
        "hints": [
          "Weighted directed graph: A->B with weight k, B->A with weight 1/k",
          "BFS/DFS for each query multiplying edge weights"
        ],
        "tags": ["graph", "bfs", "dfs", "union-find"],
        "js": "function calcEquation(equations, values, queries) {\n  // your code here\n}",
        "py": "def calc_equation(equations, values, queries):\n    pass",
        "testCases": [
          { "input": "[[\"a\",\"b\"],[\"b\",\"c\"]]\n[2.0,3.0]\n[[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]", "expectedOutput": "[6.00000,0.50000,-1.00000,1.00000,-1.00000]" },
          { "input": "[[\"a\",\"b\"],[\"b\",\"c\"],[\"bc\",\"cd\"]]\n[1.5,2.5,5.0]\n[[\"a\",\"c\"],[\"c\",\"b\"],[\"bc\",\"cd\"],[\"cd\",\"bc\"]]", "expectedOutput": "[3.75000,0.40000,5.00000,0.20000]" }
        ],
        "xpReward": 100
      }
    ]
  },
  {
    "dayNumber": 52,
    "topic": "Advanced String: KMP & Rabin-Karp",
    "lesson": "KMP: build failure function (LPS array) — lps[i] = length of longest proper prefix of pattern[0..i] that is also suffix. Match in O(n+m). Rabin-Karp: rolling hash for O(n+m) average. Z-function: z[i] = length of longest substring starting at i matching a prefix. Use for: repeated pattern detection, string matching, anagram problems.",
    "problems": [
      {
        "title": "Find the Index of the First Occurrence in a String",
        "slug": "find-first-occurrence-string",
        "difficulty": "easy",
        "category": "string",
        "description": "Return the index of first occurrence of needle in haystack, or -1 if not found. Implement in O(n+m).",
        "examples": [
          { "input": "haystack=sadbutsad,needle=sad", "output": "0" },
          { "input": "haystack=leetcode,needle=leeto", "output": "-1" }
        ],
        "constraints": ["1<=haystack.length,needle.length<=10^4"],
        "hints": [
          "KMP: build lps array for needle",
          "Use lps to skip characters in haystack on mismatch"
        ],
        "tags": ["string", "kmp", "two-pointers"],
        "js": "function strStr(haystack, needle) {\n  // your code here\n}",
        "py": "def str_str(haystack, needle):\n    pass",
        "testCases": [
          { "input": "sadbutsad\nsad", "expectedOutput": "0" },
          { "input": "leetcode\nleeto", "expectedOutput": "-1" },
          { "input": "aaa\naaaa", "expectedOutput": "-1", "isHidden": true }
        ],
        "xpReward": 60
      },
      {
        "title": "Shortest Palindrome",
        "slug": "shortest-palindrome",
        "difficulty": "hard",
        "category": "string",
        "description": "Add characters in front of string s to make it a palindrome. Return the shortest such palindrome.",
        "examples": [
          { "input": "s=aacecaaa", "output": "aaacecaaa" },
          { "input": "s=abcd", "output": "dcbabcd" }
        ],
        "constraints": ["0<=s.length<=5*10^4"],
        "hints": [
          "Find longest palindrome prefix using KMP",
          "Concatenate s + '#' + reverse(s); compute lps; last lps value = longest palindrome prefix length"
        ],
        "tags": ["string", "kmp", "two-pointers"],
        "js": "function shortestPalindrome(s) {\n  // your code here\n}",
        "py": "def shortest_palindrome(s):\n    pass",
        "testCases": [
          { "input": "aacecaaa", "expectedOutput": "aaacecaaa" },
          { "input": "abcd", "expectedOutput": "dcbabcd" },
          { "input": "", "expectedOutput": "", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Repeated Substring Pattern",
        "slug": "repeated-substring-pattern",
        "difficulty": "easy",
        "category": "string",
        "description": "Return true if string s can be constructed by repeating a substring of itself.",
        "examples": [
          { "input": "s=abab", "output": "true" },
          { "input": "s=aba", "output": "false" },
          { "input": "s=abcabcabcabc", "output": "true" }
        ],
        "constraints": ["1<=s.length<=10^4"],
        "hints": [
          "KMP lps: if lps[n-1] > 0 and n % (n - lps[n-1]) == 0",
          "Or check if s is in (s+s)[1:-1]"
        ],
        "tags": ["string", "kmp"],
        "js": "function repeatedSubstringPattern(s) {\n  // your code here\n}",
        "py": "def repeated_substring_pattern(s):\n    pass",
        "testCases": [
          { "input": "abab", "expectedOutput": "true" },
          { "input": "aba", "expectedOutput": "false" },
          { "input": "abcabcabcabc", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 60
      },
      {
        "title": "Longest Happy Prefix",
        "slug": "longest-happy-prefix",
        "difficulty": "hard",
        "category": "string",
        "description": "A happy prefix is a prefix which is also a suffix (not the string itself). Return the longest happy prefix of s.",
        "examples": [
          { "input": "s=level", "output": "l" },
          { "input": "s=ababab", "output": "abab" }
        ],
        "constraints": ["1<=s.length<=10^5"],
        "hints": [
          "KMP failure function (lps array)",
          "lps[n-1] gives the length of the longest happy prefix"
        ],
        "tags": ["string", "kmp", "rolling-hash"],
        "js": "function longestPrefix(s) {\n  // your code here\n}",
        "py": "def longest_prefix(s):\n    pass",
        "testCases": [
          { "input": "level", "expectedOutput": "l" },
          { "input": "ababab", "expectedOutput": "abab" },
          { "input": "a", "expectedOutput": "", "isHidden": true }
        ],
        "xpReward": 110
      },
      {
        "title": "Find All Anagrams in a String",
        "slug": "find-all-anagrams",
        "difficulty": "medium",
        "category": "string",
        "description": "Return all start indices of anagrams of p in s.",
        "examples": [
          { "input": "s=cbaebabacd,p=abc", "output": "[0,6]" },
          { "input": "s=abab,p=ab", "output": "[0,1,2]" }
        ],
        "constraints": ["1<=s.length,p.length<=3*10^4"],
        "hints": [
          "Sliding window of size p.length with frequency arrays",
          "Compare frequency arrays each step"
        ],
        "tags": ["string", "sliding-window", "hash-table"],
        "js": "function findAnagrams(s, p) {\n  // your code here\n}",
        "py": "def find_anagrams(s, p):\n    pass",
        "testCases": [
          { "input": "cbaebabacd\nabc", "expectedOutput": "[0,6]" },
          { "input": "abab\nab", "expectedOutput": "[0,1,2]" }
        ],
        "xpReward": 70
      }
    ]
  },
  {
    "dayNumber": 53,
    "topic": "Advanced Dynamic Programming: Knapsack Variants",
    "lesson": "0/1 knapsack: dp[i][w] = max value using items 0..i with capacity w. Optimize to 1D: iterate weight backward. Unbounded knapsack: each item usable unlimited times — iterate weight forward. Subset sum = knapsack with value=weight. Partition = subset sum with target=total/2. Bounded knapsack: binary grouping trick.",
    "problems": [
      {
        "title": "Partition Equal Subset Sum",
        "slug": "partition-equal-subset-sum",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Return true if array can be partitioned into two subsets with equal sum.",
        "examples": [
          { "input": "nums=[1,5,11,5]", "output": "true" },
          { "input": "nums=[1,2,3,5]", "output": "false" }
        ],
        "constraints": ["1<=nums.length<=200", "1<=nums[i]<=100"],
        "hints": [
          "Target = total/2; if odd return false",
          "0/1 knapsack: dp[w] = can we achieve sum w"
        ],
        "tags": ["dynamic-programming", "array"],
        "js": "function canPartition(nums) {\n  // your code here\n}",
        "py": "def can_partition(nums):\n    pass",
        "testCases": [
          { "input": "[1,5,11,5]", "expectedOutput": "true" },
          { "input": "[1,2,3,5]", "expectedOutput": "false" },
          { "input": "[1,1]", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Target Sum",
        "slug": "target-sum",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Assign + or - to each number in nums. Return number of ways to reach target sum.",
        "examples": [
          { "input": "nums=[1,1,1,1,1],target=3", "output": "5" },
          { "input": "nums=[1],target=1", "output": "1" }
        ],
        "constraints": ["1<=nums.length<=20", "0<=nums[i]<=1000", "|target|<=1000"],
        "hints": [
          "Reduce: positive subset P satisfies 2P = total+target",
          "Count subsets with sum = (total+target)/2"
        ],
        "tags": ["dynamic-programming", "array", "backtracking"],
        "js": "function findTargetSumWays(nums, target) {\n  // your code here\n}",
        "py": "def find_target_sum_ways(nums, target):\n    pass",
        "testCases": [
          { "input": "[1,1,1,1,1]\n3", "expectedOutput": "5" },
          { "input": "[1]\n1", "expectedOutput": "1" },
          { "input": "[0,0,0,0,0,0,0,0,1]\n1", "expectedOutput": "256", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Coin Change II",
        "slug": "coin-change-ii",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Return number of combinations to make amount using coins (unlimited supply of each).",
        "examples": [
          { "input": "amount=5,coins=[1,2,5]", "output": "4" },
          { "input": "amount=3,coins=[2]", "output": "0" },
          { "input": "amount=10,coins=[10]", "output": "1" }
        ],
        "constraints": ["1<=coins.length<=300", "1<=amount<=5000"],
        "hints": [
          "Unbounded knapsack: dp[w] = number of ways to make w",
          "Iterate coins outer, amount inner (forward) to avoid counting permutations"
        ],
        "tags": ["dynamic-programming", "array"],
        "js": "function change(amount, coins) {\n  // your code here\n}",
        "py": "def change(amount, coins):\n    pass",
        "testCases": [
          { "input": "5\n[1,2,5]", "expectedOutput": "4" },
          { "input": "3\n[2]", "expectedOutput": "0" },
          { "input": "10\n[10]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Last Stone Weight II",
        "slug": "last-stone-weight-ii",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Smash stones and take absolute differences. Return minimum possible weight of remaining stone (or 0).",
        "examples": [
          { "input": "stones=[2,7,4,1,8,1]", "output": "1" },
          { "input": "stones=[31,26,33,21,40]", "output": "5" }
        ],
        "constraints": ["1<=stones.length<=30", "1<=stones[i]<=100"],
        "hints": [
          "Minimize |S1 - S2| = partition into two groups with minimum sum difference",
          "Target = total/2; largest reachable subset sum S gives answer total - 2*S"
        ],
        "tags": ["dynamic-programming", "array"],
        "js": "function lastStoneWeightII(stones) {\n  // your code here\n}",
        "py": "def last_stone_weight_ii(stones):\n    pass",
        "testCases": [
          { "input": "[2,7,4,1,8,1]", "expectedOutput": "1" },
          { "input": "[31,26,33,21,40]", "expectedOutput": "5" }
        ],
        "xpReward": 90
      },
      {
        "title": "Profitable Schemes",
        "slug": "profitable-schemes",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "n gang members, minProfit required. Each crime needs group[i] members and generates profit[i]. Return number of schemes with at least minProfit, using at most n members.",
        "examples": [
          { "input": "n=5,minProfit=3,group=[2,2],profit=[2,3]", "output": "2" },
          { "input": "n=10,minProfit=5,group=[2,3,5],profit=[6,7,8]", "output": "7" }
        ],
        "constraints": ["1<=n<=100", "0<=minProfit<=100", "1<=group.length<=100"],
        "hints": [
          "2D knapsack: dp[members][profit] = number of schemes",
          "Profit dimension capped at minProfit (profit >= minProfit all counted together)"
        ],
        "tags": ["dynamic-programming", "array"],
        "js": "function profitableSchemes(n, minProfit, group, profit) {\n  // your code here\n}",
        "py": "def profitable_schemes(n, min_profit, group, profit):\n    pass",
        "testCases": [
          { "input": "5\n3\n[2,2]\n[2,3]", "expectedOutput": "2" },
          { "input": "10\n5\n[2,3,5]\n[6,7,8]", "expectedOutput": "7" }
        ],
        "xpReward": 130
      }
    ]
  },
  {
    "dayNumber": 54,
    "topic": "Advanced Recursion & Divide and Conquer",
    "lesson": "Divide and conquer: split problem into subproblems, solve recursively, merge. Master theorem: T(n)=aT(n/b)+O(n^d). Merge sort O(n log n). Quick select O(n) average for kth element. Closest pair O(n log n). Key: define base case clearly, ensure subproblems are smaller, merge step is correct. Recursion tree helps analyze complexity.",
    "problems": [
      {
        "title": "Sort an Array",
        "slug": "sort-an-array",
        "difficulty": "medium",
        "category": "divide-and-conquer",
        "description": "Sort array in ascending order. Implement merge sort or heap sort in O(n log n).",
        "examples": [
          { "input": "nums=[5,2,3,1]", "output": "[1,2,3,5]" },
          { "input": "nums=[5,1,1,2,0,0]", "output": "[0,0,1,1,2,5]" }
        ],
        "constraints": ["1<=nums.length<=5*10^4", "-5*10^4<=nums[i]<=5*10^4"],
        "hints": [
          "Merge sort: split at mid, sort each half, merge",
          "Merge: two-pointer comparison into auxiliary array"
        ],
        "tags": ["divide-and-conquer", "sorting", "array"],
        "js": "function sortArray(nums) {\n  // your code here\n}",
        "py": "def sort_array(nums):\n    pass",
        "testCases": [
          { "input": "[5,2,3,1]", "expectedOutput": "[1,2,3,5]" },
          { "input": "[5,1,1,2,0,0]", "expectedOutput": "[0,0,1,1,2,5]" },
          { "input": "[-4,0,7,4,9,-5,-1,0,-7,-1]", "expectedOutput": "[-7,-5,-4,-1,-1,0,0,4,7,9]", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Kth Largest Element in an Array",
        "slug": "kth-largest-element",
        "difficulty": "medium",
        "category": "divide-and-conquer",
        "description": "Return the kth largest element in unsorted array. Solve without full sort.",
        "examples": [
          { "input": "nums=[3,2,1,5,6,4],k=2", "output": "5" },
          { "input": "nums=[3,2,3,1,2,4,5,5,6],k=4", "output": "4" }
        ],
        "constraints": ["1<=k<=nums.length<=10^5"],
        "hints": [
          "Quickselect: partition around pivot; recurse only into the side containing kth",
          "Average O(n); min-heap of size k also works in O(n log k)"
        ],
        "tags": ["divide-and-conquer", "array", "sorting", "heap"],
        "js": "function findKthLargest(nums, k) {\n  // your code here\n}",
        "py": "def find_kth_largest(nums, k):\n    pass",
        "testCases": [
          { "input": "[3,2,1,5,6,4]\n2", "expectedOutput": "5" },
          { "input": "[3,2,3,1,2,4,5,5,6]\n4", "expectedOutput": "4" }
        ],
        "xpReward": 80
      },
      {
        "title": "Majority Element II",
        "slug": "majority-element-ii",
        "difficulty": "medium",
        "category": "divide-and-conquer",
        "description": "Return all elements appearing more than n/3 times in linear time and O(1) space.",
        "examples": [
          { "input": "nums=[3,2,3]", "output": "[3]" },
          { "input": "nums=[1,2]", "output": "[1,2]" },
          { "input": "nums=[1,1,1,3,3,2,2,2]", "output": "[1,2]" }
        ],
        "constraints": ["1<=nums.length<=5*10^4"],
        "hints": [
          "Boyer-Moore voting extended to 2 candidates",
          "At most 2 elements can appear more than n/3 times"
        ],
        "tags": ["divide-and-conquer", "array", "counting"],
        "js": "function majorityElement(nums) {\n  // your code here\n}",
        "py": "def majority_element(nums):\n    pass",
        "testCases": [
          { "input": "[3,2,3]", "expectedOutput": "[3]" },
          { "input": "[1,2]", "expectedOutput": "[1,2]" },
          { "input": "[1,1,1,3,3,2,2,2]", "expectedOutput": "[1,2]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Count of Range Sum",
        "slug": "count-of-range-sum",
        "difficulty": "hard",
        "category": "divide-and-conquer",
        "description": "Return number of range sums in prefix sums array that lie in [lower, upper] inclusive.",
        "examples": [
          { "input": "nums=[-2,5,-1],lower=-2,upper=2", "output": "3" },
          { "input": "nums=[0],lower=0,upper=0", "output": "1" }
        ],
        "constraints": ["1<=nums.length<=10^5", "-2^31<=nums[i]<=2^31-1"],
        "hints": [
          "Merge sort on prefix sums",
          "During merge, count pairs (i,j) where lower <= prefix[j]-prefix[i] <= upper"
        ],
        "tags": ["divide-and-conquer", "array", "binary-search", "merge-sort"],
        "js": "function countRangeSum(nums, lower, upper) {\n  // your code here\n}",
        "py": "def count_range_sum(nums, lower, upper):\n    pass",
        "testCases": [
          { "input": "[-2,5,-1]\n-2\n2", "expectedOutput": "3" },
          { "input": "[0]\n0\n0", "expectedOutput": "1" }
        ],
        "xpReward": 140
      },
      {
        "title": "Beautiful Array",
        "slug": "beautiful-array",
        "difficulty": "medium",
        "category": "divide-and-conquer",
        "description": "Array is beautiful if for every i<k<j, nums[k]*2 != nums[i]+nums[j]. Return any beautiful array of length n.",
        "examples": [
          { "input": "n=4", "output": "[2,1,4,3]" },
          { "input": "n=5", "output": "[3,1,2,5,4]" }
        ],
        "constraints": ["1<=n<=1000"],
        "hints": [
          "Divide and conquer: separate into odd and even indexed elements",
          "If A is beautiful: 2*A-1 (all odd) and 2*A (all even) concat stays beautiful"
        ],
        "tags": ["divide-and-conquer", "array", "math"],
        "js": "function beautifulArray(n) {\n  // your code here\n}",
        "py": "def beautiful_array(n):\n    pass",
        "testCases": [
          { "input": "4", "expectedOutput": "[2,1,4,3]" },
          { "input": "5", "expectedOutput": "[3,1,2,5,4]" }
        ],
        "xpReward": 100
      }
    ]
  },
  {
    "dayNumber": 55,
    "topic": "Math & Number Theory",
    "lesson": "Sieve of Eratosthenes: O(n log log n) for all primes up to n. GCD: Euclidean algorithm gcd(a,b)=gcd(b,a%b). LCM = a*b/gcd. Modular exponentiation: fast power in O(log n). Combinatorics: nCr = nCr-1 + n-1Cr-1. Chinese Remainder Theorem for modular systems. Euler's totient for coprimes. These patterns appear in competitive programming.",
    "problems": [
      {
        "title": "Count Primes",
        "slug": "count-primes",
        "difficulty": "medium",
        "category": "math",
        "description": "Return number of prime numbers strictly less than n.",
        "examples": [
          { "input": "n=10", "output": "4" },
          { "input": "n=0", "output": "0" },
          { "input": "n=1", "output": "0" }
        ],
        "constraints": ["0<=n<=5*10^6"],
        "hints": [
          "Sieve of Eratosthenes",
          "Mark composites starting from p^2 for each prime p"
        ],
        "tags": ["math", "array", "sieve"],
        "js": "function countPrimes(n) {\n  // your code here\n}",
        "py": "def count_primes(n):\n    pass",
        "testCases": [
          { "input": "10", "expectedOutput": "4" },
          { "input": "0", "expectedOutput": "0" },
          { "input": "1", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 60
      },
      {
        "title": "Power of Three",
        "slug": "power-of-three",
        "difficulty": "easy",
        "category": "math",
        "description": "Return true if n is a power of three without using loops or recursion.",
        "examples": [
          { "input": "n=27", "output": "true" },
          { "input": "n=0", "output": "false" },
          { "input": "n=9", "output": "true" },
          { "input": "n=45", "output": "false" }
        ],
        "constraints": ["-2^31<=n<=2^31-1"],
        "hints": [
          "Largest power of 3 fitting in int32 is 3^19=1162261467",
          "n > 0 && 1162261467 % n == 0"
        ],
        "tags": ["math"],
        "js": "function isPowerOfThree(n) {\n  // your code here\n}",
        "py": "def is_power_of_three(n):\n    pass",
        "testCases": [
          { "input": "27", "expectedOutput": "true" },
          { "input": "0", "expectedOutput": "false" },
          { "input": "9", "expectedOutput": "true" },
          { "input": "45", "expectedOutput": "false", "isHidden": true }
        ],
        "xpReward": 40
      },
      {
        "title": "Ugly Number II",
        "slug": "ugly-number-ii",
        "difficulty": "medium",
        "category": "math",
        "description": "Return the nth ugly number. Ugly numbers have only prime factors 2, 3, and 5.",
        "examples": [
          { "input": "n=10", "output": "12" },
          { "input": "n=1", "output": "1" }
        ],
        "constraints": ["1<=n<=1690"],
        "hints": [
          "Three pointers p2, p3, p5 tracking next multiples",
          "Next ugly = min(ugly[p2]*2, ugly[p3]*3, ugly[p5]*5); advance matching pointers"
        ],
        "tags": ["math", "dynamic-programming", "heap"],
        "js": "function nthUglyNumber(n) {\n  // your code here\n}",
        "py": "def nth_ugly_number(n):\n    pass",
        "testCases": [
          { "input": "10", "expectedOutput": "12" },
          { "input": "1", "expectedOutput": "1" },
          { "input": "15", "expectedOutput": "24", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Super Pow",
        "slug": "super-pow",
        "difficulty": "medium",
        "category": "math",
        "description": "Calculate a^b mod 1337 where b is given as array of digits.",
        "examples": [
          { "input": "a=2,b=[3]", "output": "8" },
          { "input": "a=2,b=[1,0]", "output": "1024" },
          { "input": "a=1,b=[4,3,3,8,8,2]", "output": "1" },
          { "input": "a=2147483647,b=[2,0,0]", "output": "1198" }
        ],
        "constraints": ["1<=a<=2^31-1", "1<=b.length<=2000"],
        "hints": [
          "a^[d1,d2,...,dk] = (a^[d1,...,dk-1])^10 * a^dk",
          "Fast power mod at each step"
        ],
        "tags": ["math", "divide-and-conquer"],
        "js": "function superPow(a, b) {\n  // your code here\n}",
        "py": "def super_pow(a, b):\n    pass",
        "testCases": [
          { "input": "2\n[3]", "expectedOutput": "8" },
          { "input": "2\n[1,0]", "expectedOutput": "1024" },
          { "input": "2147483647\n[2,0,0]", "expectedOutput": "1198", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Largest Number",
        "slug": "largest-number",
        "difficulty": "medium",
        "category": "math",
        "description": "Given list of non-negative integers, arrange them to form the largest number. Return as string.",
        "examples": [
          { "input": "nums=[10,2]", "output": "210" },
          { "input": "nums=[3,30,34,5,9]", "output": "9534330" }
        ],
        "constraints": ["1<=nums.length<=100", "0<=nums[i]<=10^9"],
        "hints": [
          "Custom comparator: compare a+b vs b+a as strings",
          "If all zeros, return '0'"
        ],
        "tags": ["math", "sorting", "greedy", "string"],
        "js": "function largestNumber(nums) {\n  // your code here\n}",
        "py": "def largest_number(nums):\n    pass",
        "testCases": [
          { "input": "[10,2]", "expectedOutput": "210" },
          { "input": "[3,30,34,5,9]", "expectedOutput": "9534330" },
          { "input": "[0,0]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 56,
    "topic": "Advanced Tree: BST & Balanced Trees",
    "lesson": "BST property: left < node < right. Inorder traversal gives sorted order. Successor/predecessor: go right-then-leftmost (or left-then-rightmost). BST balancing: AVL rotations. Range queries on BST: O(log n + k). For interval problems: augment BST with subtree max endpoint. Most BST interview problems are solved with inorder + some state.",
    "problems": [
      {
        "title": "Recover Binary Search Tree",
        "slug": "recover-bst",
        "difficulty": "hard",
        "category": "tree",
        "description": "Two nodes of a BST are swapped. Recover the tree without changing its structure.",
        "examples": [
          { "input": "root=[1,3,null,null,2]", "output": "[3,1,null,null,2]" },
          { "input": "root=[3,1,4,null,null,2]", "output": "[2,1,4,null,null,3]" }
        ],
        "constraints": ["2<=nodes<=1000"],
        "hints": [
          "Inorder traversal; find where order is violated (first and second swapped nodes)",
          "First violation: prev > curr (first = prev, second = curr); second violation: second = curr"
        ],
        "tags": ["tree", "dfs", "bst"],
        "js": "function recoverTree(root) {\n  // modify in-place\n}",
        "py": "def recover_tree(root):\n    pass",
        "testCases": [
          { "input": "[1,3,null,null,2]", "expectedOutput": "[3,1,null,null,2]" },
          { "input": "[3,1,4,null,null,2]", "expectedOutput": "[2,1,4,null,null,3]" }
        ],
        "xpReward": 120
      },
      {
        "title": "Count of Smaller Numbers After Self",
        "slug": "bst-count-smaller-after-self",
        "difficulty": "hard",
        "category": "tree",
        "description": "For each element in nums, count elements to its right that are smaller. Return the counts array.",
        "examples": [
          { "input": "nums=[5,2,6,1]", "output": "[2,1,1,0]" },
          { "input": "nums=[-1,-1]", "output": "[0,0]" }
        ],
        "constraints": ["1<=nums.length<=10^5"],
        "hints": [
          "BST insertion from right to left; track smaller count via left-subtree sizes",
          "Or merge sort / Fenwick tree approach"
        ],
        "tags": ["tree", "bst", "divide-and-conquer"],
        "js": "function countSmaller(nums) {\n  // your code here\n}",
        "py": "def count_smaller(nums):\n    pass",
        "testCases": [
          { "input": "[5,2,6,1]", "expectedOutput": "[2,1,1,0]" },
          { "input": "[-1,-1]", "expectedOutput": "[0,0]" }
        ],
        "xpReward": 120
      },
      {
        "title": "Kth Smallest Element in a BST",
        "slug": "kth-smallest-bst",
        "difficulty": "medium",
        "category": "tree",
        "description": "Return the kth smallest element in BST. Follow-up: handle frequent inserts and kth-queries.",
        "examples": [
          { "input": "root=[3,1,4,null,2],k=1", "output": "1" },
          { "input": "root=[5,3,6,2,4,null,null,1],k=3", "output": "3" }
        ],
        "constraints": ["1<=k<=nodes<=10^4"],
        "hints": [
          "Inorder traversal (left, root, right) gives ascending order",
          "Stop early when kth element found"
        ],
        "tags": ["tree", "dfs", "bst"],
        "js": "function kthSmallest(root, k) {\n  // your code here\n}",
        "py": "def kth_smallest(root, k):\n    pass",
        "testCases": [
          { "input": "[3,1,4,null,2]\n1", "expectedOutput": "1" },
          { "input": "[5,3,6,2,4,null,null,1]\n3", "expectedOutput": "3" }
        ],
        "xpReward": 70
      },
      {
        "title": "Serialize and Deserialize BST",
        "slug": "serialize-deserialize-bst",
        "difficulty": "medium",
        "category": "tree",
        "description": "Design an algorithm to serialize and deserialize a BST more efficiently than a generic binary tree.",
        "examples": [
          { "input": "root=[2,1,3]", "output": "2,1,3" }
        ],
        "constraints": ["0<=nodes<=10^4", "0<=Node.val<=10^4"],
        "hints": [
          "Preorder gives compact BST encoding (no nulls needed)",
          "Deserialize: use preorder values with BST property to reconstruct"
        ],
        "tags": ["tree", "bst", "design"],
        "js": "function serialize(root) {}\nfunction deserialize(data) {}",
        "py": "def serialize(root):\n    pass\ndef deserialize(data):\n    pass",
        "testCases": [
          { "input": "[2,1,3]", "expectedOutput": "[2,1,3]" },
          { "input": "[]", "expectedOutput": "[]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Balance a Binary Search Tree",
        "slug": "balance-bst",
        "difficulty": "medium",
        "category": "tree",
        "description": "Given BST, return a balanced BST with same node values.",
        "examples": [
          { "input": "root=[1,null,2,null,3,null,4]", "output": "[2,1,3,null,null,null,4]" },
          { "input": "root=[2,1,3]", "output": "[2,1,3]" }
        ],
        "constraints": ["1<=nodes<=10^4", "1<=Node.val<=10^5"],
        "hints": [
          "Inorder traversal to get sorted array",
          "Build balanced BST from sorted array: middle as root, recurse"
        ],
        "tags": ["tree", "bst", "divide-and-conquer"],
        "js": "function balanceBST(root) {\n  // your code here\n}",
        "py": "def balance_bst(root):\n    pass",
        "testCases": [
          { "input": "[1,null,2,null,3,null,4]", "expectedOutput": "[2,1,3,null,null,null,4]" },
          { "input": "[2,1,3]", "expectedOutput": "[2,1,3]" }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 57,
    "topic": "Intervals & Sweep Line",
    "lesson": "Interval problems: sort by start. Merge overlapping: track max end. Meeting rooms: sort starts and ends separately. Sweep line: events at interval endpoints, sort, process in order. For k overlapping: priority queue of end times. Key insight: events (start=+1, end=-1) transform interval problems into point problems.",
    "problems": [
      {
        "title": "Merge Intervals",
        "slug": "merge-intervals",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Merge all overlapping intervals and return the non-overlapping intervals.",
        "examples": [
          { "input": "intervals=[[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]" },
          { "input": "intervals=[[1,4],[4,5]]", "output": "[[1,5]]" }
        ],
        "constraints": ["1<=intervals.length<=10^4"],
        "hints": [
          "Sort by start time",
          "Merge when current.start <= last merged end"
        ],
        "tags": ["intervals", "array", "sorting"],
        "js": "function merge(intervals) {\n  // your code here\n}",
        "py": "def merge(intervals):\n    pass",
        "testCases": [
          { "input": "[[1,3],[2,6],[8,10],[15,18]]", "expectedOutput": "[[1,6],[8,10],[15,18]]" },
          { "input": "[[1,4],[4,5]]", "expectedOutput": "[[1,5]]" },
          { "input": "[[1,4],[0,4]]", "expectedOutput": "[[0,4]]", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Insert Interval",
        "slug": "insert-interval",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Insert newInterval into sorted non-overlapping intervals, merging if necessary.",
        "examples": [
          { "input": "intervals=[[1,3],[6,9]],newInterval=[2,5]", "output": "[[1,5],[6,9]]" },
          { "input": "intervals=[[1,2],[3,5],[6,7],[8,10],[12,16]],newInterval=[4,8]", "output": "[[1,2],[3,10],[12,16]]" }
        ],
        "constraints": ["0<=intervals.length<=10^4"],
        "hints": [
          "Add all intervals ending before newInterval.start",
          "Merge all overlapping; add remaining"
        ],
        "tags": ["intervals", "array"],
        "js": "function insert(intervals, newInterval) {\n  // your code here\n}",
        "py": "def insert(intervals, new_interval):\n    pass",
        "testCases": [
          { "input": "[[1,3],[6,9]]\n[2,5]", "expectedOutput": "[[1,5],[6,9]]" },
          { "input": "[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]", "expectedOutput": "[[1,2],[3,10],[12,16]]" },
          { "input": "[]\n[5,7]", "expectedOutput": "[[5,7]]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Non-overlapping Intervals",
        "slug": "non-overlapping-intervals",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Return minimum number of intervals to remove to make the rest non-overlapping.",
        "examples": [
          { "input": "intervals=[[1,2],[2,3],[3,4],[1,3]]", "output": "1" },
          { "input": "intervals=[[1,2],[1,2],[1,2]]", "output": "2" },
          { "input": "intervals=[[1,2],[2,3]]", "output": "0" }
        ],
        "constraints": ["1<=intervals.length<=10^5"],
        "hints": [
          "Sort by end time (greedy: keep interval ending earliest)",
          "Greedily select non-overlapping; count removed = total - selected"
        ],
        "tags": ["intervals", "greedy", "sorting"],
        "js": "function eraseOverlapIntervals(intervals) {\n  // your code here\n}",
        "py": "def erase_overlap_intervals(intervals):\n    pass",
        "testCases": [
          { "input": "[[1,2],[2,3],[3,4],[1,3]]", "expectedOutput": "1" },
          { "input": "[[1,2],[1,2],[1,2]]", "expectedOutput": "2" },
          { "input": "[[1,2],[2,3]]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Meeting Rooms II",
        "slug": "meeting-rooms-ii",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Given meeting time intervals, return minimum number of conference rooms required.",
        "examples": [
          { "input": "intervals=[[0,30],[5,10],[15,20]]", "output": "2" },
          { "input": "intervals=[[7,10],[2,4]]", "output": "1" }
        ],
        "constraints": ["1<=intervals.length<=10^4"],
        "hints": [
          "Min-heap of end times; for each start, if start >= heap min, reuse room (pop)",
          "Heap size = rooms needed"
        ],
        "tags": ["intervals", "heap", "sorting", "sweep-line"],
        "js": "function minMeetingRooms(intervals) {\n  // your code here\n}",
        "py": "def min_meeting_rooms(intervals):\n    pass",
        "testCases": [
          { "input": "[[0,30],[5,10],[15,20]]", "expectedOutput": "2" },
          { "input": "[[7,10],[2,4]]", "expectedOutput": "1" },
          { "input": "[[1,5],[8,9],[2,3],[5,8]]", "expectedOutput": "2", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "The Skyline Problem",
        "slug": "skyline-problem",
        "difficulty": "hard",
        "category": "intervals",
        "description": "Given buildings [left, right, height], return skyline as list of [x, height] key points.",
        "examples": [
          { "input": "buildings=[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]", "output": "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]" },
          { "input": "buildings=[[0,2,3],[2,5,3]]", "output": "[[0,3],[5,0]]" }
        ],
        "constraints": ["1<=buildings.length<=10^4"],
        "hints": [
          "Sweep line with events: (x, -h) for start, (x, h) for end",
          "Max-heap of active heights; output when max height changes"
        ],
        "tags": ["intervals", "heap", "sweep-line", "divide-and-conquer"],
        "js": "function getSkyline(buildings) {\n  // your code here\n}",
        "py": "def get_skyline(buildings):\n    pass",
        "testCases": [
          { "input": "[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]", "expectedOutput": "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]" },
          { "input": "[[0,2,3],[2,5,3]]", "expectedOutput": "[[0,3],[5,0]]" }
        ],
        "xpReward": 140
      }
    ]
  },
  {
    "dayNumber": 58,
    "topic": "Advanced DP: Game Theory & Minimax",
    "lesson": "Game theory DP: define win/lose states. If any move leads to a losing state for opponent → current is winning. Nim: XOR of pile sizes; if 0 losing position. Sprague-Grundy theorem generalizes Nim. Minimax: alpha-beta pruning. Stone game problems often have math shortcuts. Key: think recursively about 'whose turn' and 'what moves are available'.",
    "problems": [
      {
        "title": "Stone Game",
        "slug": "stone-game",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Alice and Bob take stones from either end of even-length array. Both play optimally. Does Alice always win?",
        "examples": [
          { "input": "piles=[5,3,4,5]", "output": "true" },
          { "input": "piles=[3,7,2,3]", "output": "true" }
        ],
        "constraints": ["2<=piles.length<=500", "piles.length is even"],
        "hints": [
          "Alice always wins (math: she can always take all odd or all even piles)",
          "DP approach: dp[i][j] = max score difference for current player on piles[i..j]"
        ],
        "tags": ["dynamic-programming", "game-theory", "math"],
        "js": "function stoneGame(piles) {\n  // your code here\n}",
        "py": "def stone_game(piles):\n    pass",
        "testCases": [
          { "input": "[5,3,4,5]", "expectedOutput": "true" },
          { "input": "[3,7,2,3]", "expectedOutput": "true" }
        ],
        "xpReward": 70
      },
      {
        "title": "Stone Game II",
        "slug": "stone-game-ii",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Alice and Bob alternate. On each turn player takes 1 to 2M piles from front, then M = max(M, piles taken). Return max stones Alice can get.",
        "examples": [
          { "input": "piles=[2,7,9,4,4]", "output": "10" },
          { "input": "piles=[1,2,3,4,5,100]", "output": "104" }
        ],
        "constraints": ["1<=piles.length<=100", "1<=piles[i]<=10^4"],
        "hints": [
          "dp[i][m] = max stones current player can get from piles[i..] with current M=m",
          "Use suffix sums; try all X from 1 to 2M"
        ],
        "tags": ["dynamic-programming", "game-theory", "array"],
        "js": "function stoneGameII(piles) {\n  // your code here\n}",
        "py": "def stone_game_ii(piles):\n    pass",
        "testCases": [
          { "input": "[2,7,9,4,4]", "expectedOutput": "10" },
          { "input": "[1,2,3,4,5,100]", "expectedOutput": "104" }
        ],
        "xpReward": 100
      },
      {
        "title": "Predict the Winner",
        "slug": "predict-the-winner",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Two players take from either end of array. Return true if player 1 can win or tie.",
        "examples": [
          { "input": "nums=[1,5,2]", "output": "false" },
          { "input": "nums=[1,5,233,7]", "output": "true" }
        ],
        "constraints": ["1<=nums.length<=20"],
        "hints": [
          "dp[i][j] = max score difference (current player - opponent) on nums[i..j]",
          "dp[i][j] = max(nums[i]-dp[i+1][j], nums[j]-dp[i][j-1])"
        ],
        "tags": ["dynamic-programming", "game-theory", "recursion"],
        "js": "function predictTheWinner(nums) {\n  // your code here\n}",
        "py": "def predict_the_winner(nums):\n    pass",
        "testCases": [
          { "input": "[1,5,2]", "expectedOutput": "false" },
          { "input": "[1,5,233,7]", "expectedOutput": "true" },
          { "input": "[1,1]", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Nim Game",
        "slug": "nim-game",
        "difficulty": "easy",
        "category": "dynamic-programming",
        "description": "Heap of n stones. Players remove 1, 2, or 3 stones per turn. Player removing last stone wins. Can you win?",
        "examples": [
          { "input": "n=4", "output": "false" },
          { "input": "n=1", "output": "true" },
          { "input": "n=2", "output": "true" }
        ],
        "constraints": ["1<=n<=2^31-1"],
        "hints": [
          "You lose if and only if n is divisible by 4",
          "Pattern: 4,8,12,... are all losing positions"
        ],
        "tags": ["dynamic-programming", "game-theory", "math"],
        "js": "function canWinNim(n) {\n  // your code here\n}",
        "py": "def can_win_nim(n):\n    pass",
        "testCases": [
          { "input": "4", "expectedOutput": "false" },
          { "input": "1", "expectedOutput": "true" },
          { "input": "2", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 40
      },
      {
        "title": "Cat and Mouse",
        "slug": "cat-and-mouse",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Cat and mouse on undirected graph. Mouse at 1, cat at 2, hole at 0. Both move optimally. Return 1 if mouse wins, 2 if cat wins, 0 if draw.",
        "examples": [
          { "input": "graph=[[2,5],[3],[0,4,5],[1,4,5],[2,3],[0,2,3]]", "output": "0" },
          { "input": "graph=[[1,3],[0],[3],[0,2]]", "output": "1" }
        ],
        "constraints": ["3<=graph.length<=50"],
        "hints": [
          "State: (turn, mouse_pos, cat_pos); game has 2*n*n states",
          "BFS from known winning/losing states backward (retrograde analysis)"
        ],
        "tags": ["dynamic-programming", "game-theory", "graph", "bfs"],
        "js": "function catMouseGame(graph) {\n  // your code here\n}",
        "py": "def cat_mouse_game(graph):\n    pass",
        "testCases": [
          { "input": "[[2,5],[3],[0,4,5],[1,4,5],[2,3],[0,2,3]]", "expectedOutput": "0" },
          { "input": "[[1,3],[0],[3],[0,2]]", "expectedOutput": "1" }
        ],
        "xpReward": 150
      }
    ]
  },
  {
    "dayNumber": 59,
    "topic": "Randomized Algorithms & Reservoir Sampling",
    "lesson": "Reservoir sampling: select k items from stream of unknown size n — each item has k/n probability. Algorithm: fill reservoir with first k; for i>=k, replace reservoir[rand(i+1)] with probability k/(i+1). Fisher-Yates shuffle: O(n) unbiased. Skip list: O(log n) expected for search/insert. Randomized quicksort/quickselect: O(n) average.",
    "problems": [
      {
        "title": "Shuffle an Array",
        "slug": "shuffle-array",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Implement Solution with reset() (returns original) and shuffle() (returns random permutation where all permutations equally likely).",
        "examples": [
          { "input": "nums=[1,2,3],shuffle(),reset(),shuffle()", "output": "any valid permutation" }
        ],
        "constraints": ["1<=nums.length<=50", "All elements unique"],
        "hints": [
          "Fisher-Yates: for i from n-1 to 1, swap nums[i] with nums[rand(0, i)]",
          "Store original copy for reset"
        ],
        "tags": ["randomized", "array", "design"],
        "js": "class Solution {\n  constructor(nums) {}\n  reset() {}\n  shuffle() {}\n}",
        "py": "class Solution:\n    def __init__(self, nums):\n        pass\n    def reset(self):\n        pass\n    def shuffle(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[1,2,3]\nshuffle\nreset\nshuffle", "expectedOutput": "null\nnull\n[1,2,3]\nnull" }
        ],
        "xpReward": 70
      },
      {
        "title": "Random Pick with Weight",
        "slug": "random-pick-weight",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Given weights w, implement pickIndex() returning index i with probability w[i]/sum(w).",
        "examples": [
          { "input": "w=[1],pickIndex()->0", "output": "0" },
          { "input": "w=[1,3],pickIndex() called 4 times", "output": "roughly [0,1,1,1]" }
        ],
        "constraints": ["1<=w.length<=10^4", "1<=w[i]<=10^5"],
        "hints": [
          "Prefix sum array; generate random in [0, total)",
          "Binary search for first prefix sum > random value"
        ],
        "tags": ["randomized", "binary-search", "prefix-sum"],
        "js": "class Solution {\n  constructor(w) {}\n  pickIndex() {}\n}",
        "py": "class Solution:\n    def __init__(self, w):\n        pass\n    def pick_index(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[1]\npickIndex", "expectedOutput": "null\n0" },
          { "input": "Solution\n[1,3]\npickIndex\npickIndex\npickIndex\npickIndex", "expectedOutput": "null\n1\n1\n1\n1" }
        ],
        "xpReward": 80
      },
      {
        "title": "Linked List Random Node",
        "slug": "linked-list-random-node",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Given linked list, implement getRandom() returning a node value uniformly at random without knowing list length.",
        "examples": [
          { "input": "head=[1,2,3],getRandom()", "output": "1 or 2 or 3 with equal probability" }
        ],
        "constraints": ["1<=nodes<=10^4", "At most 10^4 calls"],
        "hints": [
          "Reservoir sampling with k=1",
          "For ith node (0-indexed), replace result with probability 1/(i+1)"
        ],
        "tags": ["randomized", "linked-list", "reservoir-sampling"],
        "js": "class Solution {\n  constructor(head) {}\n  getRandom() {}\n}",
        "py": "class Solution:\n    def __init__(self, head):\n        pass\n    def get_random(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[1,2,3]\ngetRandom\ngetRandom\ngetRandom", "expectedOutput": "null\n1\n1\n2" }
        ],
        "xpReward": 80
      },
      {
        "title": "Random Point in Non-overlapping Rectangles",
        "slug": "random-point-rectangles",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Given list of non-overlapping axis-aligned rectangles, return a random integer point uniformly from all points covered.",
        "examples": [
          { "input": "rects=[[-2,-2,-1,-1],[1,0,3,0]],pick()", "output": "any point in the rectangles with equal probability" }
        ],
        "constraints": ["1<=rects.length<=100"],
        "hints": [
          "Weight each rectangle by its area (point count)",
          "Pick rectangle by weighted random, then uniform random point inside"
        ],
        "tags": ["randomized", "binary-search", "prefix-sum"],
        "js": "class Solution {\n  constructor(rects) {}\n  pick() {}\n}",
        "py": "class Solution:\n    def __init__(self, rects):\n        pass\n    def pick(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[[-2,-2,-1,-1],[1,0,3,0]]\npick\npick\npick", "expectedOutput": "null\n[-1,-2]\n[-2,-2]\n[-2,-1]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Implement Rand10 Using Rand7",
        "slug": "rand10-using-rand7",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Given rand7() returning uniform random in [1,7], implement rand10() returning uniform random in [1,10].",
        "examples": [
          { "input": "rand10() called multiple times", "output": "each call returns integer in [1,10] uniformly" }
        ],
        "constraints": ["At most 10^5 calls"],
        "hints": [
          "(rand7()-1)*7 + (rand7()-1) gives uniform [0,48]",
          "Reject >= 40; return remainder%10 + 1"
        ],
        "tags": ["randomized", "math", "rejection-sampling"],
        "js": "function rand10() {\n  // your code here (rand7 is given)\n}",
        "py": "def rand10():\n    pass  # rand7 is given",
        "testCases": [
          { "input": "rand10\nrand10\nrand10", "expectedOutput": "2\n8\n5" }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 60,
    "topic": "Comprehensive Mock Interview Day",
    "lesson": "Day 60 — interview simulation. These problems combine multiple patterns. Approach: (1) Clarify constraints and edge cases. (2) Brute force solution and complexity. (3) Optimize — identify bottleneck. (4) Code cleanly. (5) Test with examples and edge cases. Common patterns: reduce to known problem, think about invariants, work backwards from the answer.",
    "problems": [
      {
        "title": "Median of Two Sorted Arrays",
        "slug": "median-two-sorted-arrays",
        "difficulty": "hard",
        "category": "binary-search",
        "description": "Find median of two sorted arrays in O(log(m+n)).",
        "examples": [
          { "input": "nums1=[1,3],nums2=[2]", "output": "2.0" },
          { "input": "nums1=[1,2],nums2=[3,4]", "output": "2.5" }
        ],
        "constraints": ["0<=m,n<=1000", "At least one non-empty array"],
        "hints": [
          "Binary search on partition of smaller array",
          "Ensure left half total = (m+n+1)/2; check max-left <= min-right for both arrays"
        ],
        "tags": ["binary-search", "array", "divide-and-conquer"],
        "js": "function findMedianSortedArrays(nums1, nums2) {\n  // your code here\n}",
        "py": "def find_median_sorted_arrays(nums1, nums2):\n    pass",
        "testCases": [
          { "input": "[1,3]\n[2]", "expectedOutput": "2.00000" },
          { "input": "[1,2]\n[3,4]", "expectedOutput": "2.50000" },
          { "input": "[]\n[1]", "expectedOutput": "1.00000", "isHidden": true }
        ],
        "xpReward": 150
      },
      {
        "title": "Longest Consecutive Sequence",
        "slug": "longest-consecutive-sequence",
        "difficulty": "medium",
        "category": "hash-table",
        "description": "Return length of longest consecutive elements sequence in unsorted array. O(n) required.",
        "examples": [
          { "input": "nums=[100,4,200,1,3,2]", "output": "4" },
          { "input": "nums=[0,3,7,2,5,8,4,6,0,1]", "output": "9" }
        ],
        "constraints": ["0<=nums.length<=10^5", "-10^9<=nums[i]<=10^9"],
        "hints": [
          "HashSet; only start sequence from numbers with no left neighbor",
          "Extend each sequence; total work O(n)"
        ],
        "tags": ["hash-table", "array", "union-find"],
        "js": "function longestConsecutive(nums) {\n  // your code here\n}",
        "py": "def longest_consecutive(nums):\n    pass",
        "testCases": [
          { "input": "[100,4,200,1,3,2]", "expectedOutput": "4" },
          { "input": "[0,3,7,2,5,8,4,6,0,1]", "expectedOutput": "9" }
        ],
        "xpReward": 90
      },
      {
        "title": "Text Justification",
        "slug": "text-justification",
        "difficulty": "hard",
        "category": "string",
        "description": "Format words into lines of exactly maxWidth. Lines fully justified except last. Extra spaces distributed left to right.",
        "examples": [
          { "input": "words=[This,is,an,example,of,text,justification.],maxWidth=16", "output": "[\"This    is    an\",\"example  of text\",\"justification.  \"]" },
          { "input": "words=[What,must,be,acknowledgment,shall,be],maxWidth=16", "output": "[\"What   must  be\",\"acknowledgment  \",\"shall be        \"]" }
        ],
        "constraints": ["1<=words.length<=300", "1<=maxWidth<=100"],
        "hints": [
          "Greedily pack words per line; calculate spaces",
          "Extra spaces: (total-1) spaces, mod distributed to first slots; last line left-justified"
        ],
        "tags": ["string", "simulation", "greedy"],
        "js": "function fullJustify(words, maxWidth) {\n  // your code here\n}",
        "py": "def full_justify(words, max_width):\n    pass",
        "testCases": [
          { "input": "[\"This\",\"is\",\"an\",\"example\",\"of\",\"text\",\"justification.\"]\n16", "expectedOutput": "[\"This    is    an\",\"example  of text\",\"justification.  \"]" },
          { "input": "[\"What\",\"must\",\"be\",\"acknowledgment\",\"shall\",\"be\"]\n16", "expectedOutput": "[\"What   must  be\",\"acknowledgment  \",\"shall be        \"]" }
        ],
        "xpReward": 130
      },
      {
        "title": "Basic Calculator II",
        "slug": "basic-calculator-ii",
        "difficulty": "medium",
        "category": "stack",
        "description": "Implement a calculator to evaluate string s with +, -, *, / (integer division, truncate toward zero). No parentheses.",
        "examples": [
          { "input": "s=3+2*2", "output": "7" },
          { "input": "s= 3/2 ", "output": "1" },
          { "input": "s= 3+5 / 2 ", "output": "5" }
        ],
        "constraints": ["1<=s.length<=3*10^5"],
        "hints": [
          "Stack; on +/-: push value; on *//: pop and compute, push result",
          "Handle sign and current number carefully; process on next operator"
        ],
        "tags": ["stack", "string", "math"],
        "js": "function calculate(s) {\n  // your code here\n}",
        "py": "def calculate(s):\n    pass",
        "testCases": [
          { "input": "3+2*2", "expectedOutput": "7" },
          { "input": " 3/2 ", "expectedOutput": "1" },
          { "input": " 3+5 / 2 ", "expectedOutput": "5", "isHidden": true }
        ],
        "xpReward": 100
      },
      {
        "title": "First Missing Positive",
        "slug": "first-missing-positive",
        "difficulty": "hard",
        "category": "array",
        "description": "Return the smallest missing positive integer in O(n) time and O(1) space.",
        "examples": [
          { "input": "nums=[1,2,0]", "output": "3" },
          { "input": "nums=[3,4,-1,1]", "output": "2" },
          { "input": "nums=[7,8,9,11,12]", "output": "1" }
        ],
        "constraints": ["1<=nums.length<=10^5"],
        "hints": [
          "Use array as hash map: place nums[i] at index nums[i]-1",
          "Scan for first index i where nums[i] != i+1; answer is i+1"
        ],
        "tags": ["array", "hash-table"],
        "js": "function firstMissingPositive(nums) {\n  // your code here\n}",
        "py": "def first_missing_positive(nums):\n    pass",
        "testCases": [
          { "input": "[1,2,0]", "expectedOutput": "3" },
          { "input": "[3,4,-1,1]", "expectedOutput": "2" },
          { "input": "[7,8,9,11,12]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 130
      }
    ]
  }
];

export async function GET() {
  try {
    let inserted = 0;
    for (const day of DAYS_DATA) {
      await db.delete(codingChallenges).where(eq(codingChallenges.dayNumber, day.dayNumber));
      for (const p of day.problems) {
        await db.insert(codingChallenges).values({
          dayNumber: day.dayNumber, title: p.title, slug: p.slug,
          difficulty: p.difficulty as any, category: p.category,
          description: p.description, examples: p.examples,
          constraints: p.constraints, hints: p.hints, tags: p.tags,
          starterCode: {
            javascript: p.js, typescript: p.js, python: p.py,
            java: "import java.util.*;\n\nclass Solution {\n    public Object solve(Object input) {\n        // implement here\n        return null;\n    }\n}",
            cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // implement here\n    return 0;\n}",
            c: "#include <stdio.h>\nint main() { return 0; }",
          },
          testCases: p.testCases, xpReward: p.xpReward,
          source: "custom", externalUrl: null, cfRating: null,
        }).onConflictDoUpdate({
          target: codingChallenges.slug,
          set: { title: p.title, dayNumber: day.dayNumber, description: p.description,
            examples: p.examples, constraints: p.constraints, hints: p.hints,
            tags: p.tags, testCases: p.testCases, xpReward: p.xpReward },
        });
        inserted++;
      }
    }
    return NextResponse.json({ success: true, message: `Days 51-60 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}