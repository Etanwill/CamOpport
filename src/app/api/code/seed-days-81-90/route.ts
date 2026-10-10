// src/app/api/code/seed-days-81-90/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 81,
    "topic": "Mock Interview: Amazon-Style Problems",
    "lesson": "Amazon interviews emphasize: scalability, OOP design, edge cases, and real-world applicability. Common themes: data stream processing, top-K patterns, LRU/LFU caches, system design coding. They love problems involving trees, graphs, and arrays with practical context. Practice verbalizing constraints and assumptions before diving into code.",
    "problems": [
      {
        "title": "Top K Frequent Words",
        "slug": "top-k-frequent-words",
        "difficulty": "medium",
        "category": "heap",
        "description": "Given an array of words and integer k, return the k most frequent words sorted by frequency (ties broken alphabetically).",
        "examples": [
          { "input": "words=[i,love,leetcode,i,love,coding],k=2", "output": "[i,love]" },
          { "input": "words=[the,day,is,sunny,the,the,the,sunny,is,is],k=4", "output": "[the,is,sunny,day]" }
        ],
        "constraints": ["1<=words.length<=500", "1<=k<=unique words count"],
        "hints": [
          "Frequency map then min-heap of size k",
          "Comparator: higher freq first; same freq: lexicographically smaller first"
        ],
        "tags": ["heap", "hash-table", "sorting", "string"],
        "js": "function topKFrequent(words, k) {\n  // your code here\n}",
        "py": "def top_k_frequent(words, k):\n    pass",
        "testCases": [
          { "input": "[\"i\",\"love\",\"leetcode\",\"i\",\"love\",\"coding\"]\n2", "expectedOutput": "[\"i\",\"love\"]" },
          { "input": "[\"the\",\"day\",\"is\",\"sunny\",\"the\",\"the\",\"the\",\"sunny\",\"is\",\"is\"]\n4", "expectedOutput": "[\"the\",\"is\",\"sunny\",\"day\"]" }
        ],
        "xpReward": 80
      },
      {
        "title": "Number of Islands",
        "slug": "number-of-islands",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given a 2D grid of '1's (land) and '0's (water), return the number of islands.",
        "examples": [
          { "input": "grid=[[1,1,1,1,0],[1,1,0,1,0],[1,1,0,0,0],[0,0,0,0,0]]", "output": "1" },
          { "input": "grid=[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]]", "output": "3" }
        ],
        "constraints": ["1<=m,n<=300"],
        "hints": [
          "DFS/BFS from each unvisited land cell; mark visited by setting to '0'",
          "Count how many times you start a new DFS/BFS"
        ],
        "tags": ["graph", "dfs", "bfs", "matrix", "union-find"],
        "js": "function numIslands(grid) {\n  // your code here\n}",
        "py": "def num_islands(grid):\n    pass",
        "testCases": [
          { "input": "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", "expectedOutput": "1" },
          { "input": "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "expectedOutput": "3" }
        ],
        "xpReward": 70
      },
      {
        "title": "Reorder List",
        "slug": "reorder-list",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Reorder linked list L0->L1->...->Ln to L0->Ln->L1->Ln-1->L2->Ln-2->... in-place.",
        "examples": [
          { "input": "head=[1,2,3,4]", "output": "[1,4,2,3]" },
          { "input": "head=[1,2,3,4,5]", "output": "[1,5,2,4,3]" }
        ],
        "constraints": ["1<=nodes<=5*10^4"],
        "hints": [
          "Find middle; reverse second half; merge two halves alternating",
          "Three separate steps: split, reverse, merge"
        ],
        "tags": ["linked-list", "two-pointers", "recursion"],
        "js": "function reorderList(head) {\n  // modify in-place\n}",
        "py": "def reorder_list(head):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4]", "expectedOutput": "[1,4,2,3]" },
          { "input": "[1,2,3,4,5]", "expectedOutput": "[1,5,2,4,3]" }
        ],
        "xpReward": 80
      },
      {
        "title": "Rotting Oranges",
        "slug": "rotting-oranges",
        "difficulty": "medium",
        "category": "graph",
        "description": "Grid with 0 (empty), 1 (fresh), 2 (rotten). Rotten oranges spread each minute. Return minutes until all fresh rot, or -1 if impossible.",
        "examples": [
          { "input": "grid=[[2,1,1],[1,1,0],[0,1,1]]", "output": "4" },
          { "input": "grid=[[2,1,1],[0,1,1],[1,0,1]]", "output": "-1" },
          { "input": "grid=[[0,2]]", "output": "0" }
        ],
        "constraints": ["1<=m,n<=10"],
        "hints": [
          "Multi-source BFS from all rotten oranges simultaneously",
          "Count fresh oranges; if any remain after BFS return -1"
        ],
        "tags": ["graph", "bfs", "matrix"],
        "js": "function orangesRotting(grid) {\n  // your code here\n}",
        "py": "def oranges_rotting(grid):\n    pass",
        "testCases": [
          { "input": "[[2,1,1],[1,1,0],[0,1,1]]", "expectedOutput": "4" },
          { "input": "[[2,1,1],[0,1,1],[1,0,1]]", "expectedOutput": "-1" },
          { "input": "[[0,2]]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Minimum Depth of Binary Tree",
        "slug": "minimum-depth-binary-tree",
        "difficulty": "easy",
        "category": "tree",
        "description": "Find the minimum depth of a binary tree (shortest path from root to nearest leaf).",
        "examples": [
          { "input": "root=[3,9,20,null,null,15,7]", "output": "2" },
          { "input": "root=[2,null,3,null,4,null,5,null,6]", "output": "5" }
        ],
        "constraints": ["0<=nodes<=10^5"],
        "hints": [
          "BFS level order: first leaf encountered = minimum depth",
          "DFS: if only one child, don't count the missing child's side"
        ],
        "tags": ["tree", "bfs", "dfs"],
        "js": "function minDepth(root) {\n  // your code here\n}",
        "py": "def min_depth(root):\n    pass",
        "testCases": [
          { "input": "[3,9,20,null,null,15,7]", "expectedOutput": "2" },
          { "input": "[2,null,3,null,4,null,5,null,6]", "expectedOutput": "5" },
          { "input": "[]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 50
      }
    ]
  },
  {
    "dayNumber": 82,
    "topic": "Mock Interview: Meta-Style Problems",
    "lesson": "Meta (Facebook) interviews focus on: clean elegant solutions, communication, handling ambiguity. They favor graph problems, string manipulation, and sliding window. They love asking 'can you optimize further?' after a working solution. Practice optimizing from O(n^2) to O(n log n) to O(n). Think about real-world usage: billions of users, sparse data, streaming.",
    "problems": [
      {
        "title": "Valid Palindrome II",
        "slug": "valid-palindrome-ii",
        "difficulty": "easy",
        "category": "two-pointers",
        "description": "Return true if string can become palindrome by removing at most one character.",
        "examples": [
          { "input": "s=aba", "output": "true" },
          { "input": "s=abca", "output": "true" },
          { "input": "s=abc", "output": "false" }
        ],
        "constraints": ["1<=s.length<=10^5"],
        "hints": [
          "Two pointers from both ends; on mismatch try skipping left or right char",
          "Check if either resulting substring is palindrome"
        ],
        "tags": ["two-pointers", "string", "greedy"],
        "js": "function validPalindrome(s) {\n  // your code here\n}",
        "py": "def valid_palindrome(s):\n    pass",
        "testCases": [
          { "input": "aba", "expectedOutput": "true" },
          { "input": "abca", "expectedOutput": "true" },
          { "input": "abc", "expectedOutput": "false", "isHidden": true }
        ],
        "xpReward": 50
      },
      {
        "title": "Subarray Sum Divisible by K",
        "slug": "subarray-sum-divisible-k",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return number of non-empty subarrays with sum divisible by k.",
        "examples": [
          { "input": "nums=[4,5,0,-2,-3,1],k=5", "output": "7" },
          { "input": "nums=[5],k=9", "output": "0" }
        ],
        "constraints": ["1<=nums.length<=3*10^4", "-10^4<=nums[i]<=10^4", "2<=k<=10^4"],
        "hints": [
          "Prefix sum mod k; count pairs with same remainder",
          "Handle negative remainders: rem = ((rem % k) + k) % k"
        ],
        "tags": ["prefix-sum", "hash-table", "array"],
        "js": "function subarraysDivByK(nums, k) {\n  // your code here\n}",
        "py": "def subarrays_div_by_k(nums, k):\n    pass",
        "testCases": [
          { "input": "[4,5,0,-2,-3,1]\n5", "expectedOutput": "7" },
          { "input": "[5]\n9", "expectedOutput": "0" }
        ],
        "xpReward": 80
      },
      {
        "title": "Minimum Remove to Make Valid Parentheses",
        "slug": "minimum-remove-valid-parens-meta",
        "difficulty": "medium",
        "category": "string",
        "description": "Remove minimum parentheses to make the string valid. Return any valid result.",
        "examples": [
          { "input": "s=lee(t(c)o)de)", "output": "lee(t(c)o)de" },
          { "input": "s=a)b(c)d", "output": "ab(c)d" },
          { "input": "s=))(", "output": "" }
        ],
        "constraints": ["1<=s.length<=10^5"],
        "hints": [
          "Stack of unmatched '(' indices; mark ')' with no match for removal",
          "Remove all chars at marked and remaining stack indices"
        ],
        "tags": ["string", "stack"],
        "js": "function minRemoveToMakeValid(s) {\n  // your code here\n}",
        "py": "def min_remove_to_make_valid(s):\n    pass",
        "testCases": [
          { "input": "lee(t(c)o)de)", "expectedOutput": "lee(t(c)o)de" },
          { "input": "a)b(c)d", "expectedOutput": "ab(c)d" },
          { "input": "))(", "expectedOutput": "", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Random Pick with Blacklist",
        "slug": "random-pick-blacklist",
        "difficulty": "hard",
        "category": "randomized",
        "description": "Pick uniformly random integer from [0, n) excluding blacklisted numbers in O(1) per call after O(b) init.",
        "examples": [
          { "input": "Solution(7,[2,3,5]),pick()->0,1,4,or 6 equally", "output": "random" }
        ],
        "constraints": ["1<=n<=10^9", "0<=blacklist.length<=min(10^5,n-1)"],
        "hints": [
          "Map blacklisted numbers in [0,n-b) to non-blacklisted numbers in [n-b,n)",
          "Pick random in [0,n-b); if in map return mapped value"
        ],
        "tags": ["randomized", "hash-table", "binary-search"],
        "js": "class Solution {\n  constructor(n, blacklist) {}\n  pick() {}\n}",
        "py": "class Solution:\n    def __init__(self, n, blacklist):\n        pass\n    def pick(self):\n        pass",
        "testCases": [
          { "input": "Solution\n7\n[2,3,5]\npick\npick\npick\npick", "expectedOutput": "valid_distribution" }
        ],
        "xpReward": 130
      },
      {
        "title": "Range Addition",
        "slug": "range-addition",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Given length n and list of [startIndex, endIndex, inc] operations, return the final array after all range increments.",
        "examples": [
          { "input": "length=5,updates=[[1,3,2],[2,4,3],[0,2,-2]]", "output": "[-2,0,3,5,3]" },
          { "input": "length=10,updates=[[2,4,6],[5,6,8],[1,9,-4]]", "output": "[0,-4,2,2,2,4,4,-4,-4,-4]" }
        ],
        "constraints": ["1<=length<=10^5", "0<=updates.length<=10^4"],
        "hints": [
          "Difference array: diff[start]+=inc, diff[end+1]-=inc",
          "Reconstruct with prefix sum"
        ],
        "tags": ["prefix-sum", "array"],
        "js": "function getModifiedArray(length, updates) {\n  // your code here\n}",
        "py": "def get_modified_array(length, updates):\n    pass",
        "testCases": [
          { "input": "5\n[[1,3,2],[2,4,3],[0,2,-2]]", "expectedOutput": "[-2,0,3,5,3]" },
          { "input": "10\n[[2,4,6],[5,6,8],[1,9,-4]]", "expectedOutput": "[0,-4,2,2,2,4,4,-4,-4,-4]" }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 83,
    "topic": "Mock Interview: Microsoft-Style Problems",
    "lesson": "Microsoft interviews value: correctness first, then optimization. They ask behavioral questions alongside coding. Common patterns: tree manipulation, string parsing, dynamic programming on sequences. They often ask follow-ups like 'what if the input doesn't fit in memory?' or 'how would you handle concurrent access?' Think iteratively: O(n^2) solution first, then optimize.",
    "problems": [
      {
        "title": "Flatten Binary Tree to Linked List",
        "slug": "flatten-binary-tree-linked-list",
        "difficulty": "medium",
        "category": "tree",
        "description": "Flatten a binary tree into a linked list in-place following preorder traversal.",
        "examples": [
          { "input": "root=[1,2,5,3,4,null,6]", "output": "[1,null,2,null,3,null,4,null,5,null,6]" },
          { "input": "root=[]", "output": "[]" },
          { "input": "root=[0]", "output": "[0]" }
        ],
        "constraints": ["0<=nodes<=2000"],
        "hints": [
          "For each node with left child: find rightmost of left subtree, attach right subtree there",
          "Move left subtree to right; set left to null; advance to right"
        ],
        "tags": ["tree", "dfs", "linked-list"],
        "js": "function flatten(root) {\n  // modify in-place\n}",
        "py": "def flatten(root):\n    pass",
        "testCases": [
          { "input": "[1,2,5,3,4,null,6]", "expectedOutput": "[1,null,2,null,3,null,4,null,5,null,6]" },
          { "input": "[]", "expectedOutput": "[]" },
          { "input": "[0]", "expectedOutput": "[0]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Maximum Width of Binary Tree",
        "slug": "maximum-width-binary-tree",
        "difficulty": "medium",
        "category": "tree",
        "description": "Return maximum width of a binary tree. Width is number of nodes between leftmost and rightmost non-null nodes at any level (including nulls between them).",
        "examples": [
          { "input": "root=[1,3,2,5,3,null,9]", "output": "4" },
          { "input": "root=[1,3,2,5,null,null,9,6,null,7]", "output": "7" },
          { "input": "root=[1,3,2,5]", "output": "2" }
        ],
        "constraints": ["1<=nodes<=3000"],
        "hints": [
          "BFS with node indices: left child = 2*i, right child = 2*i+1",
          "Width at each level = last_index - first_index + 1; normalize to prevent overflow"
        ],
        "tags": ["tree", "bfs", "dfs"],
        "js": "function widthOfBinaryTree(root) {\n  // your code here\n}",
        "py": "def width_of_binary_tree(root):\n    pass",
        "testCases": [
          { "input": "[1,3,2,5,3,null,9]", "expectedOutput": "4" },
          { "input": "[1,3,2,5,null,null,9,6,null,7]", "expectedOutput": "7" },
          { "input": "[1,3,2,5]", "expectedOutput": "2", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Word Search",
        "slug": "word-search",
        "difficulty": "medium",
        "category": "backtracking",
        "description": "Given 2D board and word, return true if word exists using adjacent cells (not reused).",
        "examples": [
          { "input": "board=[[A,B,C,E],[S,F,C,S],[A,D,E,E]],word=ABCCED", "output": "true" },
          { "input": "board=[[A,B,C,E],[S,F,C,S],[A,D,E,E]],word=SEE", "output": "true" },
          { "input": "board=[[A,B,C,E],[S,F,C,S],[A,D,E,E]],word=ABCB", "output": "false" }
        ],
        "constraints": ["1<=m,n<=6", "1<=word.length<=15"],
        "hints": [
          "DFS backtracking from each cell; mark visited by modifying board temporarily",
          "Restore cell value after DFS returns"
        ],
        "tags": ["backtracking", "matrix", "dfs"],
        "js": "function exist(board, word) {\n  // your code here\n}",
        "py": "def exist(board, word):\n    pass",
        "testCases": [
          { "input": "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCCED", "expectedOutput": "true" },
          { "input": "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nSEE", "expectedOutput": "true" },
          { "input": "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCB", "expectedOutput": "false", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Reverse Words in a String",
        "slug": "reverse-words-in-a-string",
        "difficulty": "medium",
        "category": "string",
        "description": "Reverse the order of words in a string. Remove leading/trailing spaces and reduce multiple spaces to one.",
        "examples": [
          { "input": "s=the sky is blue", "output": "blue is sky the" },
          { "input": "s=  hello world  ", "output": "world hello" },
          { "input": "s=a good   example", "output": "example good a" }
        ],
        "constraints": ["1<=s.length<=10^4"],
        "hints": [
          "Split on spaces (filter empty), reverse array, join with single space",
          "Or in-place: trim, reverse whole string, reverse each word"
        ],
        "tags": ["string", "two-pointers"],
        "js": "function reverseWords(s) {\n  // your code here\n}",
        "py": "def reverse_words(s):\n    pass",
        "testCases": [
          { "input": "the sky is blue", "expectedOutput": "blue is sky the" },
          { "input": "  hello world  ", "expectedOutput": "world hello" },
          { "input": "a good   example", "expectedOutput": "example good a", "isHidden": true }
        ],
        "xpReward": 60
      },
      {
        "title": "Minimum Genetic Mutation",
        "slug": "minimum-genetic-mutation",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given start and end gene strings and a gene bank, return minimum mutations to go from start to end (change one char at a time, each intermediate must be in bank).",
        "examples": [
          { "input": "startGene=AACCGGTT,endGene=AACCGGTA,bank=[AACCGGTA]", "output": "1" },
          { "input": "startGene=AACCGGTT,endGene=AAACGGTA,bank=[AACCGGTA,AACCGCTA,AAACGGTA]", "output": "2" }
        ],
        "constraints": ["gene strings of length 8 using A,C,G,T"],
        "hints": [
          "BFS: each state is a gene string; neighbors differ by one char and are in bank",
          "Use set for O(1) bank lookup"
        ],
        "tags": ["graph", "bfs", "string"],
        "js": "function minMutation(startGene, endGene, bank) {\n  // your code here\n}",
        "py": "def min_mutation(start_gene, end_gene, bank):\n    pass",
        "testCases": [
          { "input": "AACCGGTT\nAACCGGTA\n[\"AACCGGTA\"]", "expectedOutput": "1" },
          { "input": "AACCGGTT\nAAACGGTA\n[\"AACCGGTA\",\"AACCGCTA\",\"AAACGGTA\"]", "expectedOutput": "2" },
          { "input": "AACCGGTT\nAAACGGTA\n[]", "expectedOutput": "-1", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 84,
    "topic": "Advanced Graph: Flow Networks",
    "lesson": "Max flow = min cut (Ford-Fulkerson theorem). Edmonds-Karp: BFS for augmenting paths O(VE^2). Dinic's: level graph + blocking flow O(V^2 * E). Applications: bipartite matching (each match = 1 unit of flow), project selection, image segmentation. Bipartite matching via max flow: source -> left nodes -> right nodes -> sink, each edge capacity 1.",
    "problems": [
      {
        "title": "Maximum Bipartite Matching",
        "slug": "maximum-bipartite-matching",
        "difficulty": "hard",
        "category": "graph",
        "description": "Given bipartite graph with n left nodes, m right nodes and edges, return maximum matching size.",
        "examples": [
          { "input": "n=4,m=4,edges=[[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3]]", "output": "4" },
          { "input": "n=2,m=2,edges=[[0,0],[1,0]]", "output": "1" }
        ],
        "constraints": ["1<=n,m<=500", "0<=edges.length<=2500"],
        "hints": [
          "Augmenting path DFS for each left node",
          "Try to assign right node; if taken try to reassign its left node"
        ],
        "tags": ["graph", "bipartite-matching"],
        "js": "function maxMatching(n, m, edges) {\n  // your code here\n}",
        "py": "def max_matching(n, m, edges):\n    pass",
        "testCases": [
          { "input": "4\n4\n[[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3]]", "expectedOutput": "4" },
          { "input": "2\n2\n[[0,0],[1,0]]", "expectedOutput": "1" }
        ],
        "xpReward": 140
      },
      {
        "title": "Is Graph Bipartite?",
        "slug": "is-graph-bipartite",
        "difficulty": "medium",
        "category": "graph",
        "description": "Return true if the given undirected graph is bipartite (2-colorable with no same-color neighbors).",
        "examples": [
          { "input": "graph=[[1,2,3],[0,2],[0,1,3],[0,2]]", "output": "false" },
          { "input": "graph=[[1,3],[0,2],[1,3],[0,2]]", "output": "true" }
        ],
        "constraints": ["1<=graph.length<=100"],
        "hints": [
          "BFS/DFS 2-coloring: alternate colors at each level",
          "If neighbor has same color as current: not bipartite"
        ],
        "tags": ["graph", "bfs", "dfs", "union-find"],
        "js": "function isBipartite(graph) {\n  // your code here\n}",
        "py": "def is_bipartite(graph):\n    pass",
        "testCases": [
          { "input": "[[1,2,3],[0,2],[0,1,3],[0,2]]", "expectedOutput": "false" },
          { "input": "[[1,3],[0,2],[1,3],[0,2]]", "expectedOutput": "true" }
        ],
        "xpReward": 80
      },
      {
        "title": "Possible Bipartition",
        "slug": "possible-bipartition",
        "difficulty": "medium",
        "category": "graph",
        "description": "Split n people into two groups where no two who dislike each other are in the same group. Return true if possible.",
        "examples": [
          { "input": "n=4,dislikes=[[1,2],[1,3],[2,4]]", "output": "true" },
          { "input": "n=3,dislikes=[[1,2],[1,3],[2,3]]", "output": "false" },
          { "input": "n=5,dislikes=[[1,2],[2,3],[3,4],[4,5],[1,5]]", "output": "false" }
        ],
        "constraints": ["1<=n<=2000", "0<=dislikes.length<=10^4"],
        "hints": [
          "Build graph from dislikes; check if bipartite",
          "2-color with BFS/DFS; odd cycle = not bipartite"
        ],
        "tags": ["graph", "bfs", "dfs", "union-find"],
        "js": "function possibleBipartition(n, dislikes) {\n  // your code here\n}",
        "py": "def possible_bipartition(n, dislikes):\n    pass",
        "testCases": [
          { "input": "4\n[[1,2],[1,3],[2,4]]", "expectedOutput": "true" },
          { "input": "3\n[[1,2],[1,3],[2,3]]", "expectedOutput": "false" },
          { "input": "5\n[[1,2],[2,3],[3,4],[4,5],[1,5]]", "expectedOutput": "false", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Flower Planting With No Adjacent",
        "slug": "flower-planting-no-adjacent",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given n gardens and paths between them, assign flower type 1-4 to each garden so no two adjacent gardens have same flower. Return any valid assignment.",
        "examples": [
          { "input": "n=3,paths=[[1,2],[2,3],[3,1]]", "output": "[1,2,3]" },
          { "input": "n=4,paths=[[1,2],[3,4]]", "output": "[1,2,1,2]" },
          { "input": "n=4,paths=[[1,2],[2,3],[3,4],[4,1],[1,3],[2,4]]", "output": "[1,2,3,4]" }
        ],
        "constraints": ["1<=n<=10^4", "0<=paths.length<=2*10^4", "max degree 3"],
        "hints": [
          "Greedy: for each garden assign smallest flower type not used by neighbors",
          "With max degree 3 and 4 colors, always possible"
        ],
        "tags": ["graph", "greedy"],
        "js": "function gardenNoAdj(n, paths) {\n  // your code here\n}",
        "py": "def garden_no_adj(n, paths):\n    pass",
        "testCases": [
          { "input": "3\n[[1,2],[2,3],[3,1]]", "expectedOutput": "[1,2,3]" },
          { "input": "4\n[[1,2],[3,4]]", "expectedOutput": "[1,2,1,2]" },
          { "input": "4\n[[1,2],[2,3],[3,4],[4,1],[1,3],[2,4]]", "expectedOutput": "[1,2,3,4]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Satisfiability of Equality Equations",
        "slug": "satisfiability-equality-equations",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given equations like a==b or a!=b, return true if all can be satisfied simultaneously.",
        "examples": [
          { "input": "equations=[a==b,b!=a]", "output": "false" },
          { "input": "equations=[b==a,a==b]", "output": "true" },
          { "input": "equations=[a==b,b==c,a==c]", "output": "true" }
        ],
        "constraints": ["1<=equations.length<=500"],
        "hints": [
          "DSU: union all == pairs; then check != pairs",
          "If a!=b but find(a)==find(b): return false"
        ],
        "tags": ["graph", "union-find", "string"],
        "js": "function equationsPossible(equations) {\n  // your code here\n}",
        "py": "def equations_possible(equations):\n    pass",
        "testCases": [
          { "input": "[\"a==b\",\"b!=a\"]", "expectedOutput": "false" },
          { "input": "[\"b==a\",\"a==b\"]", "expectedOutput": "true" },
          { "input": "[\"a==b\",\"b==c\",\"a==c\"]", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 85,
    "topic": "Advanced DP: Digit DP",
    "lesson": "Digit DP: count numbers in [1,N] satisfying some property. State: (position, tight, leading_zero, accumulated_value). 'Tight' means digits so far match N's prefix — limits current digit choice. Build digit by digit from MSB. Template: dp(pos, tight, ...) with memoization. Use for: count numbers with digit sum S, no repeated digits, divisible by k, etc.",
    "problems": [
      {
        "title": "Count Numbers with Unique Digits",
        "slug": "count-numbers-unique-digits",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Count numbers with unique digits in range [0, 10^n).",
        "examples": [
          { "input": "n=2", "output": "91" },
          { "input": "n=0", "output": "1" }
        ],
        "constraints": ["0<=n<=8"],
        "hints": [
          "For k-digit numbers: first digit 9 choices, second 9, third 8...",
          "Sum over all lengths 1 to n"
        ],
        "tags": ["dynamic-programming", "math", "backtracking"],
        "js": "function countNumbersWithUniqueDigits(n) {\n  // your code here\n}",
        "py": "def count_numbers_with_unique_digits(n):\n    pass",
        "testCases": [
          { "input": "2", "expectedOutput": "91" },
          { "input": "0", "expectedOutput": "1" },
          { "input": "3", "expectedOutput": "739", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Numbers At Most N Given Digit Set",
        "slug": "numbers-at-most-n-digit-set",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Given sorted digit set D and integer n, return count of positive integers using only digits in D that are at most n.",
        "examples": [
          { "input": "digits=[1,3,5,7],n=100", "output": "20" },
          { "input": "digits=[1,4,9],n=1000000000", "output": "29523" },
          { "input": "digits=[7],n=8", "output": "1" }
        ],
        "constraints": ["1<=digits.length<=9", "digits sorted, no duplicates", "1<=n<=10^9"],
        "hints": [
          "Count numbers with fewer digits than n (all combinations) plus count same-length numbers",
          "For same-length: digit DP — tight constraint limits choices"
        ],
        "tags": ["dynamic-programming", "math"],
        "js": "function atMostNGivenDigitSet(digits, n) {\n  // your code here\n}",
        "py": "def at_most_n_given_digit_set(digits, n):\n    pass",
        "testCases": [
          { "input": "[\"1\",\"3\",\"5\",\"7\"]\n100", "expectedOutput": "20" },
          { "input": "[\"1\",\"4\",\"9\"]\n1000000000", "expectedOutput": "29523" },
          { "input": "[\"7\"]\n8", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Non-negative Integers without Consecutive Ones",
        "slug": "non-negative-integers-no-consecutive-ones",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Count non-negative integers <= n whose binary representation has no two consecutive 1s.",
        "examples": [
          { "input": "n=5", "output": "5" },
          { "input": "n=1", "output": "2" },
          { "input": "n=2", "output": "3" }
        ],
        "constraints": ["1<=n<=10^9"],
        "hints": [
          "Digit DP on binary representation of n",
          "State: (bit position, tight, last_bit); count valid numbers"
        ],
        "tags": ["dynamic-programming", "bit-manipulation"],
        "js": "function findIntegers(n) {\n  // your code here\n}",
        "py": "def find_integers(n):\n    pass",
        "testCases": [
          { "input": "5", "expectedOutput": "5" },
          { "input": "1", "expectedOutput": "2" },
          { "input": "2", "expectedOutput": "3", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Digit Count in Range",
        "slug": "digit-count-in-range",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Count occurrences of digit d in all numbers from low to high inclusive.",
        "examples": [
          { "input": "d=1,low=1,high=13", "output": "6" },
          { "input": "d=3,low=100,high=250", "output": "35" }
        ],
        "constraints": ["0<=d<=9", "1<=low<=high<=2*10^8"],
        "hints": [
          "f(n) = count of d in [1,n]; answer = f(high) - f(low-1)",
          "Digit DP or mathematical formula counting d at each position"
        ],
        "tags": ["dynamic-programming", "math"],
        "js": "function digitsCount(d, low, high) {\n  // your code here\n}",
        "py": "def digits_count(d, low, high):\n    pass",
        "testCases": [
          { "input": "1\n1\n13", "expectedOutput": "6" },
          { "input": "3\n100\n250", "expectedOutput": "35" }
        ],
        "xpReward": 130
      },
      {
        "title": "Count Vowels Permutation",
        "slug": "count-vowels-permutation",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Count strings of length n following vowel rules: a->e, e->a/i, i->a/e/o/u, o->i/u, u->a. Return mod 10^9+7.",
        "examples": [
          { "input": "n=1", "output": "5" },
          { "input": "n=2", "output": "10" },
          { "input": "n=5", "output": "68" }
        ],
        "constraints": ["1<=n<=2*10^4"],
        "hints": [
          "dp[vowel] = count of valid strings ending with vowel",
          "Reverse transitions: for each vowel count how many can precede it"
        ],
        "tags": ["dynamic-programming", "math"],
        "js": "function countVowelPermutation(n) {\n  // your code here\n}",
        "py": "def count_vowel_permutation(n):\n    pass",
        "testCases": [
          { "input": "1", "expectedOutput": "5" },
          { "input": "2", "expectedOutput": "10" },
          { "input": "5", "expectedOutput": "68", "isHidden": true }
        ],
        "xpReward": 110
      }
    ]
  },
  {
    "dayNumber": 86,
    "topic": "Trie: Advanced Applications",
    "lesson": "Trie power-ups: compressed trie (Patricia/Radix tree) saves memory. Suffix trie: all suffixes for substring search. Aho-Corasick: trie + failure links for multi-pattern search O(n+m+z). XOR trie for maximum/minimum XOR queries. Lazy deletion in trie. For autocomplete: store top-k suggestions at each node. For spell check: BFS/DFS within edit distance.",
    "problems": [
      {
        "title": "Implement Magic Dictionary",
        "slug": "implement-magic-dictionary",
        "difficulty": "medium",
        "category": "trie",
        "description": "Design MagicDictionary with buildDict and search. search returns true if word exists with exactly one character changed.",
        "examples": [
          { "input": "buildDict([hello,leetcode]),search(hello)->false,search(hhllo)->true,search(hell)->false,search(leetcoded)->false", "output": "see description" }
        ],
        "constraints": ["1<=words.length<=100", "1<=word.length<=100"],
        "hints": [
          "For each search word: try replacing each char with a-z; check if result in dict",
          "Or trie with wildcard DFS allowing exactly one mismatch"
        ],
        "tags": ["trie", "hash-table", "string"],
        "js": "class MagicDictionary {\n  constructor() {}\n  buildDict(dictionary) {}\n  search(searchWord) {}\n}",
        "py": "class MagicDictionary:\n    def __init__(self):\n        pass\n    def build_dict(self, dictionary):\n        pass\n    def search(self, search_word):\n        pass",
        "testCases": [
          { "input": "buildDict\n[\"hello\",\"leetcode\"]\nsearch\nhello\nsearch\nhhllo\nsearch\nhell\nsearch\nleetcoded", "expectedOutput": "null\nfalse\ntrue\nfalse\nfalse" }
        ],
        "xpReward": 80
      },
      {
        "title": "Map Sum Pairs",
        "slug": "map-sum-pairs",
        "difficulty": "medium",
        "category": "trie",
        "description": "Implement MapSum with insert(key, val) and sum(prefix) returning sum of values for keys with given prefix.",
        "examples": [
          { "input": "insert(apple,3),sum(ap)->3,insert(app,2),sum(ap)->5", "output": "see description" }
        ],
        "constraints": ["1<=key.length<=50", "1<=val<=1000", "At most 50 calls"],
        "hints": [
          "Trie where each node stores sum of values in its subtree",
          "On insert: update all ancestor nodes with delta (new_val - old_val)"
        ],
        "tags": ["trie", "hash-table", "design"],
        "js": "class MapSum {\n  constructor() {}\n  insert(key, val) {}\n  sum(prefix) {}\n}",
        "py": "class MapSum:\n    def __init__(self):\n        pass\n    def insert(self, key, val):\n        pass\n    def sum(self, prefix):\n        pass",
        "testCases": [
          { "input": "insert\napple\n3\nsum\nap\ninsert\napp\n2\nsum\nap", "expectedOutput": "null\n3\nnull\n5" }
        ],
        "xpReward": 80
      },
      {
        "title": "Search Suggestions System",
        "slug": "search-suggestions-system",
        "difficulty": "medium",
        "category": "trie",
        "description": "Given products and a searchWord, return list of up to 3 lexicographically minimum suggestions after each character typed.",
        "examples": [
          { "input": "products=[mobile,mouse,moneypot,monitor,mousepad],searchWord=mouse", "output": "[[mobile,moneypot,monitor],[mobile,moneypot,monitor],[mouse,mousepad],[mouse,mousepad],[mouse,mousepad]]" },
          { "input": "products=[havana],searchWord=havana", "output": "[[havana],[havana],[havana],[havana],[havana],[havana]]" }
        ],
        "constraints": ["1<=products.length<=1000", "1<=searchWord.length<=1000"],
        "hints": [
          "Sort products; binary search for each prefix, take up to 3 from that position",
          "Or trie with sorted children; DFS to find 3 suggestions per prefix"
        ],
        "tags": ["trie", "binary-search", "string"],
        "js": "function suggestedProducts(products, searchWord) {\n  // your code here\n}",
        "py": "def suggested_products(products, search_word):\n    pass",
        "testCases": [
          { "input": "[\"mobile\",\"mouse\",\"moneypot\",\"monitor\",\"mousepad\"]\nmouse", "expectedOutput": "[[\"mobile\",\"moneypot\",\"monitor\"],[\"mobile\",\"moneypot\",\"monitor\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"]]" },
          { "input": "[\"havana\"]\nhavana", "expectedOutput": "[[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"]]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Stream of Characters",
        "slug": "stream-of-characters",
        "difficulty": "hard",
        "category": "trie",
        "description": "Query a stream of characters. After each character, return true if any suffix of the stream matches a word in the dictionary.",
        "examples": [
          { "input": "StreamChecker([cd,f,kl]),query(a)->false,query(b)->false,query(c)->false,query(d)->true,query(e)->false,query(f)->true", "output": "see description" }
        ],
        "constraints": ["1<=words.length<=2000", "1<=words[i].length<=2000", "At most 4*10^4 queries"],
        "hints": [
          "Reverse trie: insert reversed words; query reversed stream suffix",
          "Maintain current positions in trie as stream comes in"
        ],
        "tags": ["trie", "string", "design"],
        "js": "class StreamChecker {\n  constructor(words) {}\n  query(letter) {}\n}",
        "py": "class StreamChecker:\n    def __init__(self, words):\n        pass\n    def query(self, letter):\n        pass",
        "testCases": [
          { "input": "StreamChecker\n[\"cd\",\"f\",\"kl\"]\nquery\na\nquery\nb\nquery\nc\nquery\nd\nquery\ne\nquery\nf", "expectedOutput": "null\nfalse\nfalse\nfalse\ntrue\nfalse\ntrue" }
        ],
        "xpReward": 130
      },
      {
        "title": "Palindrome Pairs",
        "slug": "palindrome-pairs",
        "difficulty": "hard",
        "category": "trie",
        "description": "Given list of unique words, return all pairs (i,j) such that words[i]+words[j] is a palindrome.",
        "examples": [
          { "input": "words=[abcd,dcba,lls,s,sssll]", "output": "[[0,1],[1,0],[3,2],[2,4]]" },
          { "input": "words=[bat,tab,cat]", "output": "[[0,1],[1,0]]" }
        ],
        "constraints": ["1<=words.length<=5000", "0<=words[i].length<=300"],
        "hints": [
          "For each word w: check if reverse of any prefix/suffix pair creates palindrome",
          "Use hashmap of word->index for O(1) lookup; check all splits"
        ],
        "tags": ["trie", "hash-table", "string"],
        "js": "function palindromePairs(words) {\n  // your code here\n}",
        "py": "def palindrome_pairs(words):\n    pass",
        "testCases": [
          { "input": "[\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]", "expectedOutput": "[[0,1],[1,0],[3,2],[2,4]]" },
          { "input": "[\"bat\",\"tab\",\"cat\"]", "expectedOutput": "[[0,1],[1,0]]" }
        ],
        "xpReward": 140
      }
    ]
  },
  {
    "dayNumber": 87,
    "topic": "Advanced Array Techniques",
    "lesson": "Advanced array patterns: monotonic deque for range min/max in O(n). Counting sort for bounded values O(n+k). Cyclic sort for arrays with values 1..n: place element at its correct index in O(n). Next permutation: find rightmost descent, swap with next larger, reverse suffix. Majority vote (Boyer-Moore): candidate + count for majority element in O(1) space.",
    "problems": [
      {
        "title": "Next Permutation",
        "slug": "next-permutation",
        "difficulty": "medium",
        "category": "array",
        "description": "Rearrange numbers to next lexicographically greater permutation in-place. If largest, rearrange to smallest.",
        "examples": [
          { "input": "nums=[1,2,3]", "output": "[1,3,2]" },
          { "input": "nums=[3,2,1]", "output": "[1,2,3]" },
          { "input": "nums=[1,1,5]", "output": "[1,5,1]" }
        ],
        "constraints": ["1<=nums.length<=100"],
        "hints": [
          "Find rightmost i where nums[i]<nums[i+1]; find rightmost j>i where nums[j]>nums[i]",
          "Swap i and j; reverse nums[i+1:]"
        ],
        "tags": ["array", "two-pointers"],
        "js": "function nextPermutation(nums) {\n  // modify in-place\n}",
        "py": "def next_permutation(nums):\n    pass",
        "testCases": [
          { "input": "[1,2,3]", "expectedOutput": "[1,3,2]" },
          { "input": "[3,2,1]", "expectedOutput": "[1,2,3]" },
          { "input": "[1,1,5]", "expectedOutput": "[1,5,1]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Find All Numbers Disappeared in an Array",
        "slug": "find-all-disappeared-numbers",
        "difficulty": "easy",
        "category": "array",
        "description": "Given array of n integers in range [1,n] with possible duplicates, find all missing numbers in O(n) time and O(1) extra space.",
        "examples": [
          { "input": "nums=[4,3,2,7,8,2,3,1]", "output": "[5,6]" },
          { "input": "nums=[1,1]", "output": "[2]" }
        ],
        "constraints": ["1<=nums.length<=10^5", "1<=nums[i]<=nums.length"],
        "hints": [
          "Mark visited by negating nums[nums[i]-1]",
          "Positive indices at the end are missing numbers"
        ],
        "tags": ["array", "cyclic-sort"],
        "js": "function findDisappearedNumbers(nums) {\n  // your code here\n}",
        "py": "def find_disappeared_numbers(nums):\n    pass",
        "testCases": [
          { "input": "[4,3,2,7,8,2,3,1]", "expectedOutput": "[5,6]" },
          { "input": "[1,1]", "expectedOutput": "[2]" }
        ],
        "xpReward": 50
      },
      {
        "title": "First Missing Positive",
        "slug": "first-missing-positive",
        "difficulty": "hard",
        "category": "array",
        "description": "Find the smallest missing positive integer in O(n) time and O(1) extra space.",
        "examples": [
          { "input": "nums=[1,2,0]", "output": "3" },
          { "input": "nums=[3,4,-1,1]", "output": "2" },
          { "input": "nums=[7,8,9,11,12]", "output": "1" }
        ],
        "constraints": ["1<=nums.length<=10^5", "-2^31<=nums[i]<=2^31-1"],
        "hints": [
          "Cyclic sort: place nums[i] at index nums[i]-1 if in range [1,n]",
          "First index i where nums[i]!=i+1: answer is i+1"
        ],
        "tags": ["array", "cyclic-sort"],
        "js": "function firstMissingPositive(nums) {\n  // your code here\n}",
        "py": "def first_missing_positive(nums):\n    pass",
        "testCases": [
          { "input": "[1,2,0]", "expectedOutput": "3" },
          { "input": "[3,4,-1,1]", "expectedOutput": "2" },
          { "input": "[7,8,9,11,12]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Majority Element II",
        "slug": "majority-element-ii",
        "difficulty": "medium",
        "category": "array",
        "description": "Find all elements appearing more than n/3 times. Must run in O(n) time and O(1) space.",
        "examples": [
          { "input": "nums=[3,2,3]", "output": "[3]" },
          { "input": "nums=[1]", "output": "[1]" },
          { "input": "nums=[1,2]", "output": "[1,2]" }
        ],
        "constraints": ["1<=nums.length<=5*10^4", "-10^9<=nums[i]<=10^9"],
        "hints": [
          "Boyer-Moore voting with two candidates (at most 2 elements can exceed n/3)",
          "Two passes: find candidates then verify counts"
        ],
        "tags": ["array", "sorting", "counting"],
        "js": "function majorityElement(nums) {\n  // your code here\n}",
        "py": "def majority_element(nums):\n    pass",
        "testCases": [
          { "input": "[3,2,3]", "expectedOutput": "[3]" },
          { "input": "[1]", "expectedOutput": "[1]" },
          { "input": "[1,2]", "expectedOutput": "[1,2]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Shortest Unsorted Continuous Subarray",
        "slug": "shortest-unsorted-continuous-subarray",
        "difficulty": "medium",
        "category": "array",
        "description": "Find the shortest subarray that if sorted makes the whole array sorted. Return its length.",
        "examples": [
          { "input": "nums=[2,6,4,8,10,9,15]", "output": "5" },
          { "input": "nums=[1,2,3,4]", "output": "0" },
          { "input": "nums=[1]", "output": "0" }
        ],
        "constraints": ["1<=nums.length<=10^4", "-10^5<=nums[i]<=10^5"],
        "hints": [
          "Find left boundary: first index where nums[i]>min(nums[i:]) from the right",
          "Find right boundary: first index from right where nums[i]<max(nums[:i+1])"
        ],
        "tags": ["array", "sorting", "stack"],
        "js": "function findUnsortedSubarray(nums) {\n  // your code here\n}",
        "py": "def find_unsorted_subarray(nums):\n    pass",
        "testCases": [
          { "input": "[2,6,4,8,10,9,15]", "expectedOutput": "5" },
          { "input": "[1,2,3,4]", "expectedOutput": "0" },
          { "input": "[1]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 70
      }
    ]
  },
  {
    "dayNumber": 88,
    "topic": "Dynamic Programming: Tree DP",
    "lesson": "Tree DP: define dp state at each node based on subtree info. Common patterns: (1) dp[node][0/1] = answer without/with node selected. (2) dp[node] = some aggregate over children. (3) Re-rooting technique: compute answer for each node as root. Key insight: tree DFS naturally gives bottom-up computation — children computed before parent.",
    "problems": [
      {
        "title": "Binary Tree Cameras",
        "slug": "binary-tree-cameras",
        "difficulty": "hard",
        "category": "tree",
        "description": "Place minimum cameras on tree nodes to monitor all nodes. A camera covers itself, parent, and children.",
        "examples": [
          { "input": "root=[0,0,null,0,0]", "output": "1" },
          { "input": "root=[0,0,null,0,null,0,null,null,0]", "output": "2" }
        ],
        "constraints": ["1<=nodes<=1000"],
        "hints": [
          "Greedy DFS: state 0=not covered, 1=covered no camera, 2=has camera",
          "Greedily place cameras at leaves' parents; post-order traversal"
        ],
        "tags": ["tree", "dynamic-programming", "dfs", "greedy"],
        "js": "function minCameraCover(root) {\n  // your code here\n}",
        "py": "def min_camera_cover(root):\n    pass",
        "testCases": [
          { "input": "[0,0,null,0,0]", "expectedOutput": "1" },
          { "input": "[0,0,null,0,null,0,null,null,0]", "expectedOutput": "2" }
        ],
        "xpReward": 130
      },
      {
        "title": "Count Good Nodes in Binary Tree",
        "slug": "count-good-nodes-binary-tree",
        "difficulty": "medium",
        "category": "tree",
        "description": "A node is good if no node on the path from root to it has a value greater than it. Count good nodes.",
        "examples": [
          { "input": "root=[3,1,4,3,null,1,5]", "output": "4" },
          { "input": "root=[3,3,null,4,2]", "output": "3" },
          { "input": "root=[1]", "output": "1" }
        ],
        "constraints": ["1<=nodes<=10^5", "-10^4<=Node.val<=10^4"],
        "hints": [
          "DFS passing max value seen on path from root",
          "Node is good if node.val >= maxSoFar"
        ],
        "tags": ["tree", "dfs"],
        "js": "function goodNodes(root) {\n  // your code here\n}",
        "py": "def good_nodes(root):\n    pass",
        "testCases": [
          { "input": "[3,1,4,3,null,1,5]", "expectedOutput": "4" },
          { "input": "[3,3,null,4,2]", "expectedOutput": "3" },
          { "input": "[1]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Path Sum III",
        "slug": "path-sum-iii",
        "difficulty": "medium",
        "category": "tree",
        "description": "Count paths in binary tree (downward only, can start/end anywhere) that sum to targetSum.",
        "examples": [
          { "input": "root=[10,5,-3,3,2,null,11,3,-2,null,1],targetSum=8", "output": "3" },
          { "input": "root=[5,4,8,11,null,13,4,7,2,null,null,5,1],targetSum=22", "output": "3" }
        ],
        "constraints": ["0<=nodes<=1000", "-10^9<=Node.val<=10^9", "-1000<=targetSum<=1000"],
        "hints": [
          "DFS with prefix sum hashmap: count paths ending at current node with sum = targetSum",
          "prefixCount[currentSum - targetSum] = number of valid paths ending here"
        ],
        "tags": ["tree", "dfs", "prefix-sum", "hash-table"],
        "js": "function pathSum(root, targetSum) {\n  // your code here\n}",
        "py": "def path_sum(root, target_sum):\n    pass",
        "testCases": [
          { "input": "[10,5,-3,3,2,null,11,3,-2,null,1]\n8", "expectedOutput": "3" },
          { "input": "[5,4,8,11,null,13,4,7,2,null,null,5,1]\n22", "expectedOutput": "3" }
        ],
        "xpReward": 90
      },
      {
        "title": "Diameter of Binary Tree",
        "slug": "diameter-binary-tree",
        "difficulty": "easy",
        "category": "tree",
        "description": "Return the diameter (length of longest path between any two nodes, in edges) of the binary tree.",
        "examples": [
          { "input": "root=[1,2,3,4,5]", "output": "3" },
          { "input": "root=[1,2]", "output": "1" }
        ],
        "constraints": ["1<=nodes<=10^4", "-100<=Node.val<=100"],
        "hints": [
          "For each node: diameter through it = left_depth + right_depth",
          "Return max depth upward; track global max diameter"
        ],
        "tags": ["tree", "dfs"],
        "js": "function diameterOfBinaryTree(root) {\n  // your code here\n}",
        "py": "def diameter_of_binary_tree(root):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4,5]", "expectedOutput": "3" },
          { "input": "[1,2]", "expectedOutput": "1" },
          { "input": "[1]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 50
      },
      {
        "title": "Longest ZigZag Path in a Binary Tree",
        "slug": "longest-zigzag-path-binary-tree",
        "difficulty": "medium",
        "category": "tree",
        "description": "Return the longest zigzag path length in the binary tree (alternating left-right directions).",
        "examples": [
          { "input": "root=[1,null,1,1,1,null,null,1,1,null,1,null,null,null,1]", "output": "3" },
          { "input": "root=[1,1,1,null,1,null,null,1,1,null,1]", "output": "4" },
          { "input": "root=[1]", "output": "0" }
        ],
        "constraints": ["1<=nodes<=5*10^4", "-50<=Node.val<=50"],
        "hints": [
          "DFS with (direction, length): going left resets right count and vice versa",
          "Or dp[node] = (max_zigzag_going_left, max_zigzag_going_right)"
        ],
        "tags": ["tree", "dfs", "dynamic-programming"],
        "js": "function longestZigZag(root) {\n  // your code here\n}",
        "py": "def longest_zig_zag(root):\n    pass",
        "testCases": [
          { "input": "[1,null,1,1,1,null,null,1,1,null,1,null,null,null,1]", "expectedOutput": "3" },
          { "input": "[1,1,1,null,1,null,null,1,1,null,1]", "expectedOutput": "4" },
          { "input": "[1]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 89,
    "topic": "Hard Simulation & Implementation",
    "lesson": "Simulation problems require: careful state management, precise edge case handling, and clean code structure. Break into helper functions. Read constraints carefully — they tell you what optimizations are needed. Simulation often runs in O(n*k) where k is operations per step. For game simulations: represent board as 2D array; for text processing: use index pointers carefully.",
    "problems": [
      {
        "title": "Game of Life",
        "slug": "game-of-life",
        "difficulty": "medium",
        "category": "simulation",
        "description": "Simulate one step of Conway's Game of Life in-place. Use encoded states to avoid extra space.",
        "examples": [
          { "input": "board=[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", "output": "[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]" },
          { "input": "board=[[1,1],[1,0]]", "output": "[[1,1],[1,1]]" }
        ],
        "constraints": ["1<=m,n<=25"],
        "hints": [
          "Encode: 2=was dead becomes alive, -1=was alive becomes dead",
          "Count live neighbors using original values (abs for encoded); then apply rules"
        ],
        "tags": ["simulation", "matrix", "array"],
        "js": "function gameOfLife(board) {\n  // modify in-place\n}",
        "py": "def game_of_life(board):\n    pass",
        "testCases": [
          { "input": "[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", "expectedOutput": "[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]" },
          { "input": "[[1,1],[1,0]]", "expectedOutput": "[[1,1],[1,1]]" }
        ],
        "xpReward": 80
      },
      {
        "title": "Robot Room Cleaner",
        "slug": "robot-room-cleaner",
        "difficulty": "hard",
        "category": "simulation",
        "description": "Given a robot with move(), turnLeft(), turnRight(), clean() APIs, clean the entire room without knowing its layout.",
        "examples": [
          { "input": "room=[[1,1,1,1,1,0,1,1],[1,1,1,1,1,0,1,1],[1,1,1,1,1,1,1,1],[0,0,1,0,0,0,0,0],[1,1,1,1,1,1,1,1]],row=1,col=3", "output": "robot cleans all accessible cells" }
        ],
        "constraints": ["room grid of 0s and 1s", "robot starts on a 1"],
        "hints": [
          "DFS with virtual coordinates; track visited cells",
          "Backtrack: turn 180, move back, turn 180 to restore direction"
        ],
        "tags": ["simulation", "dfs", "backtracking"],
        "js": "function cleanRoom(robot) {\n  // use robot API\n}",
        "py": "def clean_room(robot):\n    pass",
        "testCases": [
          { "input": "[[1,1,1,1,1,0,1,1],[1,1,1,1,1,0,1,1],[1,1,1,1,1,1,1,1],[0,0,1,0,0,0,0,0],[1,1,1,1,1,1,1,1]]\n1\n3", "expectedOutput": "all_cleaned" }
        ],
        "xpReward": 140
      },
      {
        "title": "LRU Cache with Expiry",
        "slug": "lru-cache-expiry",
        "difficulty": "hard",
        "category": "design",
        "description": "Design an LRU cache where entries expire after a TTL. Implement get(key, currentTime) and put(key, value, currentTime, ttl).",
        "examples": [
          { "input": "put(1,10,0,5),get(1,3)->10,get(1,6)->-1,put(2,20,0,10),put(1,30,7,3),get(1,9)->30,get(1,11)->-1", "output": "see description" }
        ],
        "constraints": ["1<=capacity<=100", "0<=ttl<=10^9"],
        "hints": [
          "Extend LRU: each entry stores (value, expiry_time = insertTime + ttl)",
          "On get: check if expired; on put: evict expired first, then LRU if still over capacity"
        ],
        "tags": ["design", "hash-table", "linked-list"],
        "js": "class LRUCacheWithExpiry {\n  constructor(capacity) {}\n  get(key, currentTime) {}\n  put(key, value, currentTime, ttl) {}\n}",
        "py": "class LRUCacheWithExpiry:\n    def __init__(self, capacity):\n        pass\n    def get(self, key, current_time):\n        pass\n    def put(self, key, value, current_time, ttl):\n        pass",
        "testCases": [
          { "input": "LRUCacheWithExpiry\n2\nput\n1\n10\n0\n5\nget\n1\n3\nget\n1\n6\nput\n2\n20\n0\n10\nput\n1\n30\n7\n3\nget\n1\n9\nget\n1\n11", "expectedOutput": "null\nnull\n10\n-1\nnull\nnull\n30\n-1" }
        ],
        "xpReward": 150
      },
      {
        "title": "Sparse Matrix Multiplication",
        "slug": "sparse-matrix-multiplication",
        "difficulty": "medium",
        "category": "simulation",
        "description": "Multiply two sparse matrices efficiently. Do not compute multiplications involving zeros.",
        "examples": [
          { "input": "mat1=[[1,0,0],[-1,0,3]],mat2=[[7,0,0],[0,0,0],[0,0,1]]", "output": "[[7,0,0],[-7,0,3]]" },
          { "input": "mat1=[[0]],mat2=[[0]]", "output": "[[0]]" }
        ],
        "constraints": ["1<=m,k,n<=100", "sparse: most values are 0"],
        "hints": [
          "For each non-zero in mat1[i][k]: only compute mat1[i][k]*mat2[k][j] for non-zero mat2[k][j]",
          "Precompute non-zero positions in each row of mat1 and column of mat2"
        ],
        "tags": ["simulation", "matrix", "array"],
        "js": "function multiply(mat1, mat2) {\n  // your code here\n}",
        "py": "def multiply(mat1, mat2):\n    pass",
        "testCases": [
          { "input": "[[1,0,0],[-1,0,3]]\n[[7,0,0],[0,0,0],[0,0,1]]", "expectedOutput": "[[7,0,0],[-7,0,3]]" },
          { "input": "[[0]]\n[[0]]", "expectedOutput": "[[0]]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Text Justification",
        "slug": "text-justification",
        "difficulty": "hard",
        "category": "simulation",
        "description": "Format text so each line is exactly maxWidth characters with as many words as possible. Extra spaces distributed evenly (left-heavy if uneven). Last line left-justified.",
        "examples": [
          { "input": "words=[This,is,an,example,of,text,justification.],maxWidth=16", "output": "[This    is    an,example  of text,justification.  ]" },
          { "input": "words=[What,must,be,acknowledgment,shall,be],maxWidth=16", "output": "[What   must  be,acknowledgment ,shall be        ]" }
        ],
        "constraints": ["1<=words.length<=300", "1<=maxWidth<=100"],
        "hints": [
          "Greedily fit words per line; then distribute spaces",
          "Spaces = (maxWidth - total_chars) / (words-1) slots; extra go left first"
        ],
        "tags": ["simulation", "string", "array"],
        "js": "function fullJustify(words, maxWidth) {\n  // your code here\n}",
        "py": "def full_justify(words, max_width):\n    pass",
        "testCases": [
          { "input": "[\"This\",\"is\",\"an\",\"example\",\"of\",\"text\",\"justification.\"]\n16", "expectedOutput": "[\"This    is    an\",\"example  of text\",\"justification.  \"]" },
          { "input": "[\"What\",\"must\",\"be\",\"acknowledgment\",\"shall\",\"be\"]\n16", "expectedOutput": "[\"What   must   be\",\"acknowledgment  \",\"shall be        \"]" }
        ],
        "xpReward": 130
      }
    ]
  },
  {
    "dayNumber": 90,
    "topic": "Ultimate Challenge: Multi-Pattern Problems",
    "lesson": "Day 90 represents mastery level. These problems require fluidly switching between multiple algorithmic paradigms within a single solution. The hallmark of an expert engineer is pattern recognition speed and composition fluency. When stuck: (1) What is the bottleneck? (2) What data structure fixes it? (3) Can I decompose into known subproblems? (4) Is there a mathematical insight I'm missing?",
    "problems": [
      {
        "title": "Design Search Autocomplete System",
        "slug": "design-search-autocomplete-system",
        "difficulty": "hard",
        "category": "design",
        "description": "Design autocomplete with input(c) returning top 3 hot sentences by frequency (then lexicographic). '#' finalizes a sentence.",
        "examples": [
          { "input": "AutocompleteSystem([i love you,island,iroman,i love leetcode],[5,3,2,2]),input(i)->[i love you,island,i love leetcode],input( )->[i love you,i love leetcode],input(a)->[],input(#)->[]", "output": "see description" }
        ],
        "constraints": ["1<=sentences.length<=100", "1<=times[i]<=50", "At most 5000 input calls"],
        "hints": [
          "Trie with frequency map at each node; on '#' increment and reset",
          "At each node store top-3 as list for O(1) retrieval (update on insert)"
        ],
        "tags": ["design", "trie", "hash-table", "heap", "string"],
        "js": "class AutocompleteSystem {\n  constructor(sentences, times) {}\n  input(c) {}\n}",
        "py": "class AutocompleteSystem:\n    def __init__(self, sentences, times):\n        pass\n    def input(self, c):\n        pass",
        "testCases": [
          { "input": "AutocompleteSystem\n[\"i love you\",\"island\",\"iroman\",\"i love leetcode\"]\n[5,3,2,2]\ninput\ni\ninput\n \ninput\na\ninput\n#", "expectedOutput": "null\n[\"i love you\",\"island\",\"i love leetcode\"]\n[\"i love you\",\"i love leetcode\"]\n[]\n[]" }
        ],
        "xpReward": 150
      },
      {
        "title": "Minimum Number of Refueling Stops",
        "slug": "minimum-refueling-stops",
        "difficulty": "hard",
        "category": "heap",
        "description": "Car starts at 0 with startFuel, target distance. Stations give fuel. Return minimum stops to reach target, or -1.",
        "examples": [
          { "input": "target=1,startFuel=1,stations=[]", "output": "0" },
          { "input": "target=100,startFuel=1,stations=[[10,60],[20,30],[30,30],[60,40]]", "output": "2" }
        ],
        "constraints": ["1<=target,startFuel<=10^9", "0<=stations.length<=500"],
        "hints": [
          "Greedy with max-heap: drive as far as possible; when stuck refuel with largest available station",
          "Push passed station fuels to max-heap; pop when tank empty"
        ],
        "tags": ["heap", "greedy", "dynamic-programming"],
        "js": "function minRefuelStops(target, startFuel, stations) {\n  // your code here\n}",
        "py": "def min_refuel_stops(target, start_fuel, stations):\n    pass",
        "testCases": [
          { "input": "1\n1\n[]", "expectedOutput": "0" },
          { "input": "100\n1\n[[10,60],[20,30],[30,30],[60,40]]", "expectedOutput": "2" },
          { "input": "100\n10\n[[10,60]]", "expectedOutput": "-1", "isHidden": true }
        ],
        "xpReward": 140
      },
      {
        "title": "Largest Rectangle in Histogram (Segment Tree)",
        "slug": "largest-rectangle-histogram-segtree",
        "difficulty": "hard",
        "category": "segment-tree",
        "description": "Find largest rectangle in histogram using segment tree for range minimum queries. Return the area.",
        "examples": [
          { "input": "heights=[2,1,5,6,2,3]", "output": "10" },
          { "input": "heights=[2,4]", "output": "4" },
          { "input": "heights=[6,2,5,4,5,1,6]", "output": "12" }
        ],
        "constraints": ["1<=heights.length<=10^5", "0<=heights[i]<=10^4"],
        "hints": [
          "Divide and conquer: find min height in range; area = min*width or recurse on left/right of min",
          "Segment tree for O(log n) range minimum queries making total O(n log n)"
        ],
        "tags": ["segment-tree", "divide-and-conquer", "monotonic-stack"],
        "js": "function largestRectangleArea(heights) {\n  // your code here\n}",
        "py": "def largest_rectangle_area(heights):\n    pass",
        "testCases": [
          { "input": "[2,1,5,6,2,3]", "expectedOutput": "10" },
          { "input": "[2,4]", "expectedOutput": "4" },
          { "input": "[6,2,5,4,5,1,6]", "expectedOutput": "12", "isHidden": true }
        ],
        "xpReward": 150
      },
      {
        "title": "K-th Smallest in Lexicographical Order",
        "slug": "k-th-smallest-lexicographical-order",
        "difficulty": "hard",
        "category": "trie",
        "description": "Given integers n and k, return the kth lexicographically smallest integer in range [1,n].",
        "examples": [
          { "input": "n=13,k=2", "output": "10" },
          { "input": "n=1,k=1", "output": "1" }
        ],
        "constraints": ["1<=k<=n<=10^9"],
        "hints": [
          "Conceptual trie of numbers; count nodes in subtree rooted at prefix",
          "countSteps(n,cur,cur+1): numbers in [cur,cur+1) that are <=n; walk left or go deeper"
        ],
        "tags": ["trie", "math"],
        "js": "function findKthNumber(n, k) {\n  // your code here\n}",
        "py": "def find_kth_number(n, k):\n    pass",
        "testCases": [
          { "input": "13\n2", "expectedOutput": "10" },
          { "input": "1\n1", "expectedOutput": "1" },
          { "input": "100\n10", "expectedOutput": "17", "isHidden": true }
        ],
        "xpReward": 150
      },
      {
        "title": "Minimum Cost to Cut a Stick",
        "slug": "minimum-cost-cut-stick",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Cut a stick of length n at given positions. Cost of each cut = length of stick being cut. Return minimum total cost.",
        "examples": [
          { "input": "n=7,cuts=[1,3,4,5]", "output": "16" },
          { "input": "n=9,cuts=[5,6,1,4,2]", "output": "22" }
        ],
        "constraints": ["2<=n<=10^6", "1<=cuts.length<=min(n-1,100)"],
        "hints": [
          "Add 0 and n to cuts; sort; interval DP on cuts array",
          "dp[i][j] = min cost to make all cuts between cuts[i] and cuts[j]; cost = cuts[j]-cuts[i]"
        ],
        "tags": ["dynamic-programming", "array"],
        "js": "function minCost(n, cuts) {\n  // your code here\n}",
        "py": "def min_cost(n, cuts):\n    pass",
        "testCases": [
          { "input": "7\n[1,3,4,5]", "expectedOutput": "16" },
          { "input": "9\n[5,6,1,4,2]", "expectedOutput": "22" }
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
    return NextResponse.json({ success: true, message: `Days 81-90 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}