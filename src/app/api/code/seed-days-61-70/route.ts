// src/app/api/code/seed-days-61-70/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 61,
    "topic": "Greedy Algorithms: Classic Patterns",
    "lesson": "Greedy works when local optimal = global optimal. Prove it with exchange argument: assume an optimal solution differs from greedy, show swapping to greedy doesn't worsen it. Common patterns: activity selection (sort by end time), fractional knapsack (sort by value/weight), Huffman coding (min-heap), jump game (track max reachable). Always ask: 'Can a locally bad choice ever lead to globally better outcome?'",
    "problems": [
      {
        "title": "Jump Game",
        "slug": "jump-game",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Given array of jump lengths, return true if you can reach the last index from index 0.",
        "examples": [
          { "input": "nums=[2,3,1,1,4]", "output": "true" },
          { "input": "nums=[3,2,1,0,4]", "output": "false" }
        ],
        "constraints": ["1<=nums.length<=10^4", "0<=nums[i]<=10^5"],
        "hints": [
          "Track max reachable index; if i > maxReach at any point, return false",
          "Update maxReach = max(maxReach, i + nums[i])"
        ],
        "tags": ["greedy", "array", "dynamic-programming"],
        "js": "function canJump(nums) {\n  // your code here\n}",
        "py": "def can_jump(nums):\n    pass",
        "testCases": [
          { "input": "[2,3,1,1,4]", "expectedOutput": "true" },
          { "input": "[3,2,1,0,4]", "expectedOutput": "false" },
          { "input": "[0]", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Jump Game II",
        "slug": "jump-game-ii",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Return minimum number of jumps to reach the last index. You can always reach the last index.",
        "examples": [
          { "input": "nums=[2,3,1,1,4]", "output": "2" },
          { "input": "nums=[2,3,0,1,4]", "output": "2" }
        ],
        "constraints": ["1<=nums.length<=10^4", "0<=nums[i]<=1000"],
        "hints": [
          "Track current jump end and next jump end (farthest reachable from current window)",
          "When i reaches current end: increment jumps, set current end = next end"
        ],
        "tags": ["greedy", "array", "dynamic-programming"],
        "js": "function jump(nums) {\n  // your code here\n}",
        "py": "def jump(nums):\n    pass",
        "testCases": [
          { "input": "[2,3,1,1,4]", "expectedOutput": "2" },
          { "input": "[2,3,0,1,4]", "expectedOutput": "2" },
          { "input": "[1,2,1,1,1]", "expectedOutput": "3", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Gas Station",
        "slug": "gas-station",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Given gas and cost arrays for a circular route, return starting index to complete the circuit or -1.",
        "examples": [
          { "input": "gas=[1,2,3,4,5],cost=[3,4,5,1,2]", "output": "3" },
          { "input": "gas=[2,3,4],cost=[3,4,3]", "output": "-1" }
        ],
        "constraints": ["1<=n<=10^5", "0<=gas[i],cost[i]<=10^4"],
        "hints": [
          "If total gas >= total cost, a solution exists",
          "If tank goes negative, current start cannot work; try next station as new start"
        ],
        "tags": ["greedy", "array"],
        "js": "function canCompleteCircuit(gas, cost) {\n  // your code here\n}",
        "py": "def can_complete_circuit(gas, cost):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4,5]\n[3,4,5,1,2]", "expectedOutput": "3" },
          { "input": "[2,3,4]\n[3,4,3]", "expectedOutput": "-1" }
        ],
        "xpReward": 80
      },
      {
        "title": "Candy",
        "slug": "candy",
        "difficulty": "hard",
        "category": "greedy",
        "description": "Distribute candies to children in a line: each gets at least 1, higher rating than neighbor gets more. Return minimum total candies.",
        "examples": [
          { "input": "ratings=[1,0,2]", "output": "5" },
          { "input": "ratings=[1,2,2]", "output": "4" }
        ],
        "constraints": ["1<=n<=2*10^4", "0<=ratings[i]<=2*10^4"],
        "hints": [
          "Two passes: left-to-right (ensure left neighbor constraint), right-to-left (ensure right neighbor constraint)",
          "Answer = max of both pass values for each child"
        ],
        "tags": ["greedy", "array"],
        "js": "function candy(ratings) {\n  // your code here\n}",
        "py": "def candy(ratings):\n    pass",
        "testCases": [
          { "input": "[1,0,2]", "expectedOutput": "5" },
          { "input": "[1,2,2]", "expectedOutput": "4" },
          { "input": "[1,3,2,2,1]", "expectedOutput": "7", "isHidden": true }
        ],
        "xpReward": 110
      },
      {
        "title": "Minimum Number of Arrows to Burst Balloons",
        "slug": "minimum-arrows-burst-balloons",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Balloons on x-axis with intervals [xstart,xend]. Arrow shot at x bursts all balloons covering x. Return minimum arrows needed.",
        "examples": [
          { "input": "points=[[10,16],[2,8],[1,6],[7,12]]", "output": "2" },
          { "input": "points=[[1,2],[3,4],[5,6],[7,8]]", "output": "4" },
          { "input": "points=[[1,2],[2,3],[3,4],[4,5]]", "output": "2" }
        ],
        "constraints": ["1<=points.length<=10^5"],
        "hints": [
          "Sort by end coordinate; shoot arrow at first balloon end",
          "Skip all balloons covering that x; next arrow at next uncovered balloon end"
        ],
        "tags": ["greedy", "intervals", "sorting"],
        "js": "function findMinArrowShots(points) {\n  // your code here\n}",
        "py": "def find_min_arrow_shots(points):\n    pass",
        "testCases": [
          { "input": "[[10,16],[2,8],[1,6],[7,12]]", "expectedOutput": "2" },
          { "input": "[[1,2],[3,4],[5,6],[7,8]]", "expectedOutput": "4" },
          { "input": "[[1,2],[2,3],[3,4],[4,5]]", "expectedOutput": "2", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 62,
    "topic": "Matrix Problems",
    "lesson": "Matrix traversal patterns: BFS from multiple sources simultaneously (multi-source BFS). DFS with visited set for connected components. For 'distance to nearest X': multi-source BFS from all X simultaneously. Spiral order: track boundaries. Rotate matrix 90 degrees: transpose then reverse each row. Search in sorted matrix: treat as 1D or use staircase search from top-right.",
    "problems": [
      {
        "title": "Spiral Matrix",
        "slug": "spiral-matrix",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Return all elements of a matrix in spiral order.",
        "examples": [
          { "input": "matrix=[[1,2,3],[4,5,6],[7,8,9]]", "output": "[1,2,3,6,9,8,7,4,5]" },
          { "input": "matrix=[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", "output": "[1,2,3,4,8,12,11,10,9,5,6,7]" }
        ],
        "constraints": ["1<=m,n<=10"],
        "hints": [
          "Four boundaries: top, bottom, left, right; shrink after each traversal",
          "Right -> Down -> Left -> Up, repeat"
        ],
        "tags": ["matrix", "array", "simulation"],
        "js": "function spiralOrder(matrix) {\n  // your code here\n}",
        "py": "def spiral_order(matrix):\n    pass",
        "testCases": [
          { "input": "[[1,2,3],[4,5,6],[7,8,9]]", "expectedOutput": "[1,2,3,6,9,8,7,4,5]" },
          { "input": "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", "expectedOutput": "[1,2,3,4,8,12,11,10,9,5,6,7]" }
        ],
        "xpReward": 70
      },
      {
        "title": "Rotate Image",
        "slug": "rotate-image",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Rotate an n x n matrix 90 degrees clockwise in-place.",
        "examples": [
          { "input": "matrix=[[1,2,3],[4,5,6],[7,8,9]]", "output": "[[7,4,1],[8,5,2],[9,6,3]]" },
          { "input": "matrix=[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", "output": "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" }
        ],
        "constraints": ["1<=n<=20"],
        "hints": [
          "Transpose: swap matrix[i][j] and matrix[j][i]",
          "Then reverse each row"
        ],
        "tags": ["matrix", "array", "math"],
        "js": "function rotate(matrix) {\n  // modify in-place\n}",
        "py": "def rotate(matrix):\n    pass",
        "testCases": [
          { "input": "[[1,2,3],[4,5,6],[7,8,9]]", "expectedOutput": "[[7,4,1],[8,5,2],[9,6,3]]" },
          { "input": "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", "expectedOutput": "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" }
        ],
        "xpReward": 70
      },
      {
        "title": "01 Matrix",
        "slug": "01-matrix",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Given binary matrix, return matrix where each cell equals distance to nearest 0.",
        "examples": [
          { "input": "mat=[[0,0,0],[0,1,0],[0,0,0]]", "output": "[[0,0,0],[0,1,0],[0,0,0]]" },
          { "input": "mat=[[0,0,0],[0,1,0],[1,1,1]]", "output": "[[0,0,0],[0,1,0],[1,2,1]]" }
        ],
        "constraints": ["1<=m,n<=10^4", "m*n<=10^4"],
        "hints": [
          "Multi-source BFS: start from all 0 cells simultaneously",
          "Initialize dist=0 for 0-cells, infinity for 1-cells; BFS fills distances"
        ],
        "tags": ["matrix", "bfs", "dynamic-programming"],
        "js": "function updateMatrix(mat) {\n  // your code here\n}",
        "py": "def update_matrix(mat):\n    pass",
        "testCases": [
          { "input": "[[0,0,0],[0,1,0],[0,0,0]]", "expectedOutput": "[[0,0,0],[0,1,0],[0,0,0]]" },
          { "input": "[[0,0,0],[0,1,0],[1,1,1]]", "expectedOutput": "[[0,0,0],[0,1,0],[1,2,1]]" }
        ],
        "xpReward": 80
      },
      {
        "title": "Search a 2D Matrix II",
        "slug": "search-2d-matrix-ii",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Search for target in matrix where each row and column is sorted ascending. O(m+n) solution.",
        "examples": [
          { "input": "matrix=[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]],target=5", "output": "true" },
          { "input": "matrix=[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]],target=20", "output": "false" }
        ],
        "constraints": ["1<=m,n<=300"],
        "hints": [
          "Start top-right: if target < current move left; if target > current move down",
          "This eliminates a row or column at each step"
        ],
        "tags": ["matrix", "binary-search", "divide-and-conquer"],
        "js": "function searchMatrix(matrix, target) {\n  // your code here\n}",
        "py": "def search_matrix(matrix, target):\n    pass",
        "testCases": [
          { "input": "[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]]\n5", "expectedOutput": "true" },
          { "input": "[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]]\n20", "expectedOutput": "false" }
        ],
        "xpReward": 80
      },
      {
        "title": "Pacific Atlantic Water Flow",
        "slug": "pacific-atlantic-water-flow",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Return all cells where water can flow to both Pacific (top/left border) and Atlantic (bottom/right border) oceans.",
        "examples": [
          { "input": "heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", "output": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" },
          { "input": "heights=[[1]]", "output": "[[0,0]]" }
        ],
        "constraints": ["1<=m,n<=200"],
        "hints": [
          "Reverse BFS/DFS from ocean borders, marking reachable cells (water flows uphill in reverse)",
          "Answer = intersection of Pacific-reachable and Atlantic-reachable sets"
        ],
        "tags": ["matrix", "bfs", "dfs"],
        "js": "function pacificAtlantic(heights) {\n  // your code here\n}",
        "py": "def pacific_atlantic(heights):\n    pass",
        "testCases": [
          { "input": "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", "expectedOutput": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" },
          { "input": "[[1]]", "expectedOutput": "[[0,0]]" }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 63,
    "topic": "Advanced Backtracking",
    "lesson": "Backtracking = DFS + undo. Template: choose, explore, unchoose. Pruning is key: stop early when constraints violated. For permutations: swap in-place. For subsets: include/exclude each element. For combinations: pass start index to avoid duplicates. For N-queens/Sudoku: check validity before recursing. Time complexity often O(n!) or O(2^n) but pruning makes it practical.",
    "problems": [
      {
        "title": "N-Queens",
        "slug": "n-queens",
        "difficulty": "hard",
        "category": "backtracking",
        "description": "Return all distinct solutions to the n-queens puzzle.",
        "examples": [
          { "input": "n=4", "output": "2" },
          { "input": "n=1", "output": "1" }
        ],
        "constraints": ["1<=n<=9"],
        "hints": [
          "Place one queen per row; track occupied cols, diagonals (r-c), anti-diagonals (r+c)",
          "Backtrack when no valid column for current row"
        ],
        "tags": ["backtracking", "array"],
        "js": "function solveNQueens(n) {\n  // your code here\n}",
        "py": "def solve_n_queens(n):\n    pass",
        "testCases": [
          { "input": "4", "expectedOutput": "2" },
          { "input": "1", "expectedOutput": "1" },
          { "input": "8", "expectedOutput": "92", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Sudoku Solver",
        "slug": "sudoku-solver",
        "difficulty": "hard",
        "category": "backtracking",
        "description": "Solve a Sudoku puzzle by filling empty cells. The given puzzle has exactly one solution.",
        "examples": [
          { "input": "board=[[5,3,.,.,7,.,.,.,.],[6,.,.,1,9,5,.,.,.],[.,9,8,.,.,.,.,6,.],[8,.,.,.,6,.,.,.,3],[4,.,.,8,.,3,.,.,1],[7,.,.,.,2,.,.,.,6],[.,6,.,.,.,.,2,8,.],[.,.,.,4,1,9,.,.,5],[.,.,.,.,8,.,.,7,9]]", "output": "solved board" }
        ],
        "constraints": ["board is 9x9", "digits 1-9 and '.'"],
        "hints": [
          "For each empty cell, try 1-9; check row, col, and 3x3 box constraints",
          "If no digit works backtrack; if all filled return true"
        ],
        "tags": ["backtracking", "matrix"],
        "js": "function solveSudoku(board) {\n  // modify board in-place\n}",
        "py": "def solve_sudoku(board):\n    pass",
        "testCases": [
          { "input": "[[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]", "expectedOutput": "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]" }
        ],
        "xpReward": 150
      },
      {
        "title": "Expression Add Operators",
        "slug": "expression-add-operators",
        "difficulty": "hard",
        "category": "backtracking",
        "description": "Given string num and target, return all expressions inserting +, -, * between digits that evaluate to target.",
        "examples": [
          { "input": "num=123,target=6", "output": "[1+2+3,1*2*3]" },
          { "input": "num=232,target=8", "output": "[2+3*2,2*3+2]" },
          { "input": "num=3456237490,target=9191", "output": "[]" }
        ],
        "constraints": ["1<=num.length<=10", "-2^31<=target<=2^31-1"],
        "hints": [
          "Track current eval and last multiplied term (for * undo: eval - lastMul + lastMul*cur)",
          "Skip numbers with leading zeros"
        ],
        "tags": ["backtracking", "math", "string"],
        "js": "function addOperators(num, target) {\n  // your code here\n}",
        "py": "def add_operators(num, target):\n    pass",
        "testCases": [
          { "input": "123\n6", "expectedOutput": "[\"1*2*3\",\"1+2+3\"]" },
          { "input": "232\n8", "expectedOutput": "[\"2*3+2\",\"2+3*2\"]" },
          { "input": "3456237490\n9191", "expectedOutput": "[]", "isHidden": true }
        ],
        "xpReward": 140
      },
      {
        "title": "Palindrome Partitioning",
        "slug": "palindrome-partitioning",
        "difficulty": "medium",
        "category": "backtracking",
        "description": "Return all ways to partition string s such that every substring is a palindrome.",
        "examples": [
          { "input": "s=aab", "output": "[[a,a,b],[aa,b]]" },
          { "input": "s=a", "output": "[[a]]" }
        ],
        "constraints": ["1<=s.length<=16"],
        "hints": [
          "Backtrack: for each starting index, extend substring until palindrome found",
          "Precompute palindrome DP table for O(1) palindrome checks"
        ],
        "tags": ["backtracking", "dynamic-programming", "string"],
        "js": "function partition(s) {\n  // your code here\n}",
        "py": "def partition(s):\n    pass",
        "testCases": [
          { "input": "aab", "expectedOutput": "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]" },
          { "input": "a", "expectedOutput": "[[\"a\"]]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Word Break II",
        "slug": "word-break-ii",
        "difficulty": "hard",
        "category": "backtracking",
        "description": "Given string s and word dictionary, return all sentences that segment s into valid dictionary words.",
        "examples": [
          { "input": "s=catsanddog,wordDict=[cat,cats,and,sand,dog]", "output": "[cats and dog,cat sand dog]" },
          { "input": "s=pineapplepenapple,wordDict=[apple,pen,applepen,pine,pineapple]", "output": "[pine apple pen apple,pineapple pen apple,pine applepen apple]" }
        ],
        "constraints": ["1<=s.length<=20", "1<=wordDict.length<=1000"],
        "hints": [
          "Memoized backtracking: memo[i] = list of sentences for s[i:]",
          "For each word matching s[i:i+len], recurse on s[i+len:]"
        ],
        "tags": ["backtracking", "dynamic-programming", "trie", "string"],
        "js": "function wordBreak(s, wordDict) {\n  // your code here\n}",
        "py": "def word_break(s, word_dict):\n    pass",
        "testCases": [
          { "input": "catsanddog\n[\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]", "expectedOutput": "[\"cat sand dog\",\"cats and dog\"]" },
          { "input": "pineapplepenapple\n[\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]", "expectedOutput": "[\"pine apple pen apple\",\"pine applepen apple\",\"pineapple pen apple\"]" }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 64,
    "topic": "Linked List: Advanced Operations",
    "lesson": "Linked list tricks: dummy head node simplifies edge cases. Fast/slow pointer for cycle detection, finding middle, kth from end. Reversing: three pointers (prev, cur, next). For merging: use dummy head. Intersection: advance longer list by difference first. For deep copy with random pointers: two-pass with HashMap or weave copy nodes between originals.",
    "problems": [
      {
        "title": "Reverse Nodes in k-Group",
        "slug": "reverse-nodes-k-group",
        "difficulty": "hard",
        "category": "linked-list",
        "description": "Reverse every k nodes of a linked list. If remaining nodes < k, leave them as is.",
        "examples": [
          { "input": "head=[1,2,3,4,5],k=2", "output": "[2,1,4,3,5]" },
          { "input": "head=[1,2,3,4,5],k=3", "output": "[3,2,1,4,5]" }
        ],
        "constraints": ["1<=k<=n<=5000"],
        "hints": [
          "Check if k nodes remain; if not, return head as-is",
          "Reverse k nodes, connect to result of recursive call on rest"
        ],
        "tags": ["linked-list", "recursion"],
        "js": "function reverseKGroup(head, k) {\n  // your code here\n}",
        "py": "def reverse_k_group(head, k):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4,5]\n2", "expectedOutput": "[2,1,4,3,5]" },
          { "input": "[1,2,3,4,5]\n3", "expectedOutput": "[3,2,1,4,5]" },
          { "input": "[1,2,3,4,5]\n1", "expectedOutput": "[1,2,3,4,5]", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Copy List with Random Pointer",
        "slug": "copy-list-random-pointer",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Deep copy a linked list where each node has next and random pointer.",
        "examples": [
          { "input": "head=[[7,null],[13,0],[11,4],[10,2],[1,0]]", "output": "[[7,null],[13,0],[11,4],[10,2],[1,0]]" }
        ],
        "constraints": ["0<=n<=1000", "-10^4<=Node.val<=10^4"],
        "hints": [
          "HashMap: original node -> copy node",
          "Two passes: first create all copies, then set next and random pointers"
        ],
        "tags": ["linked-list", "hash-table"],
        "js": "function copyRandomList(head) {\n  // your code here\n}",
        "py": "def copy_random_list(head):\n    pass",
        "testCases": [
          { "input": "[[7,null],[13,0],[11,4],[10,2],[1,0]]", "expectedOutput": "[[7,null],[13,0],[11,4],[10,2],[1,0]]" },
          { "input": "[[1,1],[2,1]]", "expectedOutput": "[[1,1],[2,1]]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Flatten a Multilevel Doubly Linked List",
        "slug": "flatten-multilevel-doubly-linked-list",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Flatten a multilevel doubly linked list where nodes may have a child list. Flatten in-place in DFS order.",
        "examples": [
          { "input": "head=[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]", "output": "[1,2,3,7,8,11,12,9,10,4,5,6]" }
        ],
        "constraints": ["0<=nodes<=1000"],
        "hints": [
          "When encountering a child: find child tail, connect child list in between",
          "Or use stack: push next before processing child"
        ],
        "tags": ["linked-list", "dfs", "stack"],
        "js": "function flatten(head) {\n  // your code here\n}",
        "py": "def flatten(head):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]", "expectedOutput": "[1,2,3,7,8,11,12,9,10,4,5,6]" }
        ],
        "xpReward": 100
      },
      {
        "title": "Sort List",
        "slug": "sort-list",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Sort a linked list in O(n log n) time and O(1) space using bottom-up merge sort.",
        "examples": [
          { "input": "head=[4,2,1,3]", "output": "[1,2,3,4]" },
          { "input": "head=[-1,5,3,4,0]", "output": "[-1,0,3,4,5]" }
        ],
        "constraints": ["0<=n<=5*10^4", "-10^5<=Node.val<=10^5"],
        "hints": [
          "Find middle with slow/fast pointers, split, recursively sort, merge",
          "Bottom-up: merge lists of size 1, then 2, then 4 for O(1) space"
        ],
        "tags": ["linked-list", "divide-and-conquer", "sorting"],
        "js": "function sortList(head) {\n  // your code here\n}",
        "py": "def sort_list(head):\n    pass",
        "testCases": [
          { "input": "[4,2,1,3]", "expectedOutput": "[1,2,3,4]" },
          { "input": "[-1,5,3,4,0]", "expectedOutput": "[-1,0,3,4,5]" },
          { "input": "[]", "expectedOutput": "[]", "isHidden": true }
        ],
        "xpReward": 100
      },
      {
        "title": "Linked List Cycle II",
        "slug": "linked-list-cycle-ii",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Return the node where the cycle begins, or null if no cycle.",
        "examples": [
          { "input": "head=[3,2,0,-4],pos=1", "output": "2" },
          { "input": "head=[1,2],pos=0", "output": "1" },
          { "input": "head=[1],pos=-1", "output": "null" }
        ],
        "constraints": ["0<=n<=10^4"],
        "hints": [
          "Fast/slow pointers meet inside cycle; then reset one pointer to head",
          "Both advance at speed 1; they meet at cycle entry"
        ],
        "tags": ["linked-list", "two-pointers"],
        "js": "function detectCycle(head) {\n  // your code here\n}",
        "py": "def detect_cycle(head):\n    pass",
        "testCases": [
          { "input": "[3,2,0,-4]\n1", "expectedOutput": "2" },
          { "input": "[1,2]\n0", "expectedOutput": "1" },
          { "input": "[1]\n-1", "expectedOutput": "null", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 65,
    "topic": "Stack & Queue: Advanced Applications",
    "lesson": "Advanced stack patterns: expression evaluation, next greater/smaller element, largest rectangle. Monotonic queue for sliding window max/min in O(n). Stack for iterative DFS. Queue for BFS. Deque covers both. Key: what ordering invariant does your stack/queue maintain? Descending stack tracks next greater. Ascending tracks previous greater.",
    "problems": [
      {
        "title": "Basic Calculator",
        "slug": "basic-calculator",
        "difficulty": "hard",
        "category": "stack",
        "description": "Evaluate string expression with +, -, and parentheses. No multiplication or division.",
        "examples": [
          { "input": "s=1+1", "output": "2" },
          { "input": "s= 2-1 + 2 ", "output": "3" },
          { "input": "s=(1+(4+5+2)-3)+(6+8)", "output": "23" }
        ],
        "constraints": ["1<=s.length<=3*10^6"],
        "hints": [
          "Stack stores (result, sign) when entering parentheses",
          "On ')': pop, result = popped_result + popped_sign * current_result"
        ],
        "tags": ["stack", "math", "string"],
        "js": "function calculate(s) {\n  // your code here\n}",
        "py": "def calculate(s):\n    pass",
        "testCases": [
          { "input": "1+1", "expectedOutput": "2" },
          { "input": " 2-1 + 2 ", "expectedOutput": "3" },
          { "input": "(1+(4+5+2)-3)+(6+8)", "expectedOutput": "23", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Asteroid Collision",
        "slug": "asteroid-collision",
        "difficulty": "medium",
        "category": "stack",
        "description": "Asteroids: positive moves right, negative moves left. Same-direction never collide. On collision smaller explodes; equal both explode. Return state after all collisions.",
        "examples": [
          { "input": "asteroids=[5,10,-5]", "output": "[5,10]" },
          { "input": "asteroids=[8,-8]", "output": "[]" },
          { "input": "asteroids=[10,2,-5]", "output": "[10]" }
        ],
        "constraints": ["2<=asteroids.length<=10^4", "-1000<=asteroids[i]<=1000", "asteroids[i]!=0"],
        "hints": [
          "Stack of surviving asteroids",
          "New asteroid collides only if negative and stack top is positive"
        ],
        "tags": ["stack", "array", "simulation"],
        "js": "function asteroidCollision(asteroids) {\n  // your code here\n}",
        "py": "def asteroid_collision(asteroids):\n    pass",
        "testCases": [
          { "input": "[5,10,-5]", "expectedOutput": "[5,10]" },
          { "input": "[8,-8]", "expectedOutput": "[]" },
          { "input": "[10,2,-5]", "expectedOutput": "[10]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "132 Pattern",
        "slug": "132-pattern",
        "difficulty": "medium",
        "category": "stack",
        "description": "Return true if there exist indices i<j<k such that nums[i] < nums[k] < nums[j].",
        "examples": [
          { "input": "nums=[1,2,3,4]", "output": "false" },
          { "input": "nums=[3,1,4,2]", "output": "true" },
          { "input": "nums=[-1,3,2,0]", "output": "true" }
        ],
        "constraints": ["1<=nums.length<=2*10^5", "-10^9<=nums[i]<=10^9"],
        "hints": [
          "Process right to left with monotonic decreasing stack",
          "Track third = largest value popped when pushing; if nums[i] < third, found pattern"
        ],
        "tags": ["stack", "array"],
        "js": "function find132pattern(nums) {\n  // your code here\n}",
        "py": "def find_132_pattern(nums):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4]", "expectedOutput": "false" },
          { "input": "[3,1,4,2]", "expectedOutput": "true" },
          { "input": "[-1,3,2,0]", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Remove K Digits",
        "slug": "remove-k-digits",
        "difficulty": "medium",
        "category": "stack",
        "description": "Remove k digits from number string to make the smallest possible number. Return result without leading zeros.",
        "examples": [
          { "input": "num=1432219,k=3", "output": "1219" },
          { "input": "num=10200,k=1", "output": "200" },
          { "input": "num=10,k=2", "output": "0" }
        ],
        "constraints": ["1<=num.length<=10^5", "0<=k<=num.length"],
        "hints": [
          "Monotonic increasing stack: pop when top > current digit and k > 0",
          "After loop if k > 0 pop from end; strip leading zeros"
        ],
        "tags": ["stack", "greedy", "string"],
        "js": "function removeKdigits(num, k) {\n  // your code here\n}",
        "py": "def remove_kdigits(num, k):\n    pass",
        "testCases": [
          { "input": "1432219\n3", "expectedOutput": "1219" },
          { "input": "10200\n1", "expectedOutput": "200" },
          { "input": "10\n2", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Longest Valid Parentheses",
        "slug": "longest-valid-parentheses",
        "difficulty": "hard",
        "category": "stack",
        "description": "Return the length of the longest valid (well-formed) parentheses substring.",
        "examples": [
          { "input": "s=(((", "output": "0" },
          { "input": "s=)()())", "output": "4" },
          { "input": "s=", "output": "0" }
        ],
        "constraints": ["0<=s.length<=3*10^4"],
        "hints": [
          "Stack storing indices; push -1 as base",
          "On '(': push index; on ')': pop, if stack empty push current index as new base, else length = i - stack.top"
        ],
        "tags": ["stack", "string", "dynamic-programming"],
        "js": "function longestValidParentheses(s) {\n  // your code here\n}",
        "py": "def longest_valid_parentheses(s):\n    pass",
        "testCases": [
          { "input": "(((", "expectedOutput": "0" },
          { "input": ")()())", "expectedOutput": "4" },
          { "input": "", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 66,
    "topic": "Two Pointers & Sliding Window: Advanced",
    "lesson": "Sliding window template: expand right pointer, shrink left when constraint violated. For 'at most k distinct': track frequency map. For 'minimum window': expand until satisfied, shrink to minimize. Two pointers on sorted array: sum problems. Key insight: window always moves forward so total pointer movement is O(n).",
    "problems": [
      {
        "title": "Minimum Window Substring",
        "slug": "minimum-window-substring",
        "difficulty": "hard",
        "category": "sliding-window",
        "description": "Return smallest substring of s containing all characters of t including duplicates.",
        "examples": [
          { "input": "s=ADOBECODEBANC,t=ABC", "output": "BANC" },
          { "input": "s=a,t=a", "output": "a" },
          { "input": "s=a,t=aa", "output": "" }
        ],
        "constraints": ["1<=s.length<=10^5", "1<=t.length<=10^5"],
        "hints": [
          "Frequency map of t; track formed count when freq matches",
          "Expand right until window valid; shrink left to minimize"
        ],
        "tags": ["sliding-window", "hash-table", "string", "two-pointers"],
        "js": "function minWindow(s, t) {\n  // your code here\n}",
        "py": "def min_window(s, t):\n    pass",
        "testCases": [
          { "input": "ADOBECODEBANC\nABC", "expectedOutput": "BANC" },
          { "input": "a\na", "expectedOutput": "a" },
          { "input": "a\naa", "expectedOutput": "", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Longest Substring with At Most K Distinct Characters",
        "slug": "longest-substring-k-distinct",
        "difficulty": "medium",
        "category": "sliding-window",
        "description": "Return length of longest substring with at most k distinct characters.",
        "examples": [
          { "input": "s=eceba,k=2", "output": "3" },
          { "input": "s=aa,k=1", "output": "2" }
        ],
        "constraints": ["1<=s.length<=5*10^4", "0<=k<=50"],
        "hints": [
          "Sliding window with frequency map",
          "When distinct chars > k: shrink left until exactly k distinct"
        ],
        "tags": ["sliding-window", "hash-table", "string"],
        "js": "function lengthOfLongestSubstringKDistinct(s, k) {\n  // your code here\n}",
        "py": "def length_of_longest_substring_k_distinct(s, k):\n    pass",
        "testCases": [
          { "input": "eceba\n2", "expectedOutput": "3" },
          { "input": "aa\n1", "expectedOutput": "2" },
          { "input": "a\n0", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Subarrays with K Different Integers",
        "slug": "subarrays-k-different-integers",
        "difficulty": "hard",
        "category": "sliding-window",
        "description": "Return the number of subarrays with exactly k different integers. Solve in O(n).",
        "examples": [
          { "input": "nums=[1,2,1,2,3],k=2", "output": "7" },
          { "input": "nums=[1,2,1,3,4],k=3", "output": "3" }
        ],
        "constraints": ["1<=nums.length<=2*10^4", "1<=nums[i]<=nums.length", "1<=k<=nums.length"],
        "hints": [
          "exactly(k) = atMost(k) - atMost(k-1)",
          "atMost(k): standard sliding window counting subarrays with at most k distinct"
        ],
        "tags": ["sliding-window", "hash-table", "array"],
        "js": "function subarraysWithKDistinct(nums, k) {\n  // your code here\n}",
        "py": "def subarrays_with_k_distinct(nums, k):\n    pass",
        "testCases": [
          { "input": "[1,2,1,2,3]\n2", "expectedOutput": "7" },
          { "input": "[1,2,1,3,4]\n3", "expectedOutput": "3" }
        ],
        "xpReward": 110
      },
      {
        "title": "Maximum Points You Can Obtain from Cards",
        "slug": "maximum-points-cards",
        "difficulty": "medium",
        "category": "sliding-window",
        "description": "Pick exactly k cards from front or back of array to maximize sum.",
        "examples": [
          { "input": "cardPoints=[1,2,3,4,5,6,1],k=3", "output": "12" },
          { "input": "cardPoints=[2,2,2],k=2", "output": "4" },
          { "input": "cardPoints=[9,7,7,9,7,7,9],k=7", "output": "55" }
        ],
        "constraints": ["1<=cardPoints.length<=10^5", "1<=k<=cardPoints.length"],
        "hints": [
          "Equivalent: find minimum sum subarray of length n-k",
          "Or: sliding window of size k over circular boundary"
        ],
        "tags": ["sliding-window", "array", "prefix-sum"],
        "js": "function maxScore(cardPoints, k) {\n  // your code here\n}",
        "py": "def max_score(card_points, k):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4,5,6,1]\n3", "expectedOutput": "12" },
          { "input": "[2,2,2]\n2", "expectedOutput": "4" },
          { "input": "[9,7,7,9,7,7,9]\n7", "expectedOutput": "55", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Count Number of Nice Subarrays",
        "slug": "count-nice-subarrays",
        "difficulty": "medium",
        "category": "sliding-window",
        "description": "Return number of subarrays with exactly k odd numbers.",
        "examples": [
          { "input": "nums=[1,1,2,1,1],k=3", "output": "2" },
          { "input": "nums=[2,4,6],k=1", "output": "0" },
          { "input": "nums=[2,2,2,1,2,2,1,2,2,2],k=2", "output": "16" }
        ],
        "constraints": ["1<=nums.length<=50000", "1<=k<=nums.length"],
        "hints": [
          "exactly(k) = atMost(k) - atMost(k-1)",
          "Or prefix sum of odd counts; prefix[j]-prefix[i]=k counts subarrays"
        ],
        "tags": ["sliding-window", "prefix-sum", "array"],
        "js": "function numberOfSubarrays(nums, k) {\n  // your code here\n}",
        "py": "def number_of_subarrays(nums, k):\n    pass",
        "testCases": [
          { "input": "[1,1,2,1,1]\n3", "expectedOutput": "2" },
          { "input": "[2,4,6]\n1", "expectedOutput": "0" },
          { "input": "[2,2,2,1,2,2,1,2,2,2]\n2", "expectedOutput": "16", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 67,
    "topic": "Binary Search: Advanced Applications",
    "lesson": "Binary search beyond sorted arrays: apply on answer space. Minimum maximum or Maximum minimum -> binary search on answer, check feasibility with greedy. Template: lo=min_possible, hi=max_possible; while lo<hi: mid=(lo+hi)/2; if feasible(mid): hi=mid else lo=mid+1. For rotated arrays: determine which half is sorted. Always think: can I binary search on the answer?",
    "problems": [
      {
        "title": "Find Minimum in Rotated Sorted Array II",
        "slug": "find-minimum-rotated-sorted-array-ii",
        "difficulty": "hard",
        "category": "binary-search",
        "description": "Find minimum in rotated sorted array that may contain duplicates.",
        "examples": [
          { "input": "nums=[1,3,5]", "output": "1" },
          { "input": "nums=[2,2,2,0,1]", "output": "0" }
        ],
        "constraints": ["1<=nums.length<=5000", "-5000<=nums[i]<=5000"],
        "hints": [
          "When nums[mid]==nums[hi]: cannot determine which side; decrement hi",
          "Otherwise same as version I: compare mid with hi to find unsorted half"
        ],
        "tags": ["binary-search", "array"],
        "js": "function findMin(nums) {\n  // your code here\n}",
        "py": "def find_min(nums):\n    pass",
        "testCases": [
          { "input": "[1,3,5]", "expectedOutput": "1" },
          { "input": "[2,2,2,0,1]", "expectedOutput": "0" },
          { "input": "[3,3,1,3]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Split Array Largest Sum",
        "slug": "split-array-largest-sum",
        "difficulty": "hard",
        "category": "binary-search",
        "description": "Split array into k non-empty subarrays to minimize the largest sum among subarrays.",
        "examples": [
          { "input": "nums=[7,2,5,10,8],k=2", "output": "18" },
          { "input": "nums=[1,2,3,4,5],k=2", "output": "9" }
        ],
        "constraints": ["1<=nums.length<=1000", "0<=nums[i]<=10^6", "1<=k<=min(50,nums.length)"],
        "hints": [
          "Binary search on the answer; lo=max(nums), hi=sum(nums)",
          "Feasibility: can we split into at most k subarrays with max sum at most mid?"
        ],
        "tags": ["binary-search", "dynamic-programming", "greedy"],
        "js": "function splitArray(nums, k) {\n  // your code here\n}",
        "py": "def split_array(nums, k):\n    pass",
        "testCases": [
          { "input": "[7,2,5,10,8]\n2", "expectedOutput": "18" },
          { "input": "[1,2,3,4,5]\n2", "expectedOutput": "9" }
        ],
        "xpReward": 120
      },
      {
        "title": "Capacity To Ship Packages Within D Days",
        "slug": "capacity-ship-packages-d-days",
        "difficulty": "medium",
        "category": "binary-search",
        "description": "Find minimum weight capacity of ship to ship all packages within D days (shipped in order).",
        "examples": [
          { "input": "weights=[1,2,3,4,5,6,7,8,9,10],days=5", "output": "15" },
          { "input": "weights=[3,2,2,4,1,4],days=3", "output": "6" },
          { "input": "weights=[1,2,3,1,1],days=4", "output": "3" }
        ],
        "constraints": ["1<=weights.length<=500", "1<=days<=weights.length"],
        "hints": [
          "Binary search: lo=max(weights), hi=sum(weights)",
          "Feasibility: greedily pack each day; count days needed at most D"
        ],
        "tags": ["binary-search", "greedy", "array"],
        "js": "function shipWithinDays(weights, days) {\n  // your code here\n}",
        "py": "def ship_within_days(weights, days):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4,5,6,7,8,9,10]\n5", "expectedOutput": "15" },
          { "input": "[3,2,2,4,1,4]\n3", "expectedOutput": "6" },
          { "input": "[1,2,3,1,1]\n4", "expectedOutput": "3", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Koko Eating Bananas",
        "slug": "koko-eating-bananas",
        "difficulty": "medium",
        "category": "binary-search",
        "description": "Koko eats k bananas per hour. Find minimum k to eat all piles within h hours.",
        "examples": [
          { "input": "piles=[3,6,7,11],h=8", "output": "4" },
          { "input": "piles=[30,11,23,4,20],h=5", "output": "30" },
          { "input": "piles=[30,11,23,4,20],h=6", "output": "23" }
        ],
        "constraints": ["1<=piles.length<=10^4", "1<=h<=10^9", "1<=piles[i]<=10^9"],
        "hints": [
          "Binary search on k: lo=1, hi=max(piles)",
          "Feasibility: sum(ceil(pile/k)) <= h for all piles"
        ],
        "tags": ["binary-search", "array"],
        "js": "function minEatingSpeed(piles, h) {\n  // your code here\n}",
        "py": "def min_eating_speed(piles, h):\n    pass",
        "testCases": [
          { "input": "[3,6,7,11]\n8", "expectedOutput": "4" },
          { "input": "[30,11,23,4,20]\n5", "expectedOutput": "30" },
          { "input": "[30,11,23,4,20]\n6", "expectedOutput": "23", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Find K-th Smallest Pair Distance",
        "slug": "find-k-th-smallest-pair-distance",
        "difficulty": "hard",
        "category": "binary-search",
        "description": "Find the kth smallest distance among all pairs nums[i] and nums[j] where i < j.",
        "examples": [
          { "input": "nums=[1,3,1],k=1", "output": "0" },
          { "input": "nums=[1,1,1],k=2", "output": "0" },
          { "input": "nums=[1,6,1],k=3", "output": "5" }
        ],
        "constraints": ["2<=nums.length<=10^4", "0<=nums[i]<=10^6", "1<=k<=nums.length*(nums.length-1)/2"],
        "hints": [
          "Sort array; binary search on distance d",
          "Count pairs with distance at most d using two pointers on sorted array"
        ],
        "tags": ["binary-search", "two-pointers", "sorting"],
        "js": "function smallestDistancePair(nums, k) {\n  // your code here\n}",
        "py": "def smallest_distance_pair(nums, k):\n    pass",
        "testCases": [
          { "input": "[1,3,1]\n1", "expectedOutput": "0" },
          { "input": "[1,1,1]\n2", "expectedOutput": "0" },
          { "input": "[1,6,1]\n3", "expectedOutput": "5", "isHidden": true }
        ],
        "xpReward": 130
      }
    ]
  },
  {
    "dayNumber": 68,
    "topic": "Prefix Sum & Difference Arrays",
    "lesson": "Prefix sum: pre[i] = sum of arr[0..i-1]. Range sum query O(1): pre[r+1] - pre[l]. 2D prefix sum for rectangle queries. Difference array for range update O(1): diff[l]+=v, diff[r+1]-=v; reconstruct with prefix sum. Subarray sum = target: hashmap of prefix sums. Key: prefix[j] - prefix[i] = subarray sum [i..j-1].",
    "problems": [
      {
        "title": "Subarray Sum Equals K",
        "slug": "subarray-sum-equals-k",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return total number of subarrays whose sum equals k.",
        "examples": [
          { "input": "nums=[1,1,1],k=2", "output": "2" },
          { "input": "nums=[1,2,3],k=3", "output": "2" }
        ],
        "constraints": ["1<=nums.length<=2*10^4", "-1000<=nums[i]<=1000", "-10^7<=k<=10^7"],
        "hints": [
          "Prefix sum map: prefixCount[sum] = number of times this prefix sum appeared",
          "For each i: answer += prefixCount[currentSum - k]"
        ],
        "tags": ["prefix-sum", "hash-table", "array"],
        "js": "function subarraySum(nums, k) {\n  // your code here\n}",
        "py": "def subarray_sum(nums, k):\n    pass",
        "testCases": [
          { "input": "[1,1,1]\n2", "expectedOutput": "2" },
          { "input": "[1,2,3]\n3", "expectedOutput": "2" },
          { "input": "[0,0,0]\n0", "expectedOutput": "6", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Continuous Subarray Sum",
        "slug": "continuous-subarray-sum",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return true if there is a subarray of length at least 2 whose sum is a multiple of k.",
        "examples": [
          { "input": "nums=[23,2,4,6,7],k=6", "output": "true" },
          { "input": "nums=[23,2,6,4,7],k=6", "output": "true" },
          { "input": "nums=[23,2,6,4,7],k=13", "output": "false" }
        ],
        "constraints": ["1<=nums.length<=10^5", "0<=nums[i]<=10^9", "0<=k<=2^31-1"],
        "hints": [
          "Prefix sum mod k; if same remainder seen at i and j with j-i>=2: found",
          "HashMap: remainder -> first index seen; initialize {0: -1}"
        ],
        "tags": ["prefix-sum", "hash-table", "array", "math"],
        "js": "function checkSubarraySum(nums, k) {\n  // your code here\n}",
        "py": "def check_subarray_sum(nums, k):\n    pass",
        "testCases": [
          { "input": "[23,2,4,6,7]\n6", "expectedOutput": "true" },
          { "input": "[23,2,6,4,7]\n6", "expectedOutput": "true" },
          { "input": "[23,2,6,4,7]\n13", "expectedOutput": "false", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Number of Ways to Split Array",
        "slug": "number-of-ways-split-array",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return number of valid splits of array where left sum >= right sum.",
        "examples": [
          { "input": "nums=[10,4,-8,7]", "output": "2" },
          { "input": "nums=[2,3,1,0]", "output": "2" }
        ],
        "constraints": ["2<=nums.length<=10^5", "-10^5<=nums[i]<=10^5"],
        "hints": [
          "Prefix sum for left portion; total minus prefix for right",
          "Count splits where leftSum >= rightSum"
        ],
        "tags": ["prefix-sum", "array"],
        "js": "function waysToSplitArray(nums) {\n  // your code here\n}",
        "py": "def ways_to_split_array(nums):\n    pass",
        "testCases": [
          { "input": "[10,4,-8,7]", "expectedOutput": "2" },
          { "input": "[2,3,1,0]", "expectedOutput": "2" }
        ],
        "xpReward": 70
      },
      {
        "title": "Range Sum Query 2D - Immutable",
        "slug": "range-sum-query-2d-immutable",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Implement NumMatrix with sumRegion(r1,c1,r2,c2) in O(1) after O(mn) preprocessing.",
        "examples": [
          { "input": "NumMatrix([[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]),sumRegion(2,1,4,3)->8", "output": "8" }
        ],
        "constraints": ["1<=m,n<=200", "At most 10^4 calls"],
        "hints": [
          "2D prefix sum: pre[i][j] = sum of rectangle (0,0) to (i-1,j-1)",
          "sumRegion = pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]"
        ],
        "tags": ["prefix-sum", "matrix", "design"],
        "js": "class NumMatrix {\n  constructor(matrix) {}\n  sumRegion(row1, col1, row2, col2) {}\n}",
        "py": "class NumMatrix:\n    def __init__(self, matrix):\n        pass\n    def sum_region(self, row1, col1, row2, col2):\n        pass",
        "testCases": [
          { "input": "NumMatrix\n[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]\nsumRegion\n2\n1\n4\n3\nsumRegion\n1\n1\n2\n2\nsumRegion\n1\n2\n2\n4", "expectedOutput": "null\n8\n11\n12" }
        ],
        "xpReward": 70
      },
      {
        "title": "Product of Array Except Self",
        "slug": "product-of-array-except-self",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return array where answer[i] = product of all elements except nums[i]. O(n) time, no division, O(1) extra space.",
        "examples": [
          { "input": "nums=[1,2,3,4]", "output": "[24,12,8,6]" },
          { "input": "nums=[-1,1,0,-3,3]", "output": "[0,0,9,0,0]" }
        ],
        "constraints": ["2<=nums.length<=10^5", "-30<=nums[i]<=30"],
        "hints": [
          "Left pass: answer[i] = product of all elements to the left",
          "Right pass: multiply answer[i] by running product from the right"
        ],
        "tags": ["prefix-sum", "array"],
        "js": "function productExceptSelf(nums) {\n  // your code here\n}",
        "py": "def product_except_self(nums):\n    pass",
        "testCases": [
          { "input": "[1,2,3,4]", "expectedOutput": "[24,12,8,6]" },
          { "input": "[-1,1,0,-3,3]", "expectedOutput": "[0,0,9,0,0]" }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 69,
    "topic": "Dynamic Programming: Interval & Game Theory",
    "lesson": "Interval DP: dp[i][j] = answer for interval [i,j]. Fill by increasing length. Matrix chain, burst balloons, and stone merging all follow this. Game theory DP: minimax -- current player picks move maximizing their gain over opponent. dp[i][j] = max score advantage current player can achieve from range [i,j]. Key: turn-based problems where both players play optimally.",
    "problems": [
      {
        "title": "Burst Balloons",
        "slug": "burst-balloons",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Burst all balloons for maximum coins. Bursting balloon i gives nums[i-1]*nums[i]*nums[i+1] coins.",
        "examples": [
          { "input": "nums=[3,1,5,8]", "output": "167" },
          { "input": "nums=[1,5]", "output": "10" }
        ],
        "constraints": ["1<=nums.length<=300", "0<=nums[i]<=100"],
        "hints": [
          "Reverse thinking: dp[i][j] = max coins when i and j are the boundaries (not burst)",
          "Try each k as last to burst in (i,j): dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j])"
        ],
        "tags": ["dynamic-programming", "array", "divide-and-conquer"],
        "js": "function maxCoins(nums) {\n  // your code here\n}",
        "py": "def max_coins(nums):\n    pass",
        "testCases": [
          { "input": "[3,1,5,8]", "expectedOutput": "167" },
          { "input": "[1,5]", "expectedOutput": "10" },
          { "input": "[1,2,3]", "expectedOutput": "12", "isHidden": true }
        ],
        "xpReward": 150
      },
      {
        "title": "Strange Printer",
        "slug": "strange-printer",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Printer can print a sequence of same characters each turn. Find minimum turns to print string s.",
        "examples": [
          { "input": "s=aaabbb", "output": "2" },
          { "input": "s=aba", "output": "2" }
        ],
        "constraints": ["1<=s.length<=100"],
        "hints": [
          "Interval DP: dp[i][j] = min turns to print s[i..j]",
          "If s[i]==s[k] for k in (i,j]: dp[i][j] = min(dp[i][j], dp[i+1][k]+dp[k+1][j])"
        ],
        "tags": ["dynamic-programming", "string"],
        "js": "function strangePrinter(s) {\n  // your code here\n}",
        "py": "def strange_printer(s):\n    pass",
        "testCases": [
          { "input": "aaabbb", "expectedOutput": "2" },
          { "input": "aba", "expectedOutput": "2" },
          { "input": "tbgtgb", "expectedOutput": "4", "isHidden": true }
        ],
        "xpReward": 140
      },
      {
        "title": "Stone Game",
        "slug": "stone-game",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Alice and Bob pick from either end of pile row, both play optimally. Return true if Alice always wins.",
        "examples": [
          { "input": "piles=[5,3,4,5]", "output": "true" },
          { "input": "piles=[3,7,2,3]", "output": "true" }
        ],
        "constraints": ["2<=piles.length<=500", "piles.length is even", "sum is odd"],
        "hints": [
          "Alice always wins mathematically but implement DP for full credit",
          "dp[i][j] = max extra score current player achieves over opponent in piles[i..j]"
        ],
        "tags": ["dynamic-programming", "math", "game-theory"],
        "js": "function stoneGame(piles) {\n  // your code here\n}",
        "py": "def stone_game(piles):\n    pass",
        "testCases": [
          { "input": "[5,3,4,5]", "expectedOutput": "true" },
          { "input": "[3,7,2,3]", "expectedOutput": "true" }
        ],
        "xpReward": 80
      },
      {
        "title": "Minimum Cost to Merge Stones",
        "slug": "minimum-cost-merge-stones",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Merge adjacent k piles into one each time. Return minimum total cost (sum of merged piles), or -1 if impossible.",
        "examples": [
          { "input": "stones=[3,2,4,1],k=2", "output": "20" },
          { "input": "stones=[3,2,4,1],k=3", "output": "-1" },
          { "input": "stones=[3,5,1,2,6],k=3", "output": "25" }
        ],
        "constraints": ["1<=stones.length<=30", "2<=k<=30"],
        "hints": [
          "Possible only if (n-1)%(k-1)==0",
          "Interval DP with prefix sums for range cost"
        ],
        "tags": ["dynamic-programming", "prefix-sum", "array"],
        "js": "function mergeStones(stones, k) {\n  // your code here\n}",
        "py": "def merge_stones(stones, k):\n    pass",
        "testCases": [
          { "input": "[3,2,4,1]\n2", "expectedOutput": "20" },
          { "input": "[3,2,4,1]\n3", "expectedOutput": "-1" },
          { "input": "[3,5,1,2,6]\n3", "expectedOutput": "25", "isHidden": true }
        ],
        "xpReward": 150
      },
      {
        "title": "Predict the Winner",
        "slug": "predict-the-winner",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Two players pick numbers from either end. Return true if Player 1 can win or tie with both playing optimally.",
        "examples": [
          { "input": "nums=[1,5,2]", "output": "false" },
          { "input": "nums=[1,5,233,7]", "output": "true" }
        ],
        "constraints": ["1<=nums.length<=20", "0<=nums[i]<=10^7"],
        "hints": [
          "dp[i][j] = max score advantage current player gets over opponent in nums[i..j]",
          "dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])"
        ],
        "tags": ["dynamic-programming", "math", "game-theory"],
        "js": "function predictTheWinner(nums) {\n  // your code here\n}",
        "py": "def predict_the_winner(nums):\n    pass",
        "testCases": [
          { "input": "[1,5,2]", "expectedOutput": "false" },
          { "input": "[1,5,233,7]", "expectedOutput": "true" }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 70,
    "topic": "Grand Finale: Synthesis & FAANG-Level Problems",
    "lesson": "Day 70 is the culmination of everything. These problems each require combining 2-3 techniques. Pattern recognition at this level means seeing a new problem and immediately identifying which patterns combine to solve it. You have built the full toolkit: graphs, DP, trees, heaps, sorting, searching, design. The final skill is composition: recognizing which tools fit together and applying them fluidly.",
    "problems": [
      {
        "title": "Trapping Rain Water II",
        "slug": "trapping-rain-water-ii",
        "difficulty": "hard",
        "category": "heap",
        "description": "Given 3D height matrix, compute how much water can be trapped after raining.",
        "examples": [
          { "input": "heightMap=[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]", "output": "4" },
          { "input": "heightMap=[[3,3,3,3,3],[3,0,0,0,3],[3,0,0,0,3],[3,0,0,0,3],[3,3,3,3,3]]", "output": "10" }
        ],
        "constraints": ["1<=m,n<=200", "0<=heightMap[i][j]<=2*10^4"],
        "hints": [
          "Min-heap of border cells; BFS inward from lowest border",
          "Water at cell = max(0, minBorderHeight - cellHeight); update neighbor heights"
        ],
        "tags": ["heap", "bfs", "matrix"],
        "js": "function trapRainWater(heightMap) {\n  // your code here\n}",
        "py": "def trap_rain_water(height_map):\n    pass",
        "testCases": [
          { "input": "[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]", "expectedOutput": "4" },
          { "input": "[[3,3,3,3,3],[3,0,0,0,3],[3,0,0,0,3],[3,0,0,0,3],[3,3,3,3,3]]", "expectedOutput": "10" }
        ],
        "xpReward": 150
      },
      {
        "title": "Word Ladder II",
        "slug": "word-ladder-ii",
        "difficulty": "hard",
        "category": "graph",
        "description": "Return all shortest transformation sequences from beginWord to endWord, changing one letter at a time using words in wordList.",
        "examples": [
          { "input": "beginWord=hit,endWord=cog,wordList=[hot,dot,dog,lot,log,cog]", "output": "[[hit,hot,dot,dog,cog],[hit,hot,lot,log,cog]]" },
          { "input": "beginWord=hit,endWord=cog,wordList=[hot,dot,dog,lot,log]", "output": "[]" }
        ],
        "constraints": ["1<=beginWord.length<=5", "1<=wordList.length<=500"],
        "hints": [
          "BFS to build layer graph (shortest path length); then DFS to enumerate all paths",
          "Or bidirectional BFS for efficiency"
        ],
        "tags": ["graph", "bfs", "backtracking", "string"],
        "js": "function findLadders(beginWord, endWord, wordList) {\n  // your code here\n}",
        "py": "def find_ladders(begin_word, end_word, word_list):\n    pass",
        "testCases": [
          { "input": "hit\ncog\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", "expectedOutput": "[[\"hit\",\"hot\",\"dot\",\"dog\",\"cog\"],[\"hit\",\"hot\",\"lot\",\"log\",\"cog\"]]" },
          { "input": "hit\ncog\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", "expectedOutput": "[]" }
        ],
        "xpReward": 150
      },
      {
        "title": "Minimum Cost to Hire K Workers",
        "slug": "minimum-cost-hire-k-workers",
        "difficulty": "hard",
        "category": "heap",
        "description": "Hire exactly k workers. Pay group at same wage ratio proportional to quality. Minimize total cost.",
        "examples": [
          { "input": "quality=[10,20,5],wage=[70,50,30],k=2", "output": "105.00000" },
          { "input": "quality=[3,1,10,10,1],wage=[4,8,2,2,7],k=3", "output": "30.66667" }
        ],
        "constraints": ["1<=k<=quality.length<=10^4", "1<=quality[i],wage[i]<=10^4"],
        "hints": [
          "Sort by wage/quality ratio; use max-heap of size k for quality sum",
          "For each worker as captain (highest ratio): total cost = ratio * sum(k smallest qualities)"
        ],
        "tags": ["heap", "greedy", "sorting"],
        "js": "function mincostToHireWorkers(quality, wage, k) {\n  // your code here\n}",
        "py": "def mincost_to_hire_workers(quality, wage, k):\n    pass",
        "testCases": [
          { "input": "[10,20,5]\n[70,50,30]\n2", "expectedOutput": "105.00000" },
          { "input": "[3,1,10,10,1]\n[4,8,2,2,7]\n3", "expectedOutput": "30.66667" }
        ],
        "xpReward": 150
      },
      {
        "title": "Count of Range Sum",
        "slug": "count-of-range-sum",
        "difficulty": "hard",
        "category": "divide-and-conquer",
        "description": "Count number of range sums in [lower, upper]. A range sum is sum(nums[i..j]) for i<=j.",
        "examples": [
          { "input": "nums=[-2,5,-1],lower=-2,upper=2", "output": "3" },
          { "input": "nums=[0],lower=0,upper=0", "output": "1" }
        ],
        "constraints": ["1<=nums.length<=10^5", "-2^31<=nums[i]<=2^31-1", "lower<=upper"],
        "hints": [
          "Prefix sums; count pairs (i,j) with lower <= prefix[j]-prefix[i] <= upper",
          "Merge sort on prefix sums: count valid pairs during merge step"
        ],
        "tags": ["divide-and-conquer", "prefix-sum", "array", "merge-sort"],
        "js": "function countRangeSum(nums, lower, upper) {\n  // your code here\n}",
        "py": "def count_range_sum(nums, lower, upper):\n    pass",
        "testCases": [
          { "input": "[-2,5,-1]\n-2\n2", "expectedOutput": "3" },
          { "input": "[0]\n0\n0", "expectedOutput": "1" }
        ],
        "xpReward": 150
      },
      {
        "title": "Maximum Profit in Job Scheduling",
        "slug": "maximum-profit-job-scheduling",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Schedule non-overlapping jobs for maximum profit. Each job has startTime, endTime, profit.",
        "examples": [
          { "input": "startTime=[1,2,3,3],endTime=[3,4,5,6],profit=[50,10,40,70]", "output": "120" },
          { "input": "startTime=[1,2,3,4,6],endTime=[3,5,10,6,9],profit=[20,20,100,200,19]", "output": "200" },
          { "input": "startTime=[1,1,1],endTime=[2,3,4],profit=[5,6,4]", "output": "6" }
        ],
        "constraints": ["1<=startTime.length<=5*10^4"],
        "hints": [
          "Sort by endTime; dp[i] = max profit considering first i jobs",
          "For each job: binary search for last non-overlapping job; dp[i] = max(dp[i-1], profit + dp[last])"
        ],
        "tags": ["dynamic-programming", "binary-search", "sorting", "intervals"],
        "js": "function jobScheduling(startTime, endTime, profit) {\n  // your code here\n}",
        "py": "def job_scheduling(start_time, end_time, profit):\n    pass",
        "testCases": [
          { "input": "[1,2,3,3]\n[3,4,5,6]\n[50,10,40,70]", "expectedOutput": "120" },
          { "input": "[1,2,3,4,6]\n[3,5,10,6,9]\n[20,20,100,200,19]", "expectedOutput": "200" },
          { "input": "[1,1,1]\n[2,3,4]\n[5,6,4]", "expectedOutput": "6", "isHidden": true }
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
    return NextResponse.json({ success: true, message: `Days 61-70 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}