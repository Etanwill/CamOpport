// src/app/api/code/seed-days-71-80/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 71,
    "topic": "Advanced Tree: LCA & Path Problems",
    "lesson": "Lowest Common Ancestor (LCA): in BST, if both nodes < root go left; if both > root go right; else root is LCA. In general tree: recursive — if node equals p or q return it; LCA is where both left and right subtrees return non-null. Binary lifting for LCA in O(log n) per query after O(n log n) preprocessing. Path between two nodes = path to LCA from each.",
    "problems": [
      {
        "title": "Lowest Common Ancestor of a Binary Tree",
        "slug": "lca-binary-tree",
        "difficulty": "medium",
        "category": "tree",
        "description": "Find the lowest common ancestor of two nodes p and q in a binary tree.",
        "examples": [
          { "input": "root=[3,5,1,6,2,0,8,null,null,7,4],p=5,q=1", "output": "3" },
          { "input": "root=[3,5,1,6,2,0,8,null,null,7,4],p=5,q=4", "output": "5" },
          { "input": "root=[1,2],p=1,q=2", "output": "1" }
        ],
        "constraints": ["2<=nodes<=10^5", "All Node.val are unique"],
        "hints": [
          "If root is null or equals p or q, return root",
          "If both left and right return non-null, root is LCA; else return the non-null one"
        ],
        "tags": ["tree", "dfs", "recursion"],
        "js": "function lowestCommonAncestor(root, p, q) {\n  // your code here\n}",
        "py": "def lowest_common_ancestor(root, p, q):\n    pass",
        "testCases": [
          { "input": "[3,5,1,6,2,0,8,null,null,7,4]\n5\n1", "expectedOutput": "3" },
          { "input": "[3,5,1,6,2,0,8,null,null,7,4]\n5\n4", "expectedOutput": "5" },
          { "input": "[1,2]\n1\n2", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Binary Tree Maximum Path Sum",
        "slug": "binary-tree-maximum-path-sum",
        "difficulty": "hard",
        "category": "tree",
        "description": "A path in a binary tree is a sequence of nodes where each pair is connected. Return the maximum sum of any path (can start and end at any node).",
        "examples": [
          { "input": "root=[1,2,3]", "output": "6" },
          { "input": "root=[-10,9,20,null,null,15,7]", "output": "42" }
        ],
        "constraints": ["1<=nodes<=3*10^4", "-1000<=Node.val<=1000"],
        "hints": [
          "For each node: max gain going down = max(0, left_gain, right_gain) + node.val",
          "Path through node = left_gain + node.val + right_gain; update global max"
        ],
        "tags": ["tree", "dfs", "dynamic-programming"],
        "js": "function maxPathSum(root) {\n  // your code here\n}",
        "py": "def max_path_sum(root):\n    pass",
        "testCases": [
          { "input": "[1,2,3]", "expectedOutput": "6" },
          { "input": "[-10,9,20,null,null,15,7]", "expectedOutput": "42" },
          { "input": "[-3]", "expectedOutput": "-3", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Sum of Distances in Tree",
        "slug": "sum-of-distances-in-tree",
        "difficulty": "hard",
        "category": "tree",
        "description": "Given an undirected tree with n nodes, return array where answer[i] is the sum of distances from node i to all other nodes.",
        "examples": [
          { "input": "n=6,edges=[[0,1],[0,2],[2,3],[2,4],[2,5]]", "output": "[8,12,6,10,10,10]" },
          { "input": "n=1,edges=[]", "output": "[0]" },
          { "input": "n=2,edges=[[1,0]]", "output": "[1,1]" }
        ],
        "constraints": ["1<=n<=3*10^4"],
        "hints": [
          "Two DFS: first computes subtree sizes and answer[root]",
          "Second re-roots: answer[child] = answer[parent] - count[child] + (n - count[child])"
        ],
        "tags": ["tree", "dfs", "graph"],
        "js": "function sumOfDistancesInTree(n, edges) {\n  // your code here\n}",
        "py": "def sum_of_distances_in_tree(n, edges):\n    pass",
        "testCases": [
          { "input": "6\n[[0,1],[0,2],[2,3],[2,4],[2,5]]", "expectedOutput": "[8,12,6,10,10,10]" },
          { "input": "1\n[]", "expectedOutput": "[0]" },
          { "input": "2\n[[1,0]]", "expectedOutput": "[1,1]", "isHidden": true }
        ],
        "xpReward": 140
      },
      {
        "title": "Vertical Order Traversal of a Binary Tree",
        "slug": "vertical-order-traversal-binary-tree",
        "difficulty": "hard",
        "category": "tree",
        "description": "Return vertical order traversal of binary tree. At same position, sort by row then value.",
        "examples": [
          { "input": "root=[3,9,20,null,null,15,7]", "output": "[[9],[3,15],[20],[7]]" },
          { "input": "root=[1,2,3,4,5,6,7]", "output": "[[4],[2],[1,5,6],[3],[7]]" }
        ],
        "constraints": ["1<=nodes<=1000", "0<=Node.val<=1000"],
        "hints": [
          "BFS/DFS tracking (col, row) for each node",
          "Group by col; within same col sort by (row, val)"
        ],
        "tags": ["tree", "bfs", "sorting", "hash-table"],
        "js": "function verticalTraversal(root) {\n  // your code here\n}",
        "py": "def vertical_traversal(root):\n    pass",
        "testCases": [
          { "input": "[3,9,20,null,null,15,7]", "expectedOutput": "[[9],[3,15],[20],[7]]" },
          { "input": "[1,2,3,4,5,6,7]", "expectedOutput": "[[4],[2],[1,5,6],[3],[7]]" }
        ],
        "xpReward": 120
      },
      {
        "title": "House Robber III",
        "slug": "house-robber-iii",
        "difficulty": "medium",
        "category": "tree",
        "description": "Rob houses arranged in a binary tree. Cannot rob directly linked nodes. Return maximum money you can rob.",
        "examples": [
          { "input": "root=[3,2,3,null,3,null,1]", "output": "7" },
          { "input": "root=[3,4,5,1,3,null,1]", "output": "9" }
        ],
        "constraints": ["1<=nodes<=10^4", "0<=Node.val<=10^4"],
        "hints": [
          "For each node return (rob_this, skip_this) pair",
          "rob_this = node.val + skip_left + skip_right; skip_this = max(rob_left,skip_left) + max(rob_right,skip_right)"
        ],
        "tags": ["tree", "dynamic-programming", "dfs"],
        "js": "function rob(root) {\n  // your code here\n}",
        "py": "def rob(root):\n    pass",
        "testCases": [
          { "input": "[3,2,3,null,3,null,1]", "expectedOutput": "7" },
          { "input": "[3,4,5,1,3,null,1]", "expectedOutput": "9" }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 72,
    "topic": "Dynamic Programming: String Problems",
    "lesson": "String DP patterns: dp[i][j] usually means something about s[0..i] and t[0..j]. LCS, edit distance, interleaving all fit this. For single string palindrome dp: dp[i][j] = is s[i..j] palindrome, fill by length. For subsequence counting: watch for 'ways' vs 'length'. Space optimization: many 2D DPs reduce to 1D by processing row by row.",
    "problems": [
      {
        "title": "Longest Common Subsequence",
        "slug": "longest-common-subsequence",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Return the length of the longest common subsequence of two strings.",
        "examples": [
          { "input": "text1=abcde,text2=ace", "output": "3" },
          { "input": "text1=abc,text2=abc", "output": "3" },
          { "input": "text1=abc,text2=def", "output": "0" }
        ],
        "constraints": ["1<=text1.length,text2.length<=1000"],
        "hints": [
          "dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]",
          "If chars match: dp[i][j]=dp[i-1][j-1]+1; else max(dp[i-1][j],dp[i][j-1])"
        ],
        "tags": ["dynamic-programming", "string"],
        "js": "function longestCommonSubsequence(text1, text2) {\n  // your code here\n}",
        "py": "def longest_common_subsequence(text1, text2):\n    pass",
        "testCases": [
          { "input": "abcde\nace", "expectedOutput": "3" },
          { "input": "abc\nabc", "expectedOutput": "3" },
          { "input": "abc\ndef", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Minimum ASCII Delete Sum for Two Strings",
        "slug": "minimum-ascii-delete-sum",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Return minimum sum of ASCII values of deleted characters to make two strings equal.",
        "examples": [
          { "input": "s1=sea,s2=eat", "output": "231" },
          { "input": "s1=delete,s2=leet", "output": "403" }
        ],
        "constraints": ["1<=s1.length,s2.length<=1000"],
        "hints": [
          "Variant of LCS: maximize sum of kept characters (= common subsequence by ASCII sum)",
          "dp[i][j] = max ASCII sum of common subsequence of s1[0..i-1] and s2[0..j-1]"
        ],
        "tags": ["dynamic-programming", "string"],
        "js": "function minimumDeleteSum(s1, s2) {\n  // your code here\n}",
        "py": "def minimum_delete_sum(s1, s2):\n    pass",
        "testCases": [
          { "input": "sea\neat", "expectedOutput": "231" },
          { "input": "delete\nleet", "expectedOutput": "403" }
        ],
        "xpReward": 90
      },
      {
        "title": "Palindromic Substrings",
        "slug": "palindromic-substrings",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Return the number of palindromic substrings in a string.",
        "examples": [
          { "input": "s=abc", "output": "3" },
          { "input": "s=aaa", "output": "6" }
        ],
        "constraints": ["1<=s.length<=1000"],
        "hints": [
          "Expand from center for each character (odd) and pair (even)",
          "Count all palindromes found during expansion"
        ],
        "tags": ["dynamic-programming", "string", "two-pointers"],
        "js": "function countSubstrings(s) {\n  // your code here\n}",
        "py": "def count_substrings(s):\n    pass",
        "testCases": [
          { "input": "abc", "expectedOutput": "3" },
          { "input": "aaa", "expectedOutput": "6" },
          { "input": "fdsklf", "expectedOutput": "6", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Shortest Common Supersequence",
        "slug": "shortest-common-supersequence",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Return the shortest string that has both str1 and str2 as subsequences.",
        "examples": [
          { "input": "str1=abac,str2=cab", "output": "cabac" },
          { "input": "str1=aaaaaaaa,str2=aaaaaaaa", "output": "aaaaaaaa" }
        ],
        "constraints": ["1<=str1.length,str2.length<=1000"],
        "hints": [
          "Build LCS; reconstruct supersequence from LCS DP table",
          "Walk LCS table backwards: if chars match include once, else include both"
        ],
        "tags": ["dynamic-programming", "string"],
        "js": "function shortestCommonSupersequence(str1, str2) {\n  // your code here\n}",
        "py": "def shortest_common_supersequence(str1, str2):\n    pass",
        "testCases": [
          { "input": "abac\ncab", "expectedOutput": "cabac" },
          { "input": "aaaaaaaa\naaaaaaaa", "expectedOutput": "aaaaaaaa" }
        ],
        "xpReward": 110
      },
      {
        "title": "Regular Expression Matching",
        "slug": "regular-expression-matching",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Implement regular expression matching with '.' (any single char) and '*' (zero or more of preceding element).",
        "examples": [
          { "input": "s=aa,p=a", "output": "false" },
          { "input": "s=aa,p=a*", "output": "true" },
          { "input": "s=ab,p=.*", "output": "true" }
        ],
        "constraints": ["1<=s.length<=20", "1<=p.length<=20"],
        "hints": [
          "dp[i][j] = does s[0..i-1] match p[0..j-1]",
          "If p[j-1]=='*': dp[i][j] = dp[i][j-2] (zero) OR (match_char AND dp[i-1][j])"
        ],
        "tags": ["dynamic-programming", "string", "recursion"],
        "js": "function isMatch(s, p) {\n  // your code here\n}",
        "py": "def is_match(s, p):\n    pass",
        "testCases": [
          { "input": "aa\na", "expectedOutput": "false" },
          { "input": "aa\na*", "expectedOutput": "true" },
          { "input": "ab\n.*", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 150
      }
    ]
  },
  {
    "dayNumber": 73,
    "topic": "Sorting Algorithms & Custom Comparators",
    "lesson": "Know when to use each sort: quicksort O(n log n) average, O(n^2) worst; mergesort O(n log n) stable; heapsort O(n log n) in-place; counting/radix O(n) for bounded integers. Custom comparators: for objects sort by multiple keys. Partial sort: quickselect O(n). External sort: merge k sorted streams. Pancake sort, wiggle sort — special constraint problems.",
    "problems": [
      {
        "title": "Sort Colors",
        "slug": "sort-colors",
        "difficulty": "medium",
        "category": "sorting",
        "description": "Sort array of 0s, 1s, and 2s in-place in one pass (Dutch National Flag problem).",
        "examples": [
          { "input": "nums=[2,0,2,1,1,0]", "output": "[0,0,1,1,2,2]" },
          { "input": "nums=[2,0,1]", "output": "[0,1,2]" }
        ],
        "constraints": ["1<=nums.length<=300", "nums[i] in {0,1,2}"],
        "hints": [
          "Three pointers: low (end of 0s), mid (current), high (start of 2s)",
          "Swap based on nums[mid]: 0->swap with low, 2->swap with high, 1->advance mid"
        ],
        "tags": ["sorting", "array", "two-pointers"],
        "js": "function sortColors(nums) {\n  // modify in-place\n}",
        "py": "def sort_colors(nums):\n    pass",
        "testCases": [
          { "input": "[2,0,2,1,1,0]", "expectedOutput": "[0,0,1,1,2,2]" },
          { "input": "[2,0,1]", "expectedOutput": "[0,1,2]" }
        ],
        "xpReward": 60
      },
      {
        "title": "Largest Number",
        "slug": "largest-number",
        "difficulty": "medium",
        "category": "sorting",
        "description": "Arrange non-negative integers to form the largest possible number. Return as string.",
        "examples": [
          { "input": "nums=[10,2]", "output": "210" },
          { "input": "nums=[3,30,34,5,9]", "output": "9534330" }
        ],
        "constraints": ["1<=nums.length<=100", "0<=nums[i]<=10^9"],
        "hints": [
          "Custom comparator: compare ab vs ba as concatenated strings",
          "Sort descending with this comparator; handle all-zeros edge case"
        ],
        "tags": ["sorting", "string", "greedy"],
        "js": "function largestNumber(nums) {\n  // your code here\n}",
        "py": "def largest_number(nums):\n    pass",
        "testCases": [
          { "input": "[10,2]", "expectedOutput": "210" },
          { "input": "[3,30,34,5,9]", "expectedOutput": "9534330" },
          { "input": "[0,0]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Wiggle Sort II",
        "slug": "wiggle-sort-ii",
        "difficulty": "medium",
        "category": "sorting",
        "description": "Reorder array so nums[0] < nums[1] > nums[2] < nums[3]... in-place.",
        "examples": [
          { "input": "nums=[1,5,1,1,6,4]", "output": "[1,6,1,5,1,4]" },
          { "input": "nums=[1,3,2,2,3,1]", "output": "[2,3,1,3,1,2]" }
        ],
        "constraints": ["1<=nums.length<=5*10^4", "0<=nums[i]<=5000"],
        "hints": [
          "Find median with quickselect; then three-way partition (3-color Dutch flag)",
          "Place larger half at odd indices, smaller half at even indices"
        ],
        "tags": ["sorting", "array", "divide-and-conquer"],
        "js": "function wiggleSort(nums) {\n  // modify in-place\n}",
        "py": "def wiggle_sort(nums):\n    pass",
        "testCases": [
          { "input": "[1,5,1,1,6,4]", "expectedOutput": "[1,6,1,5,1,4]" },
          { "input": "[1,3,2,2,3,1]", "expectedOutput": "[2,3,1,3,1,2]" }
        ],
        "xpReward": 100
      },
      {
        "title": "Maximum Gap",
        "slug": "maximum-gap",
        "difficulty": "hard",
        "category": "sorting",
        "description": "Return the maximum difference between successive elements in sorted form of array. Solve in O(n) time and space.",
        "examples": [
          { "input": "nums=[3,6,9,1]", "output": "3" },
          { "input": "nums=[10]", "output": "0" }
        ],
        "constraints": ["1<=nums.length<=10^5", "0<=nums[i]<=10^9"],
        "hints": [
          "Pigeonhole: with n elements in range [min,max], max gap >= (max-min)/(n-1)",
          "Bucket sort: n-1 buckets; max gap must cross a bucket boundary"
        ],
        "tags": ["sorting", "array", "bucket-sort"],
        "js": "function maximumGap(nums) {\n  // your code here\n}",
        "py": "def maximum_gap(nums):\n    pass",
        "testCases": [
          { "input": "[3,6,9,1]", "expectedOutput": "3" },
          { "input": "[10]", "expectedOutput": "0" },
          { "input": "[1,1000000]", "expectedOutput": "999999", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "H-Index",
        "slug": "h-index",
        "difficulty": "medium",
        "category": "sorting",
        "description": "Given citations array, return h-index: maximum h such that h papers have at least h citations.",
        "examples": [
          { "input": "citations=[3,0,6,1,5]", "output": "3" },
          { "input": "citations=[1,3,1]", "output": "1" }
        ],
        "constraints": ["1<=citations.length<=5000", "0<=citations[i]<=1000"],
        "hints": [
          "Sort descending; h-index is largest i where citations[i-1] >= i",
          "Or counting sort: bucket[min(c,n)]++ then scan from right"
        ],
        "tags": ["sorting", "array", "counting-sort"],
        "js": "function hIndex(citations) {\n  // your code here\n}",
        "py": "def h_index(citations):\n    pass",
        "testCases": [
          { "input": "[3,0,6,1,5]", "expectedOutput": "3" },
          { "input": "[1,3,1]", "expectedOutput": "1" },
          { "input": "[0]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 70
      }
    ]
  },
  {
    "dayNumber": 74,
    "topic": "Graph: Minimum Spanning Tree",
    "lesson": "MST: minimum weight set of edges connecting all nodes. Prim's: greedy from any node, always add cheapest edge crossing cut. O((V+E)logV) with heap. Kruskal's: sort edges, add if doesn't create cycle (DSU). O(E log E). Prim's better for dense graphs, Kruskal's for sparse. Boruvka's: O(E log V). Key property: cut property and cycle property.",
    "problems": [
      {
        "title": "Minimum Spanning Tree (Kruskal)",
        "slug": "minimum-spanning-tree-kruskal",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given n nodes and weighted edges, return the total weight of the minimum spanning tree.",
        "examples": [
          { "input": "n=4,edges=[[0,1,10],[0,2,6],[0,3,5],[1,3,15],[2,3,4]]", "output": "19" },
          { "input": "n=2,edges=[[0,1,1]]", "output": "1" }
        ],
        "constraints": ["2<=n<=1000", "1<=edges.length<=5000"],
        "hints": [
          "Sort edges by weight; use DSU to skip edges creating cycles",
          "Stop when n-1 edges added"
        ],
        "tags": ["graph", "union-find", "minimum-spanning-tree", "sorting"],
        "js": "function minimumSpanningTree(n, edges) {\n  // your code here\n}",
        "py": "def minimum_spanning_tree(n, edges):\n    pass",
        "testCases": [
          { "input": "4\n[[0,1,10],[0,2,6],[0,3,5],[1,3,15],[2,3,4]]", "expectedOutput": "19" },
          { "input": "2\n[[0,1,1]]", "expectedOutput": "1" }
        ],
        "xpReward": 90
      },
      {
        "title": "Optimize Water Distribution in a Village",
        "slug": "optimize-water-distribution",
        "difficulty": "hard",
        "category": "graph",
        "description": "Each house can have a well (with cost wells[i]) or connect via pipes. Return minimum total cost to supply water to all houses.",
        "examples": [
          { "input": "n=3,wells=[1,2,2],pipes=[[1,2,1],[2,3,1]]", "output": "3" },
          { "input": "n=2,wells=[1,1],pipes=[[1,2,2]]", "output": "2" }
        ],
        "constraints": ["1<=n<=10^4", "wells.length==n"],
        "hints": [
          "Add virtual node 0 with edges to each house i with weight wells[i-1]",
          "Run Kruskal's MST on augmented graph"
        ],
        "tags": ["graph", "union-find", "minimum-spanning-tree"],
        "js": "function minCostToSupplyWater(n, wells, pipes) {\n  // your code here\n}",
        "py": "def min_cost_to_supply_water(n, wells, pipes):\n    pass",
        "testCases": [
          { "input": "3\n[1,2,2]\n[[1,2,1],[2,3,1]]", "expectedOutput": "3" },
          { "input": "2\n[1,1]\n[[1,2,2]]", "expectedOutput": "2" }
        ],
        "xpReward": 120
      },
      {
        "title": "Find Critical and Pseudo-Critical Edges in MST",
        "slug": "critical-pseudo-critical-edges-mst",
        "difficulty": "hard",
        "category": "graph",
        "description": "Find all critical edges (whose removal increases MST weight) and pseudo-critical edges (appear in some MST) of given graph.",
        "examples": [
          { "input": "n=5,edges=[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]", "output": "[[0,1],[2,3,4,5]]" },
          { "input": "n=4,edges=[[0,1,1],[1,2,1],[0,2,1],[2,3,2]]", "output": "[[3],[0,1,2]]" }
        ],
        "constraints": ["2<=n<=100", "1<=edges.length<=200"],
        "hints": [
          "Critical: MST weight increases when edge removed",
          "Pseudo-critical: MST weight same when edge forced included"
        ],
        "tags": ["graph", "union-find", "minimum-spanning-tree", "sorting"],
        "js": "function findCriticalAndPseudoCriticalEdges(n, edges) {\n  // your code here\n}",
        "py": "def find_critical_and_pseudo_critical_edges(n, edges):\n    pass",
        "testCases": [
          { "input": "5\n[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]", "expectedOutput": "[[0,1],[2,3,4,5]]" },
          { "input": "4\n[[0,1,1],[1,2,1],[0,2,1],[2,3,2]]", "expectedOutput": "[[3],[0,1,2]]" }
        ],
        "xpReward": 150
      },
      {
        "title": "Connecting Cities With Minimum Cost",
        "slug": "connecting-cities-minimum-cost",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given n cities and connections with costs, return the minimum cost to connect all cities, or -1 if impossible.",
        "examples": [
          { "input": "n=3,connections=[[1,2,5],[1,3,6],[2,3,1]]", "output": "6" },
          { "input": "n=4,connections=[[1,2,3],[3,4,4]]", "output": "-1" }
        ],
        "constraints": ["1<=n<=10^4", "1<=connections.length<=10^4"],
        "hints": [
          "Standard MST problem: Kruskal's or Prim's",
          "Return -1 if fewer than n-1 edges added"
        ],
        "tags": ["graph", "union-find", "minimum-spanning-tree"],
        "js": "function minimumCost(n, connections) {\n  // your code here\n}",
        "py": "def minimum_cost(n, connections):\n    pass",
        "testCases": [
          { "input": "3\n[[1,2,5],[1,3,6],[2,3,1]]", "expectedOutput": "6" },
          { "input": "4\n[[1,2,3],[3,4,4]]", "expectedOutput": "-1" }
        ],
        "xpReward": 90
      },
      {
        "title": "Remove Max Number of Edges to Keep Graph Fully Traversable",
        "slug": "remove-max-edges-fully-traversable",
        "difficulty": "hard",
        "category": "graph",
        "description": "Graph has type 1 (Alice only), type 2 (Bob only), type 3 (both) edges. Find max edges removable while keeping graph fully traversable for both.",
        "examples": [
          { "input": "n=4,edges=[[3,1,2],[3,2,3],[1,1,3],[1,2,4],[1,1,2],[2,3,4]]", "output": "2" },
          { "input": "n=4,edges=[[3,1,2],[3,2,3],[1,1,4],[2,1,4]]", "output": "0" },
          { "input": "n=4,edges=[[3,2,3],[1,1,2],[2,3,4]]", "output": "-1" }
        ],
        "constraints": ["1<=n<=10^5", "1<=edges.length<=4*10^5"],
        "hints": [
          "Two separate DSUs for Alice and Bob; first add type 3 edges to both",
          "Then add type 1 to Alice DSU and type 2 to Bob DSU; edge removable if redundant for both"
        ],
        "tags": ["graph", "union-find"],
        "js": "function maxNumEdgesToRemove(n, edges) {\n  // your code here\n}",
        "py": "def max_num_edges_to_remove(n, edges):\n    pass",
        "testCases": [
          { "input": "4\n[[3,1,2],[3,2,3],[1,1,3],[1,2,4],[1,1,2],[2,3,4]]", "expectedOutput": "2" },
          { "input": "4\n[[3,1,2],[3,2,3],[1,1,4],[2,1,4]]", "expectedOutput": "0" },
          { "input": "4\n[[3,2,3],[1,1,2],[2,3,4]]", "expectedOutput": "-1", "isHidden": true }
        ],
        "xpReward": 140
      }
    ]
  },
  {
    "dayNumber": 75,
    "topic": "Randomized Algorithms & Reservoir Sampling",
    "lesson": "Reservoir sampling: pick k items from stream of unknown size uniformly at random. For k=1: replace current with i-th item with probability 1/i. Fisher-Yates shuffle: O(n) unbiased shuffle. Random pivot in quicksort eliminates O(n^2) worst case. Skip list: probabilistic O(log n) data structure. Key insight: randomization often simplifies problems and avoids adversarial inputs.",
    "problems": [
      {
        "title": "Shuffle an Array",
        "slug": "shuffle-an-array",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Implement Fisher-Yates shuffle: reset() returns original array, shuffle() returns randomly shuffled copy with equal probability for all permutations.",
        "examples": [
          { "input": "Solution([1,2,3]),shuffle(),reset(),shuffle()", "output": "random permutations" }
        ],
        "constraints": ["1<=nums.length<=200", "All nums[i] are unique"],
        "hints": [
          "Fisher-Yates: for i from n-1 to 1, swap nums[i] with nums[random(0,i)]",
          "Keep original copy for reset"
        ],
        "tags": ["randomized", "array", "math"],
        "js": "class Solution {\n  constructor(nums) {}\n  reset() {}\n  shuffle() {}\n}",
        "py": "class Solution:\n    def __init__(self, nums):\n        pass\n    def reset(self):\n        pass\n    def shuffle(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[1,2,3]\nshuffle\nreset\nshuffle", "expectedOutput": "valid_permutation\n[1,2,3]\nvalid_permutation" }
        ],
        "xpReward": 70
      },
      {
        "title": "Random Pick with Weight",
        "slug": "random-pick-with-weight",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Implement pickIndex() that picks index i with probability w[i]/sum(w).",
        "examples": [
          { "input": "Solution([1]),pickIndex()->0", "output": "0" },
          { "input": "Solution([1,3]),pickIndex()->0 or 1 with prob 1/4 and 3/4", "output": "random" }
        ],
        "constraints": ["1<=w.length<=10^4", "1<=w[i]<=10^5", "At most 10^4 calls"],
        "hints": [
          "Prefix sum array; generate random number in [1, total]",
          "Binary search for first prefix sum >= random number"
        ],
        "tags": ["randomized", "binary-search", "prefix-sum"],
        "js": "class Solution {\n  constructor(w) {}\n  pickIndex() {}\n}",
        "py": "class Solution:\n    def __init__(self, w):\n        pass\n    def pick_index(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[1]\npickIndex", "expectedOutput": "0" },
          { "input": "Solution\n[1,3]\npickIndex\npickIndex\npickIndex\npickIndex", "expectedOutput": "valid_distribution" }
        ],
        "xpReward": 80
      },
      {
        "title": "Linked List Random Node",
        "slug": "linked-list-random-node",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Implement getRandom() that returns a random node value from a linked list with equal probability. Must work for unknown list length.",
        "examples": [
          { "input": "Solution([1,2,3]),getRandom()->1 or 2 or 3 equally", "output": "random" }
        ],
        "constraints": ["1<=nodes<=10^4", "At most 10^4 calls"],
        "hints": [
          "Reservoir sampling: traverse list, replace result with node i's value with probability 1/i",
          "No need to know length in advance"
        ],
        "tags": ["randomized", "linked-list", "reservoir-sampling"],
        "js": "class Solution {\n  constructor(head) {}\n  getRandom() {}\n}",
        "py": "class Solution:\n    def __init__(self, head):\n        pass\n    def get_random(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[1,2,3]\ngetRandom\ngetRandom\ngetRandom", "expectedOutput": "valid_distribution" }
        ],
        "xpReward": 80
      },
      {
        "title": "Random Pick Index",
        "slug": "random-pick-index",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Given array with possible duplicates, implement pick(target) returning index of target chosen uniformly at random among all its occurrences.",
        "examples": [
          { "input": "Solution([1,2,3,3,3]),pick(3)->2,3,or 4 equally,pick(1)->0", "output": "random" }
        ],
        "constraints": ["1<=nums.length<=2*10^7", "At most 10^4 calls"],
        "hints": [
          "Reservoir sampling over matching indices",
          "For each index where nums[i]==target, replace result with i with probability 1/count"
        ],
        "tags": ["randomized", "array", "reservoir-sampling"],
        "js": "class Solution {\n  constructor(nums) {}\n  pick(target) {}\n}",
        "py": "class Solution:\n    def __init__(self, nums):\n        pass\n    def pick(self, target):\n        pass",
        "testCases": [
          { "input": "Solution\n[1,2,3,3,3]\npick\n3\npick\n1\npick\n3", "expectedOutput": "valid_distribution" }
        ],
        "xpReward": 80
      },
      {
        "title": "Random Point in Non-overlapping Rectangles",
        "slug": "random-point-non-overlapping-rectangles",
        "difficulty": "medium",
        "category": "randomized",
        "description": "Given non-overlapping rectangles, pick a random integer point uniformly from the union of all rectangles.",
        "examples": [
          { "input": "Solution([[-2,-2,1,1],[2,2,4,4]]),pick()->random point in either rectangle", "output": "random" }
        ],
        "constraints": ["1<=rects.length<=100", "At most 10^4 calls"],
        "hints": [
          "Weight each rectangle by its area (point count)",
          "Pick rectangle by weighted random, then uniform point within it"
        ],
        "tags": ["randomized", "binary-search", "math"],
        "js": "class Solution {\n  constructor(rects) {}\n  pick() {}\n}",
        "py": "class Solution:\n    def __init__(self, rects):\n        pass\n    def pick(self):\n        pass",
        "testCases": [
          { "input": "Solution\n[[-2,-2,1,1],[2,2,4,4]]\npick\npick\npick", "expectedOutput": "valid_distribution" }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 76,
    "topic": "Advanced DP: Bitmask DP",
    "lesson": "Bitmask DP: represent subset as integer bitmask. dp[mask] = answer considering exactly the elements in mask. Iterate over all 2^n subsets. Enumerate subsets of mask: for sub=mask; sub>0; sub=(sub-1)&mask. TSP: dp[mask][i] = min cost to visit all nodes in mask ending at i. O(2^n * n^2). Use when n <= 20.",
    "problems": [
      {
        "title": "Traveling Salesman Problem (Held-Karp)",
        "slug": "traveling-salesman-held-karp",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Given n cities and distance matrix, return the minimum cost to visit all cities starting and ending at city 0.",
        "examples": [
          { "input": "dist=[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]", "output": "80" },
          { "input": "dist=[[0,1],[1,0]]", "output": "2" }
        ],
        "constraints": ["2<=n<=15"],
        "hints": [
          "dp[mask][i] = min cost to visit all cities in mask ending at city i",
          "Transition: dp[mask|(1<<j)][j] = min(dp[mask][i] + dist[i][j])"
        ],
        "tags": ["dynamic-programming", "bitmask", "graph"],
        "js": "function tsp(dist) {\n  // your code here\n}",
        "py": "def tsp(dist):\n    pass",
        "testCases": [
          { "input": "[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]", "expectedOutput": "80" },
          { "input": "[[0,1],[1,0]]", "expectedOutput": "2" }
        ],
        "xpReward": 150
      },
      {
        "title": "Shortest Path Visiting All Nodes",
        "slug": "shortest-path-visiting-all-nodes",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Given undirected graph, return shortest path length that visits every node (can revisit).",
        "examples": [
          { "input": "graph=[[1,2,3],[0],[0],[0]]", "output": "4" },
          { "input": "graph=[[1],[0,2,4],[1,3,4],[2],[1,2]]", "output": "4" }
        ],
        "constraints": ["1<=n<=12"],
        "hints": [
          "BFS with state (node, visited_mask); start from all nodes simultaneously",
          "Visited when mask == (1<<n)-1"
        ],
        "tags": ["dynamic-programming", "bitmask", "bfs", "graph"],
        "js": "function shortestPathLength(graph) {\n  // your code here\n}",
        "py": "def shortest_path_length(graph):\n    pass",
        "testCases": [
          { "input": "[[1,2,3],[0],[0],[0]]", "expectedOutput": "4" },
          { "input": "[[1],[0,2,4],[1,3,4],[2],[1,2]]", "expectedOutput": "4" }
        ],
        "xpReward": 140
      },
      {
        "title": "Minimum Cost to Connect All Points via Bitmask",
        "slug": "partition-into-k-equal-sum-subsets",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Partition array into k subsets with equal sum. Return true if possible.",
        "examples": [
          { "input": "nums=[4,3,2,3,5,2,1],k=4", "output": "true" },
          { "input": "nums=[1,2,3,4],k=3", "output": "false" }
        ],
        "constraints": ["1<=k<=nums.length<=16", "0<nums[i]<10^4"],
        "hints": [
          "Bitmask DP: dp[mask] = true if elements in mask can fill complete buckets",
          "Track current bucket sum; when full start new bucket"
        ],
        "tags": ["dynamic-programming", "bitmask", "backtracking"],
        "js": "function canPartitionKSubsets(nums, k) {\n  // your code here\n}",
        "py": "def can_partition_k_subsets(nums, k):\n    pass",
        "testCases": [
          { "input": "[4,3,2,3,5,2,1]\n4", "expectedOutput": "true" },
          { "input": "[1,2,3,4]\n3", "expectedOutput": "false" },
          { "input": "[2,2,2,2,3,4,5]\n4", "expectedOutput": "false", "isHidden": true }
        ],
        "xpReward": 110
      },
      {
        "title": "Maximum Students Taking Exam",
        "slug": "maximum-students-taking-exam",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Given seating chart with broken seats, place maximum students so no one can cheat (adjacent and diagonal seats).",
        "examples": [
          { "input": "seats=[[#,.],[.,#],[#,.]]", "output": "4" },
          { "input": "seats=[[.,#],[#,#],[#,.],[#,#],[#,.]]", "output": "3" }
        ],
        "constraints": ["1<=m<=8", "1<=n<=8"],
        "hints": [
          "Bitmask DP row by row: dp[row][mask] = max students with mask seated in row",
          "Constraints: no two adjacent in same row, no diagonal conflicts with previous row"
        ],
        "tags": ["dynamic-programming", "bitmask", "matrix"],
        "js": "function maxStudents(seats) {\n  // your code here\n}",
        "py": "def max_students(seats):\n    pass",
        "testCases": [
          { "input": "[['#','.'],['.',\"#\"],['#','.']]", "expectedOutput": "4" },
          { "input": "[['.',\"#\"],[\"#\",\"#\"],[\"#\",'.'],['#','#'],['#','.']]", "expectedOutput": "3" }
        ],
        "xpReward": 140
      },
      {
        "title": "Number of Ways to Wear Different Hats to Each Other",
        "slug": "number-ways-wear-hats",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "n people and 40 hats; each person has preferred hats. Count ways to assign distinct hats so everyone wears preferred hat. Return mod 10^9+7.",
        "examples": [
          { "input": "hats=[[3,4],[4,5],[5]]", "output": "1" },
          { "input": "hats=[[3,5,1],[3,5]]", "output": "4" }
        ],
        "constraints": ["1<=n<=10", "1<=hats[i].length<=40"],
        "hints": [
          "Bitmask over people (n<=10); dp[mask] = ways to assign hats to people in mask",
          "Iterate hats; for each hat assign to an unassigned person who likes it"
        ],
        "tags": ["dynamic-programming", "bitmask", "array"],
        "js": "function numberWays(hats) {\n  // your code here\n}",
        "py": "def number_ways(hats):\n    pass",
        "testCases": [
          { "input": "[[3,4],[4,5],[5]]", "expectedOutput": "1" },
          { "input": "[[3,5,1],[3,5]]", "expectedOutput": "4" }
        ],
        "xpReward": 150
      }
    ]
  },
  {
    "dayNumber": 77,
    "topic": "String: Advanced Algorithms",
    "lesson": "Z-algorithm: Z[i] = length of longest substring starting at i that matches prefix of s. Suffix array: sorted suffixes, built in O(n log n). With LCP array enables O(n) string operations. Aho-Corasick: multi-pattern search in O(n+m+z). Rolling hash for substring comparison. Manacher's: all palindrome lengths in O(n). Choose based on what you're searching for.",
    "problems": [
      {
        "title": "Longest Duplicate Substring",
        "slug": "longest-duplicate-substring",
        "difficulty": "hard",
        "category": "string",
        "description": "Return the longest substring that appears at least twice. Return empty string if none.",
        "examples": [
          { "input": "s=banana", "output": "ana" },
          { "input": "s=abcd", "output": "" }
        ],
        "constraints": ["2<=s.length<=3*10^4"],
        "hints": [
          "Binary search on length; Rabin-Karp rolling hash to check if duplicate exists",
          "If hash matches, verify strings (avoid collisions)"
        ],
        "tags": ["string", "binary-search", "rolling-hash", "suffix-array"],
        "js": "function longestDupSubstring(s) {\n  // your code here\n}",
        "py": "def longest_dup_substring(s):\n    pass",
        "testCases": [
          { "input": "banana", "expectedOutput": "ana" },
          { "input": "abcd", "expectedOutput": "" },
          { "input": "moplvidmaagmsibhklidlgldbgldahialdlggdsdlgpdlgphliqgpcmldhpbgmshnapl", "expectedOutput": "gdlg", "isHidden": true }
        ],
        "xpReward": 140
      },
      {
        "title": "Find All Anagrams in a String",
        "slug": "find-all-anagrams-string",
        "difficulty": "medium",
        "category": "string",
        "description": "Return all start indices of anagrams of pattern p in string s.",
        "examples": [
          { "input": "s=cbaebabacd,p=abc", "output": "[0,6]" },
          { "input": "s=abab,p=ab", "output": "[0,1,2]" }
        ],
        "constraints": ["1<=s.length,p.length<=3*10^4"],
        "hints": [
          "Sliding window of size p.length; frequency map comparison",
          "Track count of matched chars to avoid full map comparison each step"
        ],
        "tags": ["string", "sliding-window", "hash-table"],
        "js": "function findAnagrams(s, p) {\n  // your code here\n}",
        "py": "def find_anagrams(s, p):\n    pass",
        "testCases": [
          { "input": "cbaebabacd\nabc", "expectedOutput": "[0,6]" },
          { "input": "abab\nab", "expectedOutput": "[0,1,2]" }
        ],
        "xpReward": 70
      },
      {
        "title": "Repeated Substring Pattern",
        "slug": "repeated-substring-pattern",
        "difficulty": "easy",
        "category": "string",
        "description": "Return true if string s can be constructed by repeating a substring of it.",
        "examples": [
          { "input": "s=abab", "output": "true" },
          { "input": "s=aba", "output": "false" },
          { "input": "s=abcabcabcabc", "output": "true" }
        ],
        "constraints": ["1<=s.length<=10^4"],
        "hints": [
          "If s is made of repeated pattern p, then s+s contains s starting at index 1",
          "Or KMP failure function: if n%(n-failure[n-1])==0 then true"
        ],
        "tags": ["string", "kmp"],
        "js": "function repeatedSubstringPattern(s) {\n  // your code here\n}",
        "py": "def repeated_substring_pattern(s):\n    pass",
        "testCases": [
          { "input": "abab", "expectedOutput": "true" },
          { "input": "aba", "expectedOutput": "false" },
          { "input": "abcabcabcabc", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 50
      },
      {
        "title": "Short Encoding of Words",
        "slug": "short-encoding-of-words",
        "difficulty": "medium",
        "category": "string",
        "description": "Encode list of words as reference string S with '#' separators. Return minimum length of S.",
        "examples": [
          { "input": "words=[time,me,bell]", "output": "10" },
          { "input": "words=[t]", "output": "2" }
        ],
        "constraints": ["1<=words.length<=2000", "1<=words[i].length<=7"],
        "hints": [
          "A word is redundant if it is a suffix of another word",
          "Build trie of reversed words; count leaves * (depth+1)"
        ],
        "tags": ["string", "trie", "hash-table"],
        "js": "function minimumLengthEncoding(words) {\n  // your code here\n}",
        "py": "def minimum_length_encoding(words):\n    pass",
        "testCases": [
          { "input": "[\"time\",\"me\",\"bell\"]", "expectedOutput": "10" },
          { "input": "[\"t\"]", "expectedOutput": "2" }
        ],
        "xpReward": 80
      },
      {
        "title": "Concatenated Words",
        "slug": "concatenated-words",
        "difficulty": "hard",
        "category": "string",
        "description": "Return all words in the list that can be formed by concatenating at least two shorter words from the same list.",
        "examples": [
          { "input": "words=[cat,cats,catsdogcats,dog,dogcatsdog,hippopotamuses,rat,ratcatdogcat]", "output": "[catsdogcats,dogcatsdog,ratcatdogcat]" },
          { "input": "words=[cat,dog,catdog]", "output": "[catdog]" }
        ],
        "constraints": ["1<=words.length<=10^4", "1<=words[i].length<=30"],
        "hints": [
          "Word break DP for each word; use word set for O(1) lookup",
          "Must use at least 2 words; track segment count"
        ],
        "tags": ["string", "dynamic-programming", "trie"],
        "js": "function findAllConcatenatedWordsInADict(words) {\n  // your code here\n}",
        "py": "def find_all_concatenated_words_in_a_dict(words):\n    pass",
        "testCases": [
          { "input": "[\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\",\"hippopotamuses\",\"rat\",\"ratcatdogcat\"]", "expectedOutput": "[\"catsdogcats\",\"dogcatsdog\",\"ratcatdogcat\"]" },
          { "input": "[\"cat\",\"dog\",\"catdog\"]", "expectedOutput": "[\"catdog\"]" }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 78,
    "topic": "Advanced Heap & Priority Queue Patterns",
    "lesson": "Heap patterns beyond basics: (1) Fixed-size k heap for streaming top-k. (2) Two-heap trick for dynamic median. (3) Lazy deletion: push (priority, id), skip if id already processed. (4) Multi-way merge: heap of (val, source). (5) Scheduling: heap of (end_time, ...) to free resources. Always ask: what determines priority? What needs to come out first?",
    "problems": [
      {
        "title": "IPO",
        "slug": "ipo",
        "difficulty": "hard",
        "category": "heap",
        "description": "Given projects with capital requirements and profits, pick at most k projects to maximize final capital starting with w capital.",
        "examples": [
          { "input": "k=2,w=0,profits=[1,2,3],capital=[0,1,1]", "output": "4" },
          { "input": "k=3,w=0,profits=[1,2,3],capital=[0,1,2]", "output": "6" }
        ],
        "constraints": ["1<=k<=10^5", "0<=w<=10^9", "1<=profits.length<=10^5"],
        "hints": [
          "Sort projects by capital; min-heap on capital, max-heap on profits",
          "Each round: push all affordable projects to profit heap; pick max profit"
        ],
        "tags": ["heap", "greedy", "sorting"],
        "js": "function findMaximizedCapital(k, w, profits, capital) {\n  // your code here\n}",
        "py": "def find_maximized_capital(k, w, profits, capital):\n    pass",
        "testCases": [
          { "input": "2\n0\n[1,2,3]\n[0,1,1]", "expectedOutput": "4" },
          { "input": "3\n0\n[1,2,3]\n[0,1,2]", "expectedOutput": "6" }
        ],
        "xpReward": 130
      },
      {
        "title": "Find K Pairs with Smallest Sums",
        "slug": "find-k-pairs-smallest-sums",
        "difficulty": "medium",
        "category": "heap",
        "description": "Given two sorted arrays, find k pairs (u,v) with smallest sums where u from nums1 and v from nums2.",
        "examples": [
          { "input": "nums1=[1,7,11],nums2=[2,4,6],k=3", "output": "[[1,2],[1,4],[1,6]]" },
          { "input": "nums1=[1,1,2],nums2=[1,2,3],k=2", "output": "[[1,1],[1,1]]" }
        ],
        "constraints": ["1<=nums1.length,nums2.length<=10^5", "1<=k<=10^4"],
        "hints": [
          "Min-heap initialized with (nums1[i]+nums2[0], i, 0) for all i",
          "Pop min; push (sum+next, i, j+1) if j+1 valid"
        ],
        "tags": ["heap", "array", "sorting"],
        "js": "function kSmallestPairs(nums1, nums2, k) {\n  // your code here\n}",
        "py": "def k_smallest_pairs(nums1, nums2, k):\n    pass",
        "testCases": [
          { "input": "[1,7,11]\n[2,4,6]\n3", "expectedOutput": "[[1,2],[1,4],[1,6]]" },
          { "input": "[1,1,2]\n[1,2,3]\n2", "expectedOutput": "[[1,1],[1,1]]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Kth Smallest Element in a Sorted Matrix",
        "slug": "kth-smallest-sorted-matrix",
        "difficulty": "medium",
        "category": "heap",
        "description": "Find kth smallest element in n x n matrix where each row and column is sorted.",
        "examples": [
          { "input": "matrix=[[1,5,9],[10,11,13],[12,13,15]],k=8", "output": "13" },
          { "input": "matrix=[[-5]],k=1", "output": "-5" }
        ],
        "constraints": ["1<=n<=300", "1<=k<=n^2"],
        "hints": [
          "Min-heap: start with first column; pop and push right neighbor",
          "Or binary search on value: count elements <= mid"
        ],
        "tags": ["heap", "matrix", "binary-search"],
        "js": "function kthSmallest(matrix, k) {\n  // your code here\n}",
        "py": "def kth_smallest(matrix, k):\n    pass",
        "testCases": [
          { "input": "[[1,5,9],[10,11,13],[12,13,15]]\n8", "expectedOutput": "13" },
          { "input": "[[-5]]\n1", "expectedOutput": "-5" }
        ],
        "xpReward": 90
      },
      {
        "title": "Course Schedule III",
        "slug": "course-schedule-iii",
        "difficulty": "hard",
        "category": "heap",
        "description": "Given courses with [duration, lastDay], return maximum number of courses you can take. Each course must end by its lastDay.",
        "examples": [
          { "input": "courses=[[100,200],[200,1300],[1000,1250],[2000,3200]]", "output": "3" },
          { "input": "courses=[[1,2]]", "output": "1" },
          { "input": "courses=[[3,2],[4,3]]", "output": "0" }
        ],
        "constraints": ["1<=courses.length<=10^4", "1<=duration[i],lastDay[i]<=10^4"],
        "hints": [
          "Sort by lastDay; greedily take each course; if time exceeded, drop longest taken course",
          "Max-heap of durations taken so far"
        ],
        "tags": ["heap", "greedy", "sorting"],
        "js": "function scheduleCourse(courses) {\n  // your code here\n}",
        "py": "def schedule_course(courses):\n    pass",
        "testCases": [
          { "input": "[[100,200],[200,1300],[1000,1250],[2000,3200]]", "expectedOutput": "3" },
          { "input": "[[1,2]]", "expectedOutput": "1" },
          { "input": "[[3,2],[4,3]]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Smallest Range Covering Elements from K Lists",
        "slug": "smallest-range-k-lists",
        "difficulty": "hard",
        "category": "heap",
        "description": "Return smallest range [a,b] such that at least one number from each of k sorted lists lies within it.",
        "examples": [
          { "input": "nums=[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", "output": "[20,24]" },
          { "input": "nums=[[1,2,3],[1,2,3],[1,2,3]]", "output": "[1,1]" }
        ],
        "constraints": ["nums.length==k", "1<=k<=3500", "1<=nums[i].length<=50"],
        "hints": [
          "Min-heap with one element from each list; track global max in heap",
          "Range = [heap_min, global_max]; advance min list pointer"
        ],
        "tags": ["heap", "sliding-window", "sorting"],
        "js": "function smallestRange(nums) {\n  // your code here\n}",
        "py": "def smallest_range(nums):\n    pass",
        "testCases": [
          { "input": "[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", "expectedOutput": "[20,24]" },
          { "input": "[[1,2,3],[1,2,3],[1,2,3]]", "expectedOutput": "[1,1]" }
        ],
        "xpReward": 140
      }
    ]
  },
  {
    "dayNumber": 79,
    "topic": "Computational Geometry",
    "lesson": "Cross product (b-a)x(c-a): positive = c is left of ab, negative = right, zero = collinear. Convex hull: Graham scan O(n log n) or Monotone chain. Point in polygon: ray casting. Closest pair: divide and conquer O(n log n). Line intersection: parametric form. Sweep line for area of union of rectangles. Orientation test is foundation of most geometry algorithms.",
    "problems": [
      {
        "title": "Convex Hull",
        "slug": "convex-hull",
        "difficulty": "hard",
        "category": "geometry",
        "description": "Return points forming the convex hull in counter-clockwise order (monotone chain algorithm).",
        "examples": [
          { "input": "points=[[0,0],[0,1],[1,1],[1,0],[0.5,0.5]]", "output": "[[0,0],[1,0],[1,1],[0,1]]" },
          { "input": "points=[[1,1]]", "output": "[[1,1]]" }
        ],
        "constraints": ["1<=points.length<=3000"],
        "hints": [
          "Monotone chain: sort points; build lower and upper hulls",
          "Cross product <= 0: remove last point (clockwise turn)"
        ],
        "tags": ["geometry", "math", "sorting"],
        "js": "function outerTrees(trees) {\n  // your code here\n}",
        "py": "def outer_trees(trees):\n    pass",
        "testCases": [
          { "input": "[[0,0],[0,1],[1,1],[1,0],[0.5,0.5]]", "expectedOutput": "[[0,0],[1,0],[1,1],[0,1]]" },
          { "input": "[[1,1]]", "expectedOutput": "[[1,1]]" }
        ],
        "xpReward": 130
      },
      {
        "title": "Maximum Points on a Line",
        "slug": "maximum-points-on-a-line",
        "difficulty": "hard",
        "category": "geometry",
        "description": "Given points on a plane, return the maximum number of points that lie on the same straight line.",
        "examples": [
          { "input": "points=[[1,1],[2,2],[3,3]]", "output": "3" },
          { "input": "points=[[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]", "output": "4" }
        ],
        "constraints": ["1<=points.length<=300", "-10^4<=xi,yi<=10^4"],
        "hints": [
          "For each point as anchor: group others by slope (dy/dx as reduced fraction)",
          "Handle vertical lines and duplicate points separately"
        ],
        "tags": ["geometry", "hash-table", "math"],
        "js": "function maxPoints(points) {\n  // your code here\n}",
        "py": "def max_points(points):\n    pass",
        "testCases": [
          { "input": "[[1,1],[2,2],[3,3]]", "expectedOutput": "3" },
          { "input": "[[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]", "expectedOutput": "4" }
        ],
        "xpReward": 120
      },
      {
        "title": "Erect the Fence",
        "slug": "erect-the-fence",
        "difficulty": "hard",
        "category": "geometry",
        "description": "Given tree positions, return all trees that must be on the perimeter fence (convex hull) to enclose all trees.",
        "examples": [
          { "input": "trees=[[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]", "output": "[[1,1],[2,0],[4,2],[3,3],[2,4]]" },
          { "input": "trees=[[1,2],[2,2],[4,2]]", "output": "[[4,2],[2,2],[1,2]]" }
        ],
        "constraints": ["1<=trees.length<=3000"],
        "hints": [
          "Convex hull including collinear boundary points",
          "Use cross product <= 0 (not < 0) to keep collinear edge points"
        ],
        "tags": ["geometry", "math", "sorting"],
        "js": "function outerTrees(trees) {\n  // your code here\n}",
        "py": "def outer_trees(trees):\n    pass",
        "testCases": [
          { "input": "[[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]", "expectedOutput": "[[1,1],[2,0],[3,3],[2,4],[4,2]]" },
          { "input": "[[1,2],[2,2],[4,2]]", "expectedOutput": "[[1,2],[2,2],[4,2]]" }
        ],
        "xpReward": 130
      },
      {
        "title": "Rectangle Area II",
        "slug": "rectangle-area-ii",
        "difficulty": "hard",
        "category": "geometry",
        "description": "Return total area covered by given rectangles (union area). Return answer mod 10^9+7.",
        "examples": [
          { "input": "rectangles=[[0,0,2,2],[1,0,2,3],[1,0,3,1]]", "output": "6" },
          { "input": "rectangles=[[0,0,1000000000,1000000000]]", "output": "49" }
        ],
        "constraints": ["1<=rectangles.length<=200", "All coordinates in [0, 10^9]"],
        "hints": [
          "Coordinate compression on y-axis; sweep line on x-axis",
          "For each x-segment: count total y-coverage using events"
        ],
        "tags": ["geometry", "segment-tree", "sweep-line"],
        "js": "function rectangleArea(rectangles) {\n  // your code here\n}",
        "py": "def rectangle_area(rectangles):\n    pass",
        "testCases": [
          { "input": "[[0,0,2,2],[1,0,2,3],[1,0,3,1]]", "expectedOutput": "6" },
          { "input": "[[0,0,1000000000,1000000000]]", "expectedOutput": "49" }
        ],
        "xpReward": 150
      },
      {
        "title": "K Closest Points to Origin",
        "slug": "k-closest-points-to-origin",
        "difficulty": "medium",
        "category": "geometry",
        "description": "Return the k closest points to the origin. Answer can be in any order.",
        "examples": [
          { "input": "points=[[1,3],[-2,2]],k=1", "output": "[[-2,2]]" },
          { "input": "points=[[3,3],[5,-1],[-2,4]],k=2", "output": "[[3,3],[-2,4]]" }
        ],
        "constraints": ["1<=k<=points.length<=10^4"],
        "hints": [
          "Max-heap of size k: push each point, pop if size > k",
          "Or quickselect in O(n) average"
        ],
        "tags": ["geometry", "heap", "divide-and-conquer", "sorting"],
        "js": "function kClosest(points, k) {\n  // your code here\n}",
        "py": "def k_closest(points, k):\n    pass",
        "testCases": [
          { "input": "[[1,3],[-2,2]]\n1", "expectedOutput": "[[-2,2]]" },
          { "input": "[[3,3],[5,-1],[-2,4]]\n2", "expectedOutput": "[[3,3],[-2,4]]" }
        ],
        "xpReward": 70
      }
    ]
  },
  {
    "dayNumber": 80,
    "topic": "Mock Interview: Google-Style Problems",
    "lesson": "Google interviews focus on: optimal time AND space complexity, clean code, handling edge cases gracefully, clear communication of thought process. Common Google patterns: range queries with preprocessing, multi-dimensional DP, graph problems with constraints, string manipulation with multiple valid approaches. Practice explaining your approach before coding.",
    "problems": [
      {
        "title": "Longest Increasing Path in a Matrix",
        "slug": "longest-increasing-path-matrix",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Find the length of the longest increasing path in a matrix. From each cell, move in 4 directions (no diagonals, no wrapping).",
        "examples": [
          { "input": "matrix=[[9,9,4],[6,6,8],[2,1,1]]", "output": "4" },
          { "input": "matrix=[[3,4,5],[3,2,6],[2,2,1]]", "output": "4" },
          { "input": "matrix=[[1]]", "output": "1" }
        ],
        "constraints": ["1<=m,n<=200"],
        "hints": [
          "DFS with memoization: dp[i][j] = longest path starting at (i,j)",
          "No visited array needed since path is strictly increasing (no cycles possible)"
        ],
        "tags": ["dynamic-programming", "dfs", "memoization", "matrix"],
        "js": "function longestIncreasingPath(matrix) {\n  // your code here\n}",
        "py": "def longest_increasing_path(matrix):\n    pass",
        "testCases": [
          { "input": "[[9,9,4],[6,6,8],[2,1,1]]", "expectedOutput": "4" },
          { "input": "[[3,4,5],[3,2,6],[2,2,1]]", "expectedOutput": "4" },
          { "input": "[[1]]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Frog Jump",
        "slug": "frog-jump",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Frog crosses river on stones. If last jump was k, next jump can be k-1, k, or k+1. Return true if frog can reach last stone.",
        "examples": [
          { "input": "stones=[0,1,3,5,6,8,12,17]", "output": "true" },
          { "input": "stones=[0,1,2,3,4,8,9,11]", "output": "false" }
        ],
        "constraints": ["2<=stones.length<=2000", "0<=stones[i]<=2^31-1"],
        "hints": [
          "dp[stone] = set of jump sizes that can reach this stone",
          "For each stone and each valid jump k in its set, update neighbors with k-1,k,k+1"
        ],
        "tags": ["dynamic-programming", "hash-table", "array"],
        "js": "function canCross(stones) {\n  // your code here\n}",
        "py": "def can_cross(stones):\n    pass",
        "testCases": [
          { "input": "[0,1,3,5,6,8,12,17]", "expectedOutput": "true" },
          { "input": "[0,1,2,3,4,8,9,11]", "expectedOutput": "false" }
        ],
        "xpReward": 120
      },
      {
        "title": "Split Array into Fibonacci Sequence",
        "slug": "split-array-fibonacci-sequence",
        "difficulty": "medium",
        "category": "backtracking",
        "description": "Split digit string into Fibonacci-like sequence (each number = sum of two before). Return any valid list or empty.",
        "examples": [
          { "input": "num=1101111", "output": "[11,0,11,11]" },
          { "input": "num=112358130", "output": "[]" },
          { "input": "num=0123", "output": "[]" }
        ],
        "constraints": ["1<=num.length<=200"],
        "hints": [
          "Backtrack: fix first two numbers, check if rest forms valid Fibonacci",
          "Prune: no leading zeros, no overflow (> 2^31-1)"
        ],
        "tags": ["backtracking", "string", "math"],
        "js": "function splitIntoFibonacci(num) {\n  // your code here\n}",
        "py": "def split_into_fibonacci(num):\n    pass",
        "testCases": [
          { "input": "1101111", "expectedOutput": "[11,0,11,11]" },
          { "input": "112358130", "expectedOutput": "[]" },
          { "input": "0123", "expectedOutput": "[]", "isHidden": true }
        ],
        "xpReward": 100
      },
      {
        "title": "Number of Atoms",
        "slug": "number-of-atoms",
        "difficulty": "hard",
        "category": "string",
        "description": "Given chemical formula string, return the count of each atom in sorted order.",
        "examples": [
          { "input": "formula=H2O", "output": "H2O" },
          { "input": "formula=Mg(OH)2", "output": "H2MgO2" },
          { "input": "formula=K4(ON(SO3)2)2", "output": "K4N2O14S4" }
        ],
        "constraints": ["1<=formula.length<=1000"],
        "hints": [
          "Stack of hashmaps; on '(' push new map; on ')' pop, multiply by count, merge into top",
          "Parse element names (capital then lowercase), then optional number"
        ],
        "tags": ["string", "stack", "hash-table"],
        "js": "function countOfAtoms(formula) {\n  // your code here\n}",
        "py": "def count_of_atoms(formula):\n    pass",
        "testCases": [
          { "input": "H2O", "expectedOutput": "H2O" },
          { "input": "Mg(OH)2", "expectedOutput": "H2MgO2" },
          { "input": "K4(ON(SO3)2)2", "expectedOutput": "K4N2O14S4", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Zuma Game",
        "slug": "zuma-game",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Remove all balls from board by inserting balls from hand. Return minimum insertions, or -1 if impossible.",
        "examples": [
          { "input": "board=WRRBBW,hand=RB", "output": "-1" },
          { "input": "board=WWRRBBWW,hand=WRBRW", "output": "2" },
          { "input": "board=G,hand=GGGGG", "output": "2" }
        ],
        "constraints": ["1<=board.length<=16", "1<=hand.length<=5"],
        "hints": [
          "BFS/DFS with memoization on (board_state, hand_state)",
          "At each step: find best position to insert a ball that clears group of 2+"
        ],
        "tags": ["dynamic-programming", "dfs", "memoization", "string"],
        "js": "function findMinStep(board, hand) {\n  // your code here\n}",
        "py": "def find_min_step(board, hand):\n    pass",
        "testCases": [
          { "input": "WRRBBW\nRB", "expectedOutput": "-1" },
          { "input": "WWRRBBWW\nWRBRW", "expectedOutput": "2" },
          { "input": "G\nGGGGG", "expectedOutput": "2", "isHidden": true }
        ],
        "xpReward": 150
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
    return NextResponse.json({ success: true, message: `Days 71-80 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}