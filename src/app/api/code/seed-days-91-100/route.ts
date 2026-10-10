// src/app/api/code/seed-days-91-100/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 91,
    "topic": "Advanced Recursion: Divide, Conquer & Memoization",
    "lesson": "Deep recursion mastery: memoization converts exponential to polynomial by caching overlapping subproblems. Top-down DP = recursion + memo. Bottom-up DP = iterative table. For divide and conquer: subproblems must be independent (no overlap). Recognize when a recursive solution has repeated calls — that is the memoization signal. Space: memo table size = product of state dimensions.",
    "problems": [
      {
        "title": "Unique Binary Search Trees II",
        "slug": "unique-bst-ii",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Return all structurally unique BSTs with exactly n nodes valued 1 to n.",
        "examples": [
          { "input": "n=3", "output": "[[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]" },
          { "input": "n=1", "output": "[[1]]" }
        ],
        "constraints": ["1<=n<=8"],
        "hints": [
          "For each root i: left subtree from [1..i-1], right subtree from [i+1..n]",
          "Memoize by (start, end) range; combine all left and right tree pairs"
        ],
        "tags": ["dynamic-programming", "tree", "backtracking", "memoization"],
        "js": "function generateTrees(n) {\n  // your code here\n}",
        "py": "def generate_trees(n):\n    pass",
        "testCases": [
          { "input": "3", "expectedOutput": "5" },
          { "input": "1", "expectedOutput": "1" },
          { "input": "4", "expectedOutput": "14", "isHidden": true }
        ],
        "xpReward": 100
      },
      {
        "title": "Strange Printer II",
        "slug": "strange-printer-ii",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Printer prints rectangles of one color at a time (can overwrite). Given target grid, return true if achievable.",
        "examples": [
          { "input": "targetGrid=[[1,1,1,1],[1,2,2,1],[1,2,2,1],[1,1,1,1]]", "output": "true" },
          { "input": "targetGrid=[[1,1,1,1],[1,1,3,3],[1,1,3,4],[2,2,1,4]]", "output": "false" }
        ],
        "constraints": ["1<=m,n<=60", "1<=targetGrid[i][j]<=60"],
        "hints": [
          "For each color find bounding rectangle; color A must be printed before color B if B appears inside A's rect but A doesn't appear inside B's rect",
          "Build dependency graph; topological sort — if cycle return false"
        ],
        "tags": ["dynamic-programming", "graph", "topological-sort", "matrix"],
        "js": "function isPrintable(targetGrid) {\n  // your code here\n}",
        "py": "def is_printable(target_grid):\n    pass",
        "testCases": [
          { "input": "[[1,1,1,1],[1,2,2,1],[1,2,2,1],[1,1,1,1]]", "expectedOutput": "true" },
          { "input": "[[1,1,1,1],[1,1,3,3],[1,1,3,4],[2,2,1,4]]", "expectedOutput": "false" }
        ],
        "xpReward": 150
      },
      {
        "title": "Decode Ways II",
        "slug": "decode-ways-ii",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Like Decode Ways but '*' can be any digit 1-9. Return number of ways mod 10^9+7.",
        "examples": [
          { "input": "s=*", "output": "9" },
          { "input": "s=1*", "output": "18" },
          { "input": "s=2*", "output": "15" }
        ],
        "constraints": ["1<=s.length<=10^5"],
        "hints": [
          "dp[i] = ways to decode s[0..i-1]; handle * by counting valid single and double digit decodings",
          "For two chars: count valid pairs (*, *), (1, *), (2, *), (*, digit), (digit, digit)"
        ],
        "tags": ["dynamic-programming", "string"],
        "js": "function numDecodings(s) {\n  // your code here\n}",
        "py": "def num_decodings(s):\n    pass",
        "testCases": [
          { "input": "*", "expectedOutput": "9" },
          { "input": "1*", "expectedOutput": "18" },
          { "input": "2*", "expectedOutput": "15", "isHidden": true }
        ],
        "xpReward": 140
      },
      {
        "title": "Cherry Pickup",
        "slug": "cherry-pickup",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Collect maximum cherries making one round trip on grid (go top-left to bottom-right then back). Thorns block path.",
        "examples": [
          { "input": "grid=[[0,1,-1],[1,0,-1],[1,1,1]]", "output": "5" },
          { "input": "grid=[[1,1,-1],[1,-1,1],[-1,1,1]]", "output": "0" }
        ],
        "constraints": ["1<=n<=50", "grid[i][j] in {-1,0,1}"],
        "hints": [
          "Simulate two paths going top-left to bottom-right simultaneously",
          "dp[t][r1][r2] = max cherries at step t with person1 at row r1 and person2 at row r2"
        ],
        "tags": ["dynamic-programming", "matrix"],
        "js": "function cherryPickup(grid) {\n  // your code here\n}",
        "py": "def cherry_pickup(grid):\n    pass",
        "testCases": [
          { "input": "[[0,1,-1],[1,0,-1],[1,1,1]]", "expectedOutput": "5" },
          { "input": "[[1,1,-1],[1,-1,1],[-1,1,1]]", "expectedOutput": "0" }
        ],
        "xpReward": 150
      },
      {
        "title": "Cherry Pickup II",
        "slug": "cherry-pickup-ii",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Two robots start at top-left and top-right corners, move down collecting cherries. Maximize total cherries.",
        "examples": [
          { "input": "grid=[[3,1,1],[2,5,1],[1,5,5],[2,1,1]]", "output": "24" },
          { "input": "grid=[[1,0,0,0,0,0,1],[2,0,0,0,0,3,0],[2,0,9,0,0,0,0],[0,3,0,5,4,0,0],[1,0,2,3,0,0,6]]", "output": "28" }
        ],
        "constraints": ["2<=rows<=70", "2<=cols<=70", "0<=grid[i][j]<=100"],
        "hints": [
          "dp[row][col1][col2] = max cherries when robot1 at col1, robot2 at col2 on this row",
          "Both move down simultaneously; 9 combinations of moves each step"
        ],
        "tags": ["dynamic-programming", "matrix"],
        "js": "function cherryPickup(grid) {\n  // your code here\n}",
        "py": "def cherry_pickup(grid):\n    pass",
        "testCases": [
          { "input": "[[3,1,1],[2,5,1],[1,5,5],[2,1,1]]", "expectedOutput": "24" },
          { "input": "[[1,0,0,0,0,0,1],[2,0,0,0,0,3,0],[2,0,9,0,0,0,0],[0,3,0,5,4,0,0],[1,0,2,3,0,0,6]]", "expectedOutput": "28" }
        ],
        "xpReward": 150
      }
    ]
  },
  {
    "dayNumber": 92,
    "topic": "Number Theory & Advanced Math",
    "lesson": "Key number theory: Euler's totient φ(n) = count of integers 1..n coprime to n. Modular inverse: a^(p-2) mod p (Fermat's little theorem, p prime). Chinese Remainder Theorem: system of congruences. Miller-Rabin primality test: O(k log^2 n). Catalan numbers: C(n) = C(2n,n)/(n+1) — counts BSTs, valid parentheses, polygon triangulations. Lucas' theorem for binomial coefficients mod prime.",
    "problems": [
      {
        "title": "Super Pow",
        "slug": "super-pow",
        "difficulty": "medium",
        "category": "math",
        "description": "Compute a^b mod 1337 where b is given as an array of digits.",
        "examples": [
          { "input": "a=2,b=[3]", "output": "8" },
          { "input": "a=2,b=[1,0]", "output": "1024" },
          { "input": "a=1,b=[4,3,3,8,5,2]", "output": "1" }
        ],
        "constraints": ["1<=a<=2^31-1", "1<=b.length<=2000"],
        "hints": [
          "a^[d1,d2,d3] = (a^[d1,d2])^10 * a^d3",
          "Use fast exponentiation with mod at each step"
        ],
        "tags": ["math", "modular-arithmetic"],
        "js": "function superPow(a, b) {\n  // your code here\n}",
        "py": "def super_pow(a, b):\n    pass",
        "testCases": [
          { "input": "2\n[3]", "expectedOutput": "8" },
          { "input": "2\n[1,0]", "expectedOutput": "1024" },
          { "input": "1\n[4,3,3,8,5,2]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Nth Digit",
        "slug": "nth-digit",
        "difficulty": "medium",
        "category": "math",
        "description": "Find the nth digit in the infinite integer sequence 1 2 3 4 5 6 7 8 9 10 11 ...",
        "examples": [
          { "input": "n=3", "output": "3" },
          { "input": "n=11", "output": "0" },
          { "input": "n=15", "output": "2" }
        ],
        "constraints": ["1<=n<=2^31-1"],
        "hints": [
          "1-digit: 9 numbers * 1 digit = 9. 2-digit: 90 * 2 = 180. Find which range n falls in",
          "Find exact number and digit position within it"
        ],
        "tags": ["math"],
        "js": "function findNthDigit(n) {\n  // your code here\n}",
        "py": "def find_nth_digit(n):\n    pass",
        "testCases": [
          { "input": "3", "expectedOutput": "3" },
          { "input": "11", "expectedOutput": "0" },
          { "input": "15", "expectedOutput": "2", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Largest Divisible Subset",
        "slug": "largest-divisible-subset",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Find largest subset where for every pair (a,b) either a%b==0 or b%a==0.",
        "examples": [
          { "input": "nums=[1,2,3]", "output": "[1,2]" },
          { "input": "nums=[1,2,4,8]", "output": "[1,2,4,8]" }
        ],
        "constraints": ["1<=nums.length<=1000", "1<=nums[i]<=2*10^9"],
        "hints": [
          "Sort; dp[i] = length of largest subset ending at nums[i]",
          "If nums[i] % nums[j] == 0 and dp[j]+1 > dp[i]: extend; track parent for reconstruction"
        ],
        "tags": ["dynamic-programming", "math", "sorting"],
        "js": "function largestDivisibleSubset(nums) {\n  // your code here\n}",
        "py": "def largest_divisible_subset(nums):\n    pass",
        "testCases": [
          { "input": "[1,2,3]", "expectedOutput": "[1,2]" },
          { "input": "[1,2,4,8]", "expectedOutput": "[1,2,4,8]" },
          { "input": "[3,4,16,8]", "expectedOutput": "[4,8,16]", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Valid Square",
        "slug": "valid-square",
        "difficulty": "medium",
        "category": "math",
        "description": "Given four points, return true if they form a valid square (all sides equal, all angles 90 degrees).",
        "examples": [
          { "input": "p1=[0,0],p2=[1,1],p3=[1,0],p4=[0,1]", "output": "true" },
          { "input": "p1=[0,0],p2=[1,1],p3=[1,0],p4=[0,12]", "output": "false" },
          { "input": "p1=[1,0],p2=[-1,0],p3=[0,1],p4=[0,-1]", "output": "true" }
        ],
        "constraints": ["-10^4<=coordinates<=10^4"],
        "hints": [
          "Compute all 6 pairwise distances; exactly 2 distinct values (4 sides + 2 diagonals)",
          "Non-zero distances, 4 equal sides, 2 equal longer diagonals"
        ],
        "tags": ["math", "geometry"],
        "js": "function validSquare(p1, p2, p3, p4) {\n  // your code here\n}",
        "py": "def valid_square(p1, p2, p3, p4):\n    pass",
        "testCases": [
          { "input": "[0,0]\n[1,1]\n[1,0]\n[0,1]", "expectedOutput": "true" },
          { "input": "[0,0]\n[1,1]\n[1,0]\n[0,12]", "expectedOutput": "false" },
          { "input": "[1,0]\n[-1,0]\n[0,1]\n[0,-1]", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Self Dividing Numbers",
        "slug": "self-dividing-numbers",
        "difficulty": "easy",
        "category": "math",
        "description": "A self-dividing number is divisible by every digit it contains (no zeros). Return all in [left, right].",
        "examples": [
          { "input": "left=1,right=22", "output": "[1,2,3,4,5,6,7,8,9,11,12,15,22]" },
          { "input": "left=47,right=85", "output": "[48,55,66,77]" }
        ],
        "constraints": ["1<=left<=right<=10^4"],
        "hints": [
          "For each number extract digits; check none is 0 and number divisible by each digit",
          "Simple digit extraction with mod and division"
        ],
        "tags": ["math"],
        "js": "function selfDividingNumbers(left, right) {\n  // your code here\n}",
        "py": "def self_dividing_numbers(left, right):\n    pass",
        "testCases": [
          { "input": "1\n22", "expectedOutput": "[1,2,3,4,5,6,7,8,9,11,12,15,22]" },
          { "input": "47\n85", "expectedOutput": "[48,55,66,77]" }
        ],
        "xpReward": 40
      }
    ]
  },
  {
    "dayNumber": 93,
    "topic": "Hard Graph: Advanced Traversal",
    "lesson": "Advanced graph traversal: Euler path exists iff 0 or 2 vertices have odd degree (undirected). Hierholzer's algorithm for Euler circuit: O(E). Hamiltonian path (NP-hard): backtracking with pruning. Bidirectional BFS cuts search space from b^d to 2*b^(d/2). Meet-in-the-middle: split state space. For word problems: model words as nodes, transitions as edges.",
    "problems": [
      {
        "title": "Couples Holding Hands",
        "slug": "couples-holding-hands",
        "difficulty": "hard",
        "category": "graph",
        "description": "n couples sit in a row. Return minimum swaps to make every couple sit side by side.",
        "examples": [
          { "input": "row=[0,2,1,3]", "output": "1" },
          { "input": "row=[3,2,0,1]", "output": "0" }
        ],
        "constraints": ["2<=n<=30", "row is a permutation of 0..2n-1"],
        "hints": [
          "DSU or graph cycle approach: each seat pair is a node; swap = merging two components",
          "Greedy: for each seat pair fix it by finding the partner and swapping"
        ],
        "tags": ["graph", "union-find", "greedy"],
        "js": "function minSwapsCouples(row) {\n  // your code here\n}",
        "py": "def min_swaps_couples(row):\n    pass",
        "testCases": [
          { "input": "[0,2,1,3]", "expectedOutput": "1" },
          { "input": "[3,2,0,1]", "expectedOutput": "0" },
          { "input": "[5,4,2,6,3,1,0,7]", "expectedOutput": "2", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Bus Routes",
        "slug": "bus-routes",
        "difficulty": "hard",
        "category": "graph",
        "description": "Given bus routes (each route is a list of stops), return minimum buses to take from source to target, or -1.",
        "examples": [
          { "input": "routes=[[1,2,7],[3,6,7]],source=1,target=6", "output": "2" },
          { "input": "routes=[[7,12],[4,5,15],[6],[15,19],[9,12,13]],source=15,target=12", "output": "-1" }
        ],
        "constraints": ["1<=routes.length<=500", "1<=routes[i].length<=10^5"],
        "hints": [
          "BFS on routes (not stops): board a route to reach all its stops",
          "Map stop -> list of routes; visited set for both stops and routes"
        ],
        "tags": ["graph", "bfs", "hash-table"],
        "js": "function numBusesToDestination(routes, source, target) {\n  // your code here\n}",
        "py": "def num_buses_to_destination(routes, source, target):\n    pass",
        "testCases": [
          { "input": "[[1,2,7],[3,6,7]]\n1\n6", "expectedOutput": "2" },
          { "input": "[[7,12],[4,5,15],[6],[15,19],[9,12,13]]\n15\n12", "expectedOutput": "-1" }
        ],
        "xpReward": 130
      },
      {
        "title": "Shortest Path in a Grid with Obstacles Elimination",
        "slug": "shortest-path-grid-obstacles",
        "difficulty": "hard",
        "category": "graph",
        "description": "Return shortest path from top-left to bottom-right in grid with 0s (empty) and 1s (obstacles). Can eliminate at most k obstacles.",
        "examples": [
          { "input": "grid=[[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]],k=1", "output": "6" },
          { "input": "grid=[[0,1,1],[1,1,1],[1,0,0]],k=1", "output": "-1" }
        ],
        "constraints": ["1<=m,n<=40", "0<=k<=m*n"],
        "hints": [
          "BFS with state (row, col, remaining_k)",
          "Visit state only if k_remaining is better than previously seen for same cell"
        ],
        "tags": ["graph", "bfs", "matrix"],
        "js": "function shortestPath(grid, k) {\n  // your code here\n}",
        "py": "def shortest_path(grid, k):\n    pass",
        "testCases": [
          { "input": "[[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]]\n1", "expectedOutput": "6" },
          { "input": "[[0,1,1],[1,1,1],[1,0,0]]\n1", "expectedOutput": "-1" }
        ],
        "xpReward": 130
      },
      {
        "title": "Jump Game IV",
        "slug": "jump-game-iv",
        "difficulty": "hard",
        "category": "graph",
        "description": "From index i you can jump to i-1, i+1, or any j where arr[j]==arr[i]. Return minimum jumps to reach last index.",
        "examples": [
          { "input": "arr=[100,-23,-23,404,100,23,23,23,3,404]", "output": "3" },
          { "input": "arr=[7]", "output": "0" },
          { "input": "arr=[7,6,9,6,9,6,9,7]", "output": "1" }
        ],
        "constraints": ["1<=arr.length<=5*10^4", "-10^8<=arr[i]<=10^8"],
        "hints": [
          "BFS with graph: group equal values; from each node explore neighbors + all same-value nodes",
          "Clear group after visiting to avoid revisiting O(n^2)"
        ],
        "tags": ["graph", "bfs", "hash-table"],
        "js": "function minJumps(arr) {\n  // your code here\n}",
        "py": "def min_jumps(arr):\n    pass",
        "testCases": [
          { "input": "[100,-23,-23,404,100,23,23,23,3,404]", "expectedOutput": "3" },
          { "input": "[7]", "expectedOutput": "0" },
          { "input": "[7,6,9,6,9,6,9,7]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Minimum Score of a Path Between Two Cities",
        "slug": "minimum-score-path-two-cities",
        "difficulty": "medium",
        "category": "graph",
        "description": "Return minimum score (minimum edge weight) of any path from node 1 to node n. Path can revisit nodes/edges.",
        "examples": [
          { "input": "n=4,roads=[[1,2,9],[2,3,6],[2,4,5],[1,4,7]]", "output": "5" },
          { "input": "n=4,roads=[[1,2,2],[1,3,4],[3,4,7]]", "output": "2" }
        ],
        "constraints": ["2<=n<=10^5", "1<=roads.length<=10^5"],
        "hints": [
          "Find connected component containing node 1; minimum edge in that component is the answer",
          "Since path can revisit: any edge in reachable component is accessible"
        ],
        "tags": ["graph", "bfs", "dfs", "union-find"],
        "js": "function minScore(n, roads) {\n  // your code here\n}",
        "py": "def min_score(n, roads):\n    pass",
        "testCases": [
          { "input": "4\n[[1,2,9],[2,3,6],[2,4,5],[1,4,7]]", "expectedOutput": "5" },
          { "input": "4\n[[1,2,2],[1,3,4],[3,4,7]]", "expectedOutput": "2" }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 94,
    "topic": "Advanced String Processing",
    "lesson": "Advanced string: suffix automaton recognizes all substrings in O(n) space. Lyndon factorization: Duval's algorithm O(n). String hashing: polynomial rolling hash with multiple bases/mods reduces collision probability. For palindrome queries: Eertree (palindromic tree) stores all distinct palindromic substrings. For large alphabets, use HashMap instead of array in trie nodes.",
    "problems": [
      {
        "title": "Longest Happy String",
        "slug": "longest-happy-string",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Given counts a, b, c of letters, return longest string with no three consecutive same letters using at most the given counts.",
        "examples": [
          { "input": "a=1,b=1,c=7", "output": "ccaccbcc" },
          { "input": "a=7,b=1,c=0", "output": "aabaa" }
        ],
        "constraints": ["0<=a,b,c<=100"],
        "hints": [
          "Greedy: always pick the most frequent letter (that won't cause triple)",
          "Max-heap of (count, char); if top same as last two picks, use second"
        ],
        "tags": ["greedy", "heap", "string"],
        "js": "function longestDiverseString(a, b, c) {\n  // your code here\n}",
        "py": "def longest_diverse_string(a, b, c):\n    pass",
        "testCases": [
          { "input": "1\n1\n7", "expectedOutput": "ccaccbcc" },
          { "input": "7\n1\n0", "expectedOutput": "aabaa" },
          { "input": "0\n8\n11", "expectedOutput": "ccbccbccbccbccbc", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Count Different Palindromic Subsequences",
        "slug": "count-different-palindromic-subsequences",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Return the number of distinct palindromic subsequences of s. Return mod 10^9+7.",
        "examples": [
          { "input": "s=bccb", "output": "6" },
          { "input": "s=abcdabcdabcdabcdabcdabcdabcdabcddcbadcbadcbadcbadcbadcbadcbadcba", "output": "104860361" }
        ],
        "constraints": ["1<=s.length<=1000", "s contains only a,b,c,d"],
        "hints": [
          "dp[i][j] = distinct palindromic subsequences in s[i..j]",
          "For each char c with leftmost l and rightmost r in [i,j]: dp[i][j] += dp[l+1][r-1] + 2 (or +1 if l==r, +1 if l>r)"
        ],
        "tags": ["dynamic-programming", "string"],
        "js": "function countPalindromicSubsequences(s) {\n  // your code here\n}",
        "py": "def count_palindromic_subsequences(s):\n    pass",
        "testCases": [
          { "input": "bccb", "expectedOutput": "6" },
          { "input": "abcdabcdabcdabcdabcdabcdabcdabcddcbadcbadcbadcbadcbadcbadcbadcba", "expectedOutput": "104860361" }
        ],
        "xpReward": 150
      },
      {
        "title": "Minimum Window Substring with At Most K Replacements",
        "slug": "longest-substring-at-most-k-replacements",
        "difficulty": "medium",
        "category": "sliding-window",
        "description": "Return length of longest substring with at most k character replacements such that all characters are the same.",
        "examples": [
          { "input": "s=ABAB,k=2", "output": "4" },
          { "input": "s=AABABBA,k=1", "output": "4" }
        ],
        "constraints": ["1<=s.length<=10^5", "0<=k<=s.length"],
        "hints": [
          "Sliding window: window valid if (window_size - max_freq) <= k",
          "Track max frequency in current window; shrink when invalid"
        ],
        "tags": ["sliding-window", "string", "hash-table"],
        "js": "function characterReplacement(s, k) {\n  // your code here\n}",
        "py": "def character_replacement(s, k):\n    pass",
        "testCases": [
          { "input": "ABAB\n2", "expectedOutput": "4" },
          { "input": "AABABBA\n1", "expectedOutput": "4" },
          { "input": "AAAA\n0", "expectedOutput": "4", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Remove Duplicate Letters",
        "slug": "remove-duplicate-letters",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Remove duplicate letters so result has unique chars and is the lexicographically smallest subsequence.",
        "examples": [
          { "input": "s=bcabc", "output": "abc" },
          { "input": "s=cbacdcbc", "output": "acdb" }
        ],
        "constraints": ["1<=s.length<=10^4"],
        "hints": [
          "Monotonic stack: pop larger chars if they appear later",
          "Only pop if char count[top] > 0 (still available); never pop if in_stack already"
        ],
        "tags": ["greedy", "stack", "string"],
        "js": "function removeDuplicateLetters(s) {\n  // your code here\n}",
        "py": "def remove_duplicate_letters(s):\n    pass",
        "testCases": [
          { "input": "bcabc", "expectedOutput": "abc" },
          { "input": "cbacdcbc", "expectedOutput": "acdb" }
        ],
        "xpReward": 90
      },
      {
        "title": "Stamping the Sequence",
        "slug": "stamping-the-sequence",
        "difficulty": "hard",
        "category": "greedy",
        "description": "Stamp a pattern onto a target string (each stamp operation overwrites a window). Return sequence of positions used (reverse order), or empty if impossible.",
        "examples": [
          { "input": "stamp=abc,target=ababc", "output": "[0,2]" },
          { "input": "stamp=abca,target=aabcaca", "output": "[3,0,1]" }
        ],
        "constraints": ["1<=stamp.length<=target.length<=1000"],
        "hints": [
          "Work backwards: find window where stamp matches target (ignoring already-stamped ?s)",
          "Replace matched chars with '?'; repeat until all '?'"
        ],
        "tags": ["greedy", "string", "simulation"],
        "js": "function movesToStamp(stamp, target) {\n  // your code here\n}",
        "py": "def moves_to_stamp(stamp, target):\n    pass",
        "testCases": [
          { "input": "abc\nababc", "expectedOutput": "[0,2]" },
          { "input": "abca\naabcaca", "expectedOutput": "[3,0,1]" }
        ],
        "xpReward": 150
      }
    ]
  },
  {
    "dayNumber": 95,
    "topic": "Advanced Design: Concurrent & Distributed",
    "lesson": "Concurrent data structures: thread-safe with locks or lock-free with CAS (compare-and-swap). Skip list: probabilistic O(log n) with concurrent support. Consistent hashing: distribute keys across nodes, minimal rehashing on add/remove. Bloom filter: space-efficient probabilistic set membership. Time-based key-value: version each write with timestamp, binary search for reads.",
    "problems": [
      {
        "title": "Time Based Key-Value Store",
        "slug": "time-based-key-value-store",
        "difficulty": "medium",
        "category": "design",
        "description": "Design a time-based key-value store with set(key, value, timestamp) and get(key, timestamp) returning most recent value at or before timestamp.",
        "examples": [
          { "input": "set(foo,bar,1),get(foo,1)->bar,get(foo,3)->bar,set(foo,bar2,4),get(foo,4)->bar2,get(foo,5)->bar2", "output": "see description" }
        ],
        "constraints": ["1<=key.length<=100", "1<=timestamp<=10^7", "At most 2*10^5 operations"],
        "hints": [
          "HashMap of key -> sorted list of (timestamp, value)",
          "get: binary search for largest timestamp <= query timestamp"
        ],
        "tags": ["design", "hash-table", "binary-search", "string"],
        "js": "class TimeMap {\n  constructor() {}\n  set(key, value, timestamp) {}\n  get(key, timestamp) {}\n}",
        "py": "class TimeMap:\n    def __init__(self):\n        pass\n    def set(self, key, value, timestamp):\n        pass\n    def get(self, key, timestamp):\n        pass",
        "testCases": [
          { "input": "set\nfoo\nbar\n1\nget\nfoo\n1\nget\nfoo\n3\nset\nfoo\nbar2\n4\nget\nfoo\n4\nget\nfoo\n5", "expectedOutput": "null\nbar\nbar\nnull\nbar2\nbar2" }
        ],
        "xpReward": 90
      },
      {
        "title": "Design Underground System",
        "slug": "design-underground-system",
        "difficulty": "medium",
        "category": "design",
        "description": "Track passenger check-ins/outs. getAverageTime(startStation, endStation) returns average travel time between stations.",
        "examples": [
          { "input": "checkIn(45,Leyton,3),checkIn(32,Paradise,8),checkIn(27,Leyton,10),checkOut(45,Waterloo,15),checkOut(27,Waterloo,20),checkOut(32,Cambridge,22),getAverageTime(Paradise,Cambridge)->14.0,getAverageTime(Leyton,Waterloo)->11.0", "output": "see description" }
        ],
        "constraints": ["1<=id<=10^5", "timestamps in order", "At most 2*10^4 operations"],
        "hints": [
          "HashMap id->(startStation,startTime) for active passengers",
          "HashMap (start,end)->(totalTime,count) for completed trips"
        ],
        "tags": ["design", "hash-table", "string"],
        "js": "class UndergroundSystem {\n  constructor() {}\n  checkIn(id, stationName, t) {}\n  checkOut(id, stationName, t) {}\n  getAverageTime(startStation, endStation) {}\n}",
        "py": "class UndergroundSystem:\n    def __init__(self):\n        pass\n    def check_in(self, id, station_name, t):\n        pass\n    def check_out(self, id, station_name, t):\n        pass\n    def get_average_time(self, start_station, end_station):\n        pass",
        "testCases": [
          { "input": "checkIn\n45\nLeyton\n3\ncheckIn\n32\nParadise\n8\ncheckIn\n27\nLeyton\n10\ncheckOut\n45\nWaterloo\n15\ncheckOut\n27\nWaterloo\n20\ncheckOut\n32\nCambridge\n22\ngetAverageTime\nParadise\nCambridge\ngetAverageTime\nLeyton\nWaterloo", "expectedOutput": "null\nnull\nnull\nnull\nnull\nnull\n14.00000\n11.00000" }
        ],
        "xpReward": 90
      },
      {
        "title": "Design File System",
        "slug": "design-file-system",
        "difficulty": "medium",
        "category": "design",
        "description": "Implement a file system with createPath(path, value) and get(path). Return false if parent doesn't exist or path exists.",
        "examples": [
          { "input": "createPath(/leet,1)->true,createPath(/leet/code,2)->true,get(/leet)->1,get(/leet/code)->2", "output": "see description" }
        ],
        "constraints": ["2<=path.length<=100", "1<=value<=10^9", "At most 10^4 operations"],
        "hints": [
          "Trie where each node stores value and children map",
          "createPath: traverse to parent, check parent exists, create new child"
        ],
        "tags": ["design", "trie", "hash-table", "string"],
        "js": "class FileSystem {\n  constructor() {}\n  createPath(path, value) {}\n  get(path) {}\n}",
        "py": "class FileSystem:\n    def __init__(self):\n        pass\n    def create_path(self, path, value):\n        pass\n    def get(self, path):\n        pass",
        "testCases": [
          { "input": "createPath\n/leet\n1\ncreatePath\n/leet/code\n2\nget\n/leet\nget\n/leet/code", "expectedOutput": "true\ntrue\n1\n2" }
        ],
        "xpReward": 80
      },
      {
        "title": "Snapshot Array",
        "slug": "snapshot-array",
        "difficulty": "medium",
        "category": "design",
        "description": "Implement SnapshotArray with set(index, val), snap() returning snap_id, and get(index, snap_id).",
        "examples": [
          { "input": "SnapshotArray(3),set(0,5),snap()->0,set(0,6),get(0,0)->5", "output": "see description" }
        ],
        "constraints": ["1<=length<=5*10^4", "At most 5*10^4 operations"],
        "hints": [
          "Each index stores sorted list of (snap_id, value)",
          "get: binary search for largest snap_id <= query snap_id"
        ],
        "tags": ["design", "binary-search", "array"],
        "js": "class SnapshotArray {\n  constructor(length) {}\n  set(index, val) {}\n  snap() {}\n  get(index, snap_id) {}\n}",
        "py": "class SnapshotArray:\n    def __init__(self, length):\n        pass\n    def set(self, index, val):\n        pass\n    def snap(self):\n        pass\n    def get(self, index, snap_id):\n        pass",
        "testCases": [
          { "input": "SnapshotArray\n3\nset\n0\n5\nsnap\nset\n0\n6\nget\n0\n0", "expectedOutput": "null\nnull\n0\nnull\n5" }
        ],
        "xpReward": 90
      },
      {
        "title": "Design Skiplist",
        "slug": "design-skiplist",
        "difficulty": "hard",
        "category": "design",
        "description": "Implement a Skiplist with add(num), erase(num), and search(num) all in O(log n) average. Allow duplicates.",
        "examples": [
          { "input": "add(1),add(2),add(3),search(0)->false,add(4),search(1)->true,erase(1),erase(1)->false,search(1)->false", "output": "see description" }
        ],
        "constraints": ["0<=num<=2*10^4", "At most 5*10^4 calls"],
        "hints": [
          "Probabilistic multi-level linked list; each node promoted to next level with prob 0.5",
          "Search: start from top level, go right if next<=target else go down"
        ],
        "tags": ["design", "linked-list", "randomized"],
        "js": "class Skiplist {\n  constructor() {}\n  search(target) {}\n  add(num) {}\n  erase(num) {}\n}",
        "py": "class Skiplist:\n    def __init__(self):\n        pass\n    def search(self, target):\n        pass\n    def add(self, num):\n        pass\n    def erase(self, num):\n        pass",
        "testCases": [
          { "input": "add\n1\nadd\n2\nadd\n3\nsearch\n0\nadd\n4\nsearch\n1\nerase\n1\nerase\n1\nsearch\n1", "expectedOutput": "null\nnull\nnull\nfalse\nnull\ntrue\ntrue\nfalse\nfalse" }
        ],
        "xpReward": 150
      }
    ]
  },
  {
    "dayNumber": 96,
    "topic": "Competitive Programming Patterns",
    "lesson": "Competitive programming tricks: (1) Coordinate compression for large value ranges. (2) Offline queries: sort queries then process in optimal order. (3) Small-to-large merging: O(n log n) for tree merging. (4) Mo's algorithm: offline range queries in O((n+q)*sqrt(n)). (5) Persistent data structures: version history. (6) Sqrt decomposition: block-based O(sqrt(n)) per query.",
    "problems": [
      {
        "title": "Range Sum Query - Immutable (1D)",
        "slug": "range-sum-query-immutable",
        "difficulty": "easy",
        "category": "prefix-sum",
        "description": "Implement NumArray with sumRange(left, right) in O(1) after O(n) preprocessing.",
        "examples": [
          { "input": "NumArray([-2,0,3,-5,2,-1]),sumRange(0,2)->1,sumRange(2,5)->-1,sumRange(0,5)->-3", "output": "see description" }
        ],
        "constraints": ["1<=nums.length<=10^4", "At most 10^4 calls"],
        "hints": [
          "Prefix sum: pre[i] = sum of nums[0..i-1]",
          "sumRange(l,r) = pre[r+1] - pre[l]"
        ],
        "tags": ["prefix-sum", "design", "array"],
        "js": "class NumArray {\n  constructor(nums) {}\n  sumRange(left, right) {}\n}",
        "py": "class NumArray:\n    def __init__(self, nums):\n        pass\n    def sum_range(self, left, right):\n        pass",
        "testCases": [
          { "input": "NumArray\n[-2,0,3,-5,2,-1]\nsumRange\n0\n2\nsumRange\n2\n5\nsumRange\n0\n5", "expectedOutput": "null\n1\n-1\n-3" }
        ],
        "xpReward": 40
      },
      {
        "title": "Contains Duplicate III",
        "slug": "contains-duplicate-iii",
        "difficulty": "hard",
        "category": "sliding-window",
        "description": "Return true if there exist indices i,j in array where |i-j|<=indexDiff and |nums[i]-nums[j]|<=valueDiff.",
        "examples": [
          { "input": "nums=[1,2,3,1],indexDiff=3,valueDiff=0", "output": "true" },
          { "input": "nums=[1,5,9,1,5,9],indexDiff=2,valueDiff=3", "output": "false" }
        ],
        "constraints": ["2<=nums.length<=2*10^5", "0<=indexDiff<=nums.length", "0<=valueDiff<=10^9"],
        "hints": [
          "Bucket sort with bucket size valueDiff+1; sliding window of size indexDiff",
          "Each bucket holds at most one element; check same bucket and adjacent buckets"
        ],
        "tags": ["sliding-window", "bucket-sort", "sorting"],
        "js": "function containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff) {\n  // your code here\n}",
        "py": "def contains_nearby_almost_duplicate(nums, index_diff, value_diff):\n    pass",
        "testCases": [
          { "input": "[1,2,3,1]\n3\n0", "expectedOutput": "true" },
          { "input": "[1,5,9,1,5,9]\n2\n3", "expectedOutput": "false" },
          { "input": "[1,2]\n0\n1", "expectedOutput": "false", "isHidden": true }
        ],
        "xpReward": 110
      },
      {
        "title": "The Skyline Problem",
        "slug": "the-skyline-problem",
        "difficulty": "hard",
        "category": "heap",
        "description": "Given buildings as [left, right, height], return the skyline as list of [x, height] key points.",
        "examples": [
          { "input": "buildings=[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]", "output": "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]" },
          { "input": "buildings=[[0,2,3],[2,5,3]]", "output": "[[0,3],[5,0]]" }
        ],
        "constraints": ["1<=buildings.length<=10^4"],
        "hints": [
          "Convert to events: (x, -h) for start, (x, h) for end; sort events",
          "Max-heap of active heights; key point when max height changes"
        ],
        "tags": ["heap", "sweep-line", "sorting", "divide-and-conquer"],
        "js": "function getSkyline(buildings) {\n  // your code here\n}",
        "py": "def get_skyline(buildings):\n    pass",
        "testCases": [
          { "input": "[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]", "expectedOutput": "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]" },
          { "input": "[[0,2,3],[2,5,3]]", "expectedOutput": "[[0,3],[5,0]]" }
        ],
        "xpReward": 150
      },
      {
        "title": "Count of Smaller Numbers After Self (BIT)",
        "slug": "count-smaller-bit",
        "difficulty": "hard",
        "category": "segment-tree",
        "description": "For each element return count of smaller elements to its right. Solve using Binary Indexed Tree.",
        "examples": [
          { "input": "nums=[5,2,6,1]", "output": "[2,1,1,0]" },
          { "input": "nums=[-1,-1]", "output": "[0,0]" }
        ],
        "constraints": ["1<=nums.length<=10^5", "-10^4<=nums[i]<=10^4"],
        "hints": [
          "Process right to left; coordinate compress; BIT for prefix sum queries",
          "query(rank-1) gives count of smaller already inserted"
        ],
        "tags": ["segment-tree", "binary-indexed-tree", "merge-sort"],
        "js": "function countSmaller(nums) {\n  // your code here\n}",
        "py": "def count_smaller(nums):\n    pass",
        "testCases": [
          { "input": "[5,2,6,1]", "expectedOutput": "[2,1,1,0]" },
          { "input": "[-1,-1]", "expectedOutput": "[0,0]" },
          { "input": "[2,0,1]", "expectedOutput": "[2,0,0]", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Number of Subarrays with Bounded Maximum",
        "slug": "subarrays-bounded-maximum",
        "difficulty": "medium",
        "category": "array",
        "description": "Return number of subarrays where maximum element is in [left, right].",
        "examples": [
          { "input": "nums=[2,1,4,3],left=2,right=3", "output": "3" },
          { "input": "nums=[2,9,2,5,6],left=2,right=8", "output": "7" }
        ],
        "constraints": ["1<=nums.length<=2*10^4", "0<=nums[i]<=10^9", "0<=left<=right<=10^9"],
        "hints": [
          "count(right) - count(left-1) where count(k) = subarrays with max <= k",
          "Sliding window: reset on nums[i]>k, extend otherwise"
        ],
        "tags": ["array", "two-pointers"],
        "js": "function numSubarrayBoundedMax(nums, left, right) {\n  // your code here\n}",
        "py": "def num_subarray_bounded_max(nums, left, right):\n    pass",
        "testCases": [
          { "input": "[2,1,4,3]\n2\n3", "expectedOutput": "3" },
          { "input": "[2,9,2,5,6]\n2\n8", "expectedOutput": "7" }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 97,
    "topic": "System Design Coding: Scalable Data Structures",
    "lesson": "Production-grade data structures: (1) Consistent hashing with virtual nodes for load balancing. (2) LRU + LFU hybrid. (3) Bloom filter for existence checks. (4) Count-Min Sketch for frequency estimation in streams. (5) Trie with persistence for version history. (6) Segment tree with lazy propagation for range updates. Choose based on read/write ratio and memory constraints.",
    "problems": [
      {
        "title": "Design In-Memory File System",
        "slug": "design-in-memory-file-system",
        "difficulty": "hard",
        "category": "design",
        "description": "Implement ls, mkdir, addContentToFile, and readContentFromFile for an in-memory file system.",
        "examples": [
          { "input": "ls(/)->[], mkdir(/a/b/c), addContentToFile(/a/b/c/d,hello), ls(/)->['a'], readContentFromFile(/a/b/c/d)->hello", "output": "see description" }
        ],
        "constraints": ["1<=path.length<=100", "At most 300 function calls"],
        "hints": [
          "Trie node: children map (dirs), content string (file), isFile flag",
          "ls: if file return [name]; if dir return sorted children names"
        ],
        "tags": ["design", "trie", "hash-table", "string"],
        "js": "class FileSystem {\n  constructor() {}\n  ls(path) {}\n  mkdir(path) {}\n  addContentToFile(filePath, content) {}\n  readContentFromFile(filePath) {}\n}",
        "py": "class FileSystem:\n    def __init__(self):\n        pass\n    def ls(self, path):\n        pass\n    def mkdir(self, path):\n        pass\n    def add_content_to_file(self, file_path, content):\n        pass\n    def read_content_from_file(self, file_path):\n        pass",
        "testCases": [
          { "input": "ls\n/\nmkdir\n/a/b/c\naddContentToFile\n/a/b/c/d\nhello\nls\n/\nreadContentFromFile\n/a/b/c/d", "expectedOutput": "[]\nnull\nnull\n[\"a\"]\nhello" }
        ],
        "xpReward": 140
      },
      {
        "title": "Design Twitter (Extended)",
        "slug": "design-twitter-extended",
        "difficulty": "hard",
        "category": "design",
        "description": "Extend Twitter design: postTweet, getNewsFeed, follow, unfollow. getNewsFeed returns 10 most recent tweets from user and followees. Add getTimeline(userId) returning only user's own tweets.",
        "examples": [
          { "input": "postTweet(1,5),postTweet(1,3),getTimeline(1)->[3,5],follow(1,2),postTweet(2,6),getNewsFeed(1)->[6,3,5]", "output": "see description" }
        ],
        "constraints": ["1<=userId,tweetId<=500", "At most 3*10^4 calls"],
        "hints": [
          "Per-user tweet list with global timestamp; heap-merge for news feed",
          "Timeline: just the user's own list sorted by time"
        ],
        "tags": ["design", "hash-table", "heap", "linked-list"],
        "js": "class Twitter {\n  constructor() {}\n  postTweet(userId, tweetId) {}\n  getNewsFeed(userId) {}\n  follow(followerId, followeeId) {}\n  unfollow(followerId, followeeId) {}\n  getTimeline(userId) {}\n}",
        "py": "class Twitter:\n    def __init__(self):\n        pass\n    def post_tweet(self, user_id, tweet_id):\n        pass\n    def get_news_feed(self, user_id):\n        pass\n    def follow(self, follower_id, followee_id):\n        pass\n    def unfollow(self, follower_id, followee_id):\n        pass\n    def get_timeline(self, user_id):\n        pass",
        "testCases": [
          { "input": "postTweet\n1\n5\npostTweet\n1\n3\ngetTimeline\n1\nfollow\n1\n2\npostTweet\n2\n6\ngetNewsFeed\n1", "expectedOutput": "null\nnull\n[3,5]\nnull\nnull\n[6,3,5]" }
        ],
        "xpReward": 130
      },
      {
        "title": "Moving Average from Data Stream",
        "slug": "moving-average-data-stream",
        "difficulty": "easy",
        "category": "design",
        "description": "Implement MovingAverage with next(val) returning moving average of last size values.",
        "examples": [
          { "input": "MovingAverage(3),next(1)->1.0,next(10)->5.5,next(3)->4.67,next(5)->6.0", "output": "see description" }
        ],
        "constraints": ["1<=size<=1000", "At most 10^4 calls"],
        "hints": [
          "Circular buffer of size k; maintain running sum",
          "On add: subtract oldest, add newest, divide by min(count,size)"
        ],
        "tags": ["design", "queue", "array"],
        "js": "class MovingAverage {\n  constructor(size) {}\n  next(val) {}\n}",
        "py": "class MovingAverage:\n    def __init__(self, size):\n        pass\n    def next(self, val):\n        pass",
        "testCases": [
          { "input": "MovingAverage\n3\nnext\n1\nnext\n10\nnext\n3\nnext\n5", "expectedOutput": "null\n1.00000\n5.50000\n4.66667\n6.00000" }
        ],
        "xpReward": 50
      },
      {
        "title": "Design Bounded Blocking Queue",
        "slug": "design-bounded-blocking-queue",
        "difficulty": "medium",
        "category": "design",
        "description": "Implement a thread-safe bounded blocking queue. enqueue blocks if full, dequeue blocks if empty. Implement size() as well.",
        "examples": [
          { "input": "BoundedBlockingQueue(2),enqueue(1),enqueue(2),dequeue()->1,size()->1,enqueue(3),dequeue()->2,dequeue()->3,size()->0", "output": "see description" }
        ],
        "constraints": ["1<=capacity<=100", "At most 10^4 operations"],
        "hints": [
          "Circular buffer with head/tail; semaphores or condition variables for blocking",
          "notFull semaphore for enqueue; notEmpty semaphore for dequeue"
        ],
        "tags": ["design", "concurrency", "queue"],
        "js": "class BoundedBlockingQueue {\n  constructor(capacity) {}\n  enqueue(element) {}\n  dequeue() {}\n  size() {}\n}",
        "py": "class BoundedBlockingQueue:\n    def __init__(self, capacity):\n        pass\n    def enqueue(self, element):\n        pass\n    def dequeue(self):\n        pass\n    def size(self):\n        pass",
        "testCases": [
          { "input": "BoundedBlockingQueue\n2\nenqueue\n1\nenqueue\n2\ndequeue\nsize\nenqueue\n3\ndequeue\ndequeue\nsize", "expectedOutput": "null\nnull\nnull\n1\n1\nnull\n2\n3\n0" }
        ],
        "xpReward": 100
      },
      {
        "title": "Exam Room",
        "slug": "exam-room",
        "difficulty": "medium",
        "category": "design",
        "description": "Students sit as far as possible from others. Implement seat() and leave(p) for an exam room with n seats.",
        "examples": [
          { "input": "ExamRoom(10),seat()->0,seat()->9,seat()->4,seat()->2,leave(4),seat()->5", "output": "see description" }
        ],
        "constraints": ["1<=n<=10^9", "At most 10^4 calls"],
        "hints": [
          "Sorted set of occupied seats; consider gaps between consecutive seats",
          "Best seat: max(first_seat_distance, max_gap/2, last_seat_distance)"
        ],
        "tags": ["design", "sorting", "binary-search"],
        "js": "class ExamRoom {\n  constructor(n) {}\n  seat() {}\n  leave(p) {}\n}",
        "py": "class ExamRoom:\n    def __init__(self, n):\n        pass\n    def seat(self):\n        pass\n    def leave(self, p):\n        pass",
        "testCases": [
          { "input": "ExamRoom\n10\nseat\nseat\nseat\nseat\nleave\n4\nseat", "expectedOutput": "null\n0\n9\n4\n2\nnull\n5" }
        ],
        "xpReward": 100
      }
    ]
  },
  {
    "dayNumber": 98,
    "topic": "Graph: Advanced Shortest Paths & Flows",
    "lesson": "Johnson's algorithm: all-pairs shortest paths for sparse graphs O(V^2 log V + VE). SPFA (Bellman-Ford with queue): average O(E) but worst O(VE). For negative cycles: Bellman-Ford detects in V-th iteration. A* search: Dijkstra with heuristic h(n) estimating cost to goal. Bidirectional Dijkstra: meet in middle for single-pair queries. Flow: max-flow = min-cut.",
    "problems": [
      {
        "title": "Find the City With Smallest Reachable Neighbors",
        "slug": "find-city-smallest-reachable",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given weighted undirected graph, find city with fewest reachable cities within distanceThreshold. Return highest index on tie.",
        "examples": [
          { "input": "n=4,edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]],distanceThreshold=4", "output": "3" },
          { "input": "n=5,edges=[[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]],distanceThreshold=2", "output": "0" }
        ],
        "constraints": ["2<=n<=100"],
        "hints": [
          "Floyd-Warshall for all-pairs shortest paths",
          "Count reachable cities (dist <= threshold) for each city; return city with min count (highest index on tie)"
        ],
        "tags": ["graph", "floyd-warshall", "shortest-path"],
        "js": "function findTheCity(n, edges, distanceThreshold) {\n  // your code here\n}",
        "py": "def find_the_city(n, edges, distance_threshold):\n    pass",
        "testCases": [
          { "input": "4\n[[0,1,3],[1,2,1],[1,3,4],[2,3,1]]\n4", "expectedOutput": "3" },
          { "input": "5\n[[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]]\n2", "expectedOutput": "0" }
        ],
        "xpReward": 90
      },
      {
        "title": "Reachable Nodes In Subdivided Graph",
        "slug": "reachable-nodes-subdivided-graph",
        "difficulty": "hard",
        "category": "graph",
        "description": "Each edge has cnt subdivided nodes inserted. Starting from node 0 with maxMoves steps, return total reachable nodes (original + subdivided).",
        "examples": [
          { "input": "edges=[[0,1,10],[0,2,1],[1,2,2]],maxMoves=6,n=3", "output": "13" },
          { "input": "edges=[[0,1,4],[1,2,6],[0,2,8],[1,3,1]],maxMoves=10,n=4", "output": "23" }
        ],
        "constraints": ["0<=edges.length<=min(n*(n-1)/2,10^4)", "n<=3000", "0<=maxMoves<=10^9"],
        "hints": [
          "Dijkstra from node 0; dist[u] = max moves remaining at node u",
          "For each edge (u,v,cnt): subdivided nodes reachable = min(cnt, dist[u]+dist[v])"
        ],
        "tags": ["graph", "dijkstra", "heap"],
        "js": "function reachableNodes(edges, maxMoves, n) {\n  // your code here\n}",
        "py": "def reachable_nodes(edges, max_moves, n):\n    pass",
        "testCases": [
          { "input": "[[0,1,10],[0,2,1],[1,2,2]]\n6\n3", "expectedOutput": "13" },
          { "input": "[[0,1,4],[1,2,6],[0,2,8],[1,3,1]]\n10\n4", "expectedOutput": "23" }
        ],
        "xpReward": 140
      },
      {
        "title": "Minimum Cost to Make at Least One Valid Path in a Grid",
        "slug": "min-cost-valid-path-grid",
        "difficulty": "hard",
        "category": "graph",
        "description": "Grid has direction arrows (1=right,2=left,3=down,4=up). Cost to change direction is 1. Find min cost to reach bottom-right from top-left.",
        "examples": [
          { "input": "grid=[[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]", "output": "3" },
          { "input": "grid=[[1,1,3],[3,2,2],[1,1,4]]", "output": "0" }
        ],
        "constraints": ["1<=m,n<=100"],
        "hints": [
          "0-1 BFS (deque): cost 0 if following arrow, cost 1 if changing direction",
          "Use deque: free moves to front, cost-1 moves to back"
        ],
        "tags": ["graph", "bfs", "matrix"],
        "js": "function minCost(grid) {\n  // your code here\n}",
        "py": "def min_cost(grid):\n    pass",
        "testCases": [
          { "input": "[[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]", "expectedOutput": "3" },
          { "input": "[[1,1,3],[3,2,2],[1,1,4]]", "expectedOutput": "0" },
          { "input": "[[1,2],[4,3]]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 140
      },
      {
        "title": "Number of Ways to Arrive at Destination",
        "slug": "number-ways-arrive-destination",
        "difficulty": "medium",
        "category": "graph",
        "description": "Count number of shortest paths from node 0 to node n-1 in a weighted undirected graph. Return mod 10^9+7.",
        "examples": [
          { "input": "n=7,roads=[[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]", "output": "4" },
          { "input": "n=2,roads=[[1,0,10]]", "output": "1" }
        ],
        "constraints": ["1<=n<=200", "n-1<=roads.length<=n*(n-1)/2"],
        "hints": [
          "Dijkstra with count array: ways[u] = number of shortest paths to u",
          "On relaxation: if equal distance ways[v]+=ways[u]; if shorter ways[v]=ways[u]"
        ],
        "tags": ["graph", "dijkstra", "dynamic-programming"],
        "js": "function countPaths(n, roads) {\n  // your code here\n}",
        "py": "def count_paths(n, roads):\n    pass",
        "testCases": [
          { "input": "7\n[[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]", "expectedOutput": "4" },
          { "input": "2\n[[1,0,10]]", "expectedOutput": "1" }
        ],
        "xpReward": 100
      },
      {
        "title": "Second Minimum Time to Reach Destination",
        "slug": "second-minimum-time-destination",
        "difficulty": "hard",
        "category": "graph",
        "description": "Undirected graph with traffic lights (green change seconds, red change seconds). Find second minimum time to reach node n from node 1.",
        "examples": [
          { "input": "n=5,edges=[[1,2],[1,3],[1,4],[3,4],[4,5]],time=3,change=5", "output": "13" },
          { "input": "n=2,edges=[[1,2]],time=3,change=2", "output": "11" }
        ],
        "constraints": ["2<=n<=10^4", "n-1<=edges.length<=min(2*10^4,n*(n-1)/2)"],
        "hints": [
          "BFS tracking dist1[v] and dist2[v] (first and second minimum times)",
          "Account for waiting at red lights: if in red phase wait until next green"
        ],
        "tags": ["graph", "bfs", "shortest-path"],
        "js": "function secondMinimum(n, edges, time, change) {\n  // your code here\n}",
        "py": "def second_minimum(n, edges, time, change):\n    pass",
        "testCases": [
          { "input": "5\n[[1,2],[1,3],[1,4],[3,4],[4,5]]\n3\n5", "expectedOutput": "13" },
          { "input": "2\n[[1,2]]\n3\n2", "expectedOutput": "11" }
        ],
        "xpReward": 140
      }
    ]
  },
  {
    "dayNumber": 99,
    "topic": "The Hardest Problems: Elite Tier",
    "lesson": "Elite problems combine 3+ major techniques, require non-obvious observations, and have solutions that feel like magic until the insight clicks. Approach: (1) Experiment with small examples. (2) Look for invariants and monotonic properties. (3) Ask 'what if I reframe the problem?' (4) Think about what information must be tracked vs what can be discarded. These problems appear in ICPC, Google Code Jam, and senior engineering interviews.",
    "problems": [
      {
        "title": "Maximize Score After N Operations",
        "slug": "maximize-score-after-n-operations",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Pick n pairs from 2n numbers. In i-th operation (1-indexed) score += i * gcd(pair). Maximize total score.",
        "examples": [
          { "input": "nums=[1,2]", "output": "1" },
          { "input": "nums=[3,4,6,8]", "output": "11" },
          { "input": "nums=[1,2,3,4,5,6]", "output": "14" }
        ],
        "constraints": ["1<=n<=7", "nums.length==2n"],
        "hints": [
          "Bitmask DP: dp[mask] = max score using pairs formed from nums in mask",
          "For each mask with 2k bits set: try all pairs as k-th operation, score += k * gcd(pair)"
        ],
        "tags": ["dynamic-programming", "bitmask", "math"],
        "js": "function maxScore(nums) {\n  // your code here\n}",
        "py": "def max_score(nums):\n    pass",
        "testCases": [
          { "input": "[1,2]", "expectedOutput": "1" },
          { "input": "[3,4,6,8]", "expectedOutput": "11" },
          { "input": "[1,2,3,4,5,6]", "expectedOutput": "14", "isHidden": true }
        ],
        "xpReward": 150
      },
      {
        "title": "Minimum Operations to Make Array Continuous",
        "slug": "min-operations-array-continuous",
        "difficulty": "hard",
        "category": "binary-search",
        "description": "Return minimum operations to make array continuous (all values in range [x, x+n-1] for some x, all distinct). One operation changes any element.",
        "examples": [
          { "input": "nums=[4,2,5,3]", "output": "0" },
          { "input": "nums=[1,2,3,5,6]", "output": "1" },
          { "input": "nums=[1,10,100,1000]", "output": "3" }
        ],
        "constraints": ["1<=nums.length<=10^5", "1<=nums[i]<=10^9"],
        "hints": [
          "Sort + deduplicate; for each start x count elements already in [x, x+n-1]",
          "Binary search for upper bound; operations = n - count_valid"
        ],
        "tags": ["binary-search", "array", "sliding-window"],
        "js": "function minOperations(nums) {\n  // your code here\n}",
        "py": "def min_operations(nums):\n    pass",
        "testCases": [
          { "input": "[4,2,5,3]", "expectedOutput": "0" },
          { "input": "[1,2,3,5,6]", "expectedOutput": "1" },
          { "input": "[1,10,100,1000]", "expectedOutput": "3", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Minimum Number of Visited Cells in a Grid",
        "slug": "minimum-visited-cells-grid",
        "difficulty": "hard",
        "category": "graph",
        "description": "Grid where grid[i][j] is max steps right or down. Return minimum cells visited to reach bottom-right, or -1.",
        "examples": [
          { "input": "grid=[[3,4,2,1],[4,2,3,1],[2,1,0,0],[2,4,0,0]]", "output": "4" },
          { "input": "grid=[[3,4,2,1],[4,2,1,1],[2,1,1,0],[3,4,1,0]]", "output": "3" },
          { "input": "grid=[[2,1,0],[1,0,0]]", "output": "-1" }
        ],
        "constraints": ["1<=m,n<=10^5", "m*n<=10^5", "0<=grid[i][j]<=10^5"],
        "hints": [
          "BFS with monotonic deque or segment tree to find reachable unvisited cells efficiently",
          "For each cell track minimum distance; use sorted sets of unvisited cells per row and column"
        ],
        "tags": ["graph", "bfs", "segment-tree", "greedy"],
        "js": "function minimumVisitedCells(grid) {\n  // your code here\n}",
        "py": "def minimum_visited_cells(grid):\n    pass",
        "testCases": [
          { "input": "[[3,4,2,1],[4,2,3,1],[2,1,0,0],[2,4,0,0]]", "expectedOutput": "4" },
          { "input": "[[3,4,2,1],[4,2,1,1],[2,1,1,0],[3,4,1,0]]", "expectedOutput": "3" },
          { "input": "[[2,1,0],[1,0,0]]", "expectedOutput": "-1", "isHidden": true }
        ],
        "xpReward": 150
      },
      {
        "title": "Maximum AND Sum of Array",
        "slug": "maximum-and-sum-array",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Place nums into numSlots slots (each slot holds at most 2 numbers). Maximize sum of (nums[i] AND slot_number).",
        "examples": [
          { "input": "nums=[1,2,3,4,5,6],numSlots=3", "output": "9" },
          { "input": "nums=[1,3,10,4,7,1],numSlots=9", "output": "24" }
        ],
        "constraints": ["1<=numSlots<=9", "1<=nums.length<=2*numSlots"],
        "hints": [
          "Bitmask DP with ternary mask (each slot used 0,1,2 times) or pair bitmask",
          "dp[mask] = max AND sum placing nums in slots indicated by mask"
        ],
        "tags": ["dynamic-programming", "bitmask", "bit-manipulation"],
        "js": "function maximumANDSum(nums, numSlots) {\n  // your code here\n}",
        "py": "def maximum_and_sum(nums, num_slots):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4,5,6]\n3", "expectedOutput": "9" },
          { "input": "[1,3,10,4,7,1]\n9", "expectedOutput": "24" }
        ],
        "xpReward": 150
      },
      {
        "title": "Count Pairs With XOR in a Range",
        "slug": "count-pairs-xor-range",
        "difficulty": "hard",
        "category": "trie",
        "description": "Return number of pairs (i,j) where i<j and low <= nums[i] XOR nums[j] <= high.",
        "examples": [
          { "input": "nums=[1,4,2,7],low=2,high=6", "output": "6" },
          { "input": "nums=[9,8,4,2,1],low=5,high=14", "output": "8" }
        ],
        "constraints": ["1<=nums.length<=2*10^4", "1<=nums[i]<=2*10^4", "1<=low<=high<=2*10^4"],
        "hints": [
          "count(high) - count(low-1) where count(limit) = pairs with XOR <= limit",
          "Trie: for each number count existing numbers with XOR <= limit using bit-by-bit traversal"
        ],
        "tags": ["trie", "bit-manipulation", "array"],
        "js": "function countPairs(nums, low, high) {\n  // your code here\n}",
        "py": "def count_pairs(nums, low, high):\n    pass",
        "testCases": [
          { "input": "[1,4,2,7]\n2\n6", "expectedOutput": "6" },
          { "input": "[9,8,4,2,1]\n5\n14", "expectedOutput": "8" }
        ],
        "xpReward": 150
      }
    ]
  },
  {
    "dayNumber": 100,
    "topic": "Day 100: Mastery Celebration & Legendary Problems",
    "lesson": "Congratulations on reaching Day 100! You have traversed the full landscape of computer science algorithms: from basic arrays and strings through trees, graphs, dynamic programming, segment trees, tries, and beyond. The problems today are legendary — each represents a pinnacle of algorithmic thinking. Approach them not as tests but as celebrations of how far you have come. Every expert was once a beginner who refused to quit.",
    "problems": [
      {
        "title": "Minimum Cost to Hire K Workers (Extended)",
        "slug": "min-cost-hire-k-workers-extended",
        "difficulty": "hard",
        "category": "heap",
        "description": "Hire exactly k workers to minimize total wage. Each worker must be paid at least their minimum wage and proportionally to quality. Also output which k workers were selected.",
        "examples": [
          { "input": "quality=[10,20,5],wage=[70,50,30],k=2", "output": "[105.00000,[0,2]]" },
          { "input": "quality=[3,1,10,10,1],wage=[4,8,2,2,7],k=3", "output": "[30.66667,[0,2,3]]" }
        ],
        "constraints": ["1<=k<=quality.length<=10^4"],
        "hints": [
          "Sort by wage/quality ratio; max-heap tracks k lowest quality workers seen so far",
          "Track which workers are in heap for output"
        ],
        "tags": ["heap", "greedy", "sorting"],
        "js": "function mincostToHireWorkersWithList(quality, wage, k) {\n  // your code here\n}",
        "py": "def mincost_to_hire_workers_with_list(quality, wage, k):\n    pass",
        "testCases": [
          { "input": "[10,20,5]\n[70,50,30]\n2", "expectedOutput": "105.00000" },
          { "input": "[3,1,10,10,1]\n[4,8,2,2,7]\n3", "expectedOutput": "30.66667" }
        ],
        "xpReward": 200
      },
      {
        "title": "Median of a Row Wise Sorted Matrix",
        "slug": "median-row-wise-sorted-matrix",
        "difficulty": "hard",
        "category": "binary-search",
        "description": "Find median of an m x n matrix where each row is sorted. Total cells m*n is always odd.",
        "examples": [
          { "input": "matrix=[[1,3,5],[2,6,9],[3,6,9]]", "output": "5" },
          { "input": "matrix=[[1,2],[3,4]]", "output": "3" }
        ],
        "constraints": ["1<=m,n<=500", "1<=matrix[i][j]<=10^6", "m*n is odd"],
        "hints": [
          "Binary search on answer value x; count numbers <= x across all rows",
          "Median is smallest x where count(x) > m*n/2; each row binary search is O(log n)"
        ],
        "tags": ["binary-search", "matrix"],
        "js": "function matrixMedian(matrix) {\n  // your code here\n}",
        "py": "def matrix_median(matrix):\n    pass",
        "testCases": [
          { "input": "[[1,3,5],[2,6,9],[3,6,9]]", "expectedOutput": "5" },
          { "input": "[[1,2],[3,4]]", "expectedOutput": "3" },
          { "input": "[[1]]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 200
      },
      {
        "title": "Palindrome Partitioning IV",
        "slug": "palindrome-partitioning-iv",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Return true if string s can be split into exactly 3 non-empty palindromic substrings.",
        "examples": [
          { "input": "s=abcbdd", "output": "true" },
          { "input": "s=bcbddxy", "output": "false" }
        ],
        "constraints": ["3<=s.length<=2000"],
        "hints": [
          "Precompute palindrome table: isPalin[i][j] in O(n^2)",
          "Try all split pairs (i,j): check isPalin[0][i], isPalin[i+1][j], isPalin[j+1][n-1]"
        ],
        "tags": ["dynamic-programming", "string"],
        "js": "function checkPartitioning(s) {\n  // your code here\n}",
        "py": "def check_partitioning(s):\n    pass",
        "testCases": [
          { "input": "abcbdd", "expectedOutput": "true" },
          { "input": "bcbddxy", "expectedOutput": "false" },
          { "input": "aaa", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 200
      },
      {
        "title": "Maximum Sum of 3 Non-Overlapping Subarrays",
        "slug": "maximum-sum-3-non-overlapping-subarrays",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Find 3 non-overlapping subarrays of length k with maximum sum. Return their starting indices (lexicographically smallest on tie).",
        "examples": [
          { "input": "nums=[1,2,1,2,6,7,5,1],k=2", "output": "[0,3,5]" },
          { "input": "nums=[1,2,1,2,1,2,1,2,1],k=2", "output": "[0,2,4]" }
        ],
        "constraints": ["1<=nums.length<=2*10^4", "1<=k<=floor(nums.length/3)"],
        "hints": [
          "Sliding window sums; left[i] = start index of best window ending at or before i",
          "right[i] = start index of best window starting at or after i; try all middle windows"
        ],
        "tags": ["dynamic-programming", "sliding-window", "prefix-sum"],
        "js": "function maxSumOfThreeSubarrays(nums, k) {\n  // your code here\n}",
        "py": "def max_sum_of_three_subarrays(nums, k):\n    pass",
        "testCases": [
          { "input": "[1,2,1,2,6,7,5,1]\n2", "expectedOutput": "[0,3,5]" },
          { "input": "[1,2,1,2,1,2,1,2,1]\n2", "expectedOutput": "[0,2,4]" }
        ],
        "xpReward": 200
      },
      {
        "title": "Longest Substring with All Distinct Characters After Queries",
        "slug": "longest-substring-distinct-after-queries",
        "difficulty": "hard",
        "category": "sliding-window",
        "description": "Given a string and queries adding characters to specific positions, after each query return the length of the longest substring with all distinct characters.",
        "examples": [
          { "input": "s=abcde,queryIndices=[0,2],queryCharacters=[z,z]", "output": "[1,2]" },
          { "input": "s=babacc,queryIndices=[1,1,2],queryCharacters=[a,b,b]", "output": "[2,1,3]" }
        ],
        "constraints": ["1<=s.length<=3*10^5", "1<=queryCharacters.length<=3*10^5"],
        "hints": [
          "Maintain a sorted set of positions where s[i]==s[i+1] (conflict positions)",
          "After each query update conflicts; longest valid = max gap+1 between consecutive conflicts"
        ],
        "tags": ["sliding-window", "segment-tree", "string"],
        "js": "function longestSubstring(s, queryIndices, queryCharacters) {\n  // your code here\n}",
        "py": "def longest_substring(s, query_indices, query_characters):\n    pass",
        "testCases": [
          { "input": "abcde\n[0,2]\n[z,z]", "expectedOutput": "[1,2]" },
          { "input": "babacc\n[1,1,2]\n[a,b,b]", "expectedOutput": "[2,1,3]" }
        ],
        "xpReward": 200
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
    return NextResponse.json({ success: true, message: `Days 91-100 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}