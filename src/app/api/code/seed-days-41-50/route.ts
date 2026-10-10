// src/app/api/code/seed-days-41-50/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 41,
    "topic": "Monotonic Stack",
    "lesson": "Monotonic stack maintains elements in increasing or decreasing order. For 'next greater element': iterate left→right, pop when current > top (top found its answer). For 'previous smaller': maintain increasing stack. Spans, histogram, and temperature problems all follow this pattern. Time O(n) — each element pushed/popped once.",
    "problems": [
      {
        "title": "Daily Temperatures",
        "slug": "daily-temperatures",
        "difficulty": "medium",
        "category": "monotonic-stack",
        "description": "Given daily temperatures, return array where answer[i] is days until a warmer temperature. 0 if no warmer day.",
        "examples": [
          { "input": "temperatures=[73,74,75,71,69,72,76,73]", "output": "[1,1,4,2,1,1,0,0]" },
          { "input": "temperatures=[30,40,50,60]", "output": "[1,1,1,0]" },
          { "input": "temperatures=[30,60,90]", "output": "[1,1,0]" }
        ],
        "constraints": ["1<=temperatures.length<=10^5", "30<=temperatures[i]<=100"],
        "hints": [
          "Decreasing monotonic stack storing indices",
          "When current temp > stack top temp: pop, answer[top] = i - top"
        ],
        "tags": ["monotonic-stack", "array", "stack"],
        "js": "function dailyTemperatures(temperatures) {\n  // your code here\n}",
        "py": "def daily_temperatures(temperatures):\n    pass",
        "testCases": [
          { "input": "[73,74,75,71,69,72,76,73]", "expectedOutput": "[1,1,4,2,1,1,0,0]" },
          { "input": "[30,40,50,60]", "expectedOutput": "[1,1,1,0]" },
          { "input": "[30,60,90]", "expectedOutput": "[1,1,0]", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Next Greater Element I",
        "slug": "next-greater-element-i",
        "difficulty": "easy",
        "category": "monotonic-stack",
        "description": "nums1 is subset of nums2. For each element in nums1 find next greater element in nums2. Return -1 if none.",
        "examples": [
          { "input": "nums1=[4,1,2],nums2=[1,3,4,2]", "output": "[-1,3,-1]" },
          { "input": "nums1=[2,4],nums2=[1,2,3,4]", "output": "[3,-1]" }
        ],
        "constraints": ["1<=nums1.length<=nums2.length<=1000", "All elements unique"],
        "hints": [
          "Process nums2 with decreasing stack; store results in hashmap",
          "Lookup each nums1 element in hashmap"
        ],
        "tags": ["monotonic-stack", "array", "hash-table"],
        "js": "function nextGreaterElement(nums1, nums2) {\n  // your code here\n}",
        "py": "def next_greater_element(nums1, nums2):\n    pass",
        "testCases": [
          { "input": "[4,1,2]\n[1,3,4,2]", "expectedOutput": "[-1,3,-1]" },
          { "input": "[2,4]\n[1,2,3,4]", "expectedOutput": "[3,-1]" }
        ],
        "xpReward": 50
      },
      {
        "title": "Largest Rectangle in Histogram",
        "slug": "largest-rectangle-histogram",
        "difficulty": "hard",
        "category": "monotonic-stack",
        "description": "Given heights of bars in histogram of width 1, return the area of the largest rectangle.",
        "examples": [
          { "input": "heights=[2,1,5,6,2,3]", "output": "10" },
          { "input": "heights=[2,4]", "output": "4" }
        ],
        "constraints": ["1<=heights.length<=10^5", "0<=heights[i]<=10^4"],
        "hints": [
          "Increasing monotonic stack storing indices",
          "When popping, width = i - stack[-1] - 1 (or i if stack empty)"
        ],
        "tags": ["monotonic-stack", "array", "stack"],
        "js": "function largestRectangleArea(heights) {\n  // your code here\n}",
        "py": "def largest_rectangle_area(heights):\n    pass",
        "testCases": [
          { "input": "[2,1,5,6,2,3]", "expectedOutput": "10" },
          { "input": "[2,4]", "expectedOutput": "4" },
          { "input": "[1]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Maximal Rectangle",
        "slug": "maximal-rectangle",
        "difficulty": "hard",
        "category": "monotonic-stack",
        "description": "Given a binary matrix of '0's and '1's, find the largest rectangle containing only '1's and return its area.",
        "examples": [
          { "input": "matrix=[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]", "output": "6" },
          { "input": "matrix=[[0]]", "output": "0" },
          { "input": "matrix=[[1]]", "output": "1" }
        ],
        "constraints": ["1<=m,n<=200"],
        "hints": [
          "Build histogram row by row (add to previous if '1', reset to 0 if '0')",
          "Apply largest rectangle in histogram on each row's histogram"
        ],
        "tags": ["monotonic-stack", "matrix", "dynamic-programming"],
        "js": "function maximalRectangle(matrix) {\n  // your code here\n}",
        "py": "def maximal_rectangle(matrix):\n    pass",
        "testCases": [
          { "input": "[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", "expectedOutput": "6" },
          { "input": "[[\"0\"]]", "expectedOutput": "0" },
          { "input": "[[\"1\"]]", "expectedOutput": "1", "isHidden": true }
        ],
        "xpReward": 130
      },
      {
        "title": "Trapping Rain Water",
        "slug": "trapping-rain-water",
        "difficulty": "hard",
        "category": "monotonic-stack",
        "description": "Given elevation map heights, compute how much water can be trapped after raining.",
        "examples": [
          { "input": "height=[0,1,0,2,1,0,1,3,2,1,2,1]", "output": "6" },
          { "input": "height=[4,2,0,3,2,5]", "output": "9" }
        ],
        "constraints": ["1<=height.length<=2*10^4", "0<=height[i]<=10^5"],
        "hints": [
          "Stack approach: when current > top, water trapped above top",
          "Or two-pointer: track leftMax and rightMax"
        ],
        "tags": ["monotonic-stack", "two-pointers", "array"],
        "js": "function trap(height) {\n  // your code here\n}",
        "py": "def trap(height):\n    pass",
        "testCases": [
          { "input": "[0,1,0,2,1,0,1,3,2,1,2,1]", "expectedOutput": "6" },
          { "input": "[4,2,0,3,2,5]", "expectedOutput": "9" }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 42,
    "topic": "Tries (Prefix Trees)",
    "lesson": "Trie node has children[26] and isEnd flag. Insert/search O(m) where m=word length. Prefix search: traverse without requiring isEnd. Use tries when: autocomplete, prefix queries, word search in board, IP routing. Memory-heavy but blazing fast for string queries.",
    "problems": [
      {
        "title": "Implement Trie (Prefix Tree)",
        "slug": "implement-trie",
        "difficulty": "medium",
        "category": "trie",
        "description": "Implement a Trie with insert, search, and startsWith methods.",
        "examples": [
          { "input": "insert(apple), search(apple)->true, search(app)->false, startsWith(app)->true, insert(app), search(app)->true", "output": "see description" }
        ],
        "constraints": ["1<=word.length<=2000", "Only lowercase letters"],
        "hints": [
          "Each node: children Map or array[26], isEnd boolean",
          "startsWith doesn't check isEnd, search does"
        ],
        "tags": ["trie", "string", "design"],
        "js": "class Trie {\n  constructor() {\n    // your code here\n  }\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}",
        "py": "class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word):\n        pass\n    def search(self, word):\n        pass\n    def starts_with(self, prefix):\n        pass",
        "testCases": [
          { "input": "insert\napple\nsearch\napple\nsearch\napp\nstartsWith\napp\ninsert\napp\nsearch\napp", "expectedOutput": "null\nnull\ntrue\nfalse\ntrue\nnull\ntrue" }
        ],
        "xpReward": 80
      },
      {
        "title": "Word Search II",
        "slug": "word-search-ii",
        "difficulty": "hard",
        "category": "trie",
        "description": "Given board and list of words, return all words found in board. Path uses each cell at most once.",
        "examples": [
          { "input": "board=[[o,a,a,n],[e,t,a,e],[i,h,k,r],[i,f,l,v]],words=[oath,pea,eat,rain]", "output": "[eat,oath]" },
          { "input": "board=[[a,b],[c,d]],words=[abcb]", "output": "[]" }
        ],
        "constraints": ["1<=m,n<=12", "1<=word.length<=10", "1<=words.length<=3*10^4"],
        "hints": [
          "Build trie from words; DFS from each board cell",
          "Prune: if no trie path matches current prefix, stop DFS early"
        ],
        "tags": ["trie", "matrix", "backtracking", "dfs"],
        "js": "function findWords(board, words) {\n  // your code here\n}",
        "py": "def find_words(board, words):\n    pass",
        "testCases": [
          { "input": "[[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]]\n[\"oath\",\"pea\",\"eat\",\"rain\"]", "expectedOutput": "[\"eat\",\"oath\"]" },
          { "input": "[[\"a\",\"b\"],[\"c\",\"d\"]]\n[\"abcb\"]", "expectedOutput": "[]" }
        ],
        "xpReward": 140
      },
      {
        "title": "Replace Words",
        "slug": "replace-words",
        "difficulty": "medium",
        "category": "trie",
        "description": "Given dictionary of roots and sentence, replace each word with shortest root that is its prefix. Return modified sentence.",
        "examples": [
          { "input": "dictionary=[cat,bat,rat],sentence=the cattle was rattled by the battery", "output": "the cat was rat by the bat" },
          { "input": "dictionary=[a,b,c],sentence=aadsfasf absbs bbab cadsfafs", "output": "a a b c" }
        ],
        "constraints": ["1<=dictionary.length<=1000", "1<=sentence.split.length<=1000"],
        "hints": [
          "Build trie from dictionary roots",
          "For each word, traverse trie until isEnd (found root) or prefix mismatch"
        ],
        "tags": ["trie", "string", "hash-table"],
        "js": "function replaceWords(dictionary, sentence) {\n  // your code here\n}",
        "py": "def replace_words(dictionary, sentence):\n    pass",
        "testCases": [
          { "input": "[\"cat\",\"bat\",\"rat\"]\nthe cattle was rattled by the battery", "expectedOutput": "the cat was rat by the bat" },
          { "input": "[\"a\",\"b\",\"c\"]\naadsfasf absbs bbab cadsfafs", "expectedOutput": "a a b c" }
        ],
        "xpReward": 80
      },
      {
        "title": "Design Add and Search Words Data Structure",
        "slug": "design-add-search-words",
        "difficulty": "medium",
        "category": "trie",
        "description": "Implement WordDictionary with addWord and search. Search supports '.' matching any letter.",
        "examples": [
          { "input": "addWord(bad),addWord(dad),addWord(mad),search(pad)->false,search(bad)->true,search(.ad)->true,search(b..)->true", "output": "see description" }
        ],
        "constraints": ["1<=word.length<=25", "At most 10^4 calls"],
        "hints": [
          "Trie with DFS for '.' wildcard",
          "At '.', try all 26 children recursively"
        ],
        "tags": ["trie", "string", "design", "dfs"],
        "js": "class WordDictionary {\n  constructor() {}\n  addWord(word) {}\n  search(word) {}\n}",
        "py": "class WordDictionary:\n    def __init__(self):\n        pass\n    def add_word(self, word):\n        pass\n    def search(self, word):\n        pass",
        "testCases": [
          { "input": "addWord\nbad\naddWord\ndad\naddWord\nmad\nsearch\npad\nsearch\nbad\nsearch\n.ad\nsearch\nb..", "expectedOutput": "null\nnull\nnull\nfalse\ntrue\ntrue\ntrue" }
        ],
        "xpReward": 90
      },
      {
        "title": "Maximum XOR of Two Numbers in an Array",
        "slug": "maximum-xor-two-numbers",
        "difficulty": "medium",
        "category": "trie",
        "description": "Given array nums, find the maximum XOR of any two elements. Solve in O(n) time.",
        "examples": [
          { "input": "nums=[3,10,5,25,2,8]", "output": "28" },
          { "input": "nums=[14,70,53,83,49,91,36,80,92,51,66,70]", "output": "127" }
        ],
        "constraints": ["1<=nums.length<=2*10^5", "0<=nums[i]<=2^31-1"],
        "hints": [
          "Binary trie: insert all numbers bit by bit (MSB first)",
          "For each num, greedily take opposite bit at each trie level to maximize XOR"
        ],
        "tags": ["trie", "bit-manipulation", "array"],
        "js": "function findMaximumXOR(nums) {\n  // your code here\n}",
        "py": "def find_maximum_xor(nums):\n    pass",
        "testCases": [
          { "input": "[3,10,5,25,2,8]", "expectedOutput": "28" },
          { "input": "[14,70,53,83,49,91,36,80,92,51,66,70]", "expectedOutput": "127" }
        ],
        "xpReward": 100
      }
    ]
  },
  {
    "dayNumber": 43,
    "topic": "Union-Find (Disjoint Set Union)",
    "lesson": "DSU: parent[] array. find(x) with path compression, union(x,y) by rank. Detects cycles in O(α(n)) ≈ O(1). Key insight: components = n - number_of_unions. Use for: connected components, Kruskal's MST, dynamic connectivity, grouping problems.",
    "problems": [
      {
        "title": "Number of Provinces",
        "slug": "number-of-provinces",
        "difficulty": "medium",
        "category": "union-find",
        "description": "Given n cities and adjacency matrix, return number of provinces (connected components).",
        "examples": [
          { "input": "isConnected=[[1,1,0],[1,1,0],[0,0,1]]", "output": "2" },
          { "input": "isConnected=[[1,0,0],[0,1,0],[0,0,1]]", "output": "3" }
        ],
        "constraints": ["1<=n<=200"],
        "hints": [
          "DSU: initially n components; each union reduces by 1",
          "Or DFS/BFS marking visited cities"
        ],
        "tags": ["union-find", "graph", "dfs"],
        "js": "function findCircleNum(isConnected) {\n  // your code here\n}",
        "py": "def find_circle_num(is_connected):\n    pass",
        "testCases": [
          { "input": "[[1,1,0],[1,1,0],[0,0,1]]", "expectedOutput": "2" },
          { "input": "[[1,0,0],[0,1,0],[0,0,1]]", "expectedOutput": "3" }
        ],
        "xpReward": 70
      },
      {
        "title": "Redundant Connection",
        "slug": "redundant-connection",
        "difficulty": "medium",
        "category": "union-find",
        "description": "Given n nodes and n edges forming a tree with one extra edge, return the redundant edge that can be removed.",
        "examples": [
          { "input": "edges=[[1,2],[1,3],[2,3]]", "output": "[2,3]" },
          { "input": "edges=[[1,2],[2,3],[3,4],[1,4],[1,5]]", "output": "[1,4]" }
        ],
        "constraints": ["1<=n<=1000"],
        "hints": [
          "Process edges in order; union both endpoints",
          "First edge where both endpoints already in same component = redundant"
        ],
        "tags": ["union-find", "graph"],
        "js": "function findRedundantConnection(edges) {\n  // your code here\n}",
        "py": "def find_redundant_connection(edges):\n    pass",
        "testCases": [
          { "input": "[[1,2],[1,3],[2,3]]", "expectedOutput": "[2,3]" },
          { "input": "[[1,2],[2,3],[3,4],[1,4],[1,5]]", "expectedOutput": "[1,4]" }
        ],
        "xpReward": 80
      },
      {
        "title": "Accounts Merge",
        "slug": "accounts-merge",
        "difficulty": "medium",
        "category": "union-find",
        "description": "Given accounts where accounts[i]=[name,email1,...], merge accounts sharing an email. Return merged accounts sorted.",
        "examples": [
          { "input": "accounts=[[John,johnsmith@mail.com,john_newyork@mail.com],[John,johnsmith@mail.com,john00@mail.com],[Mary,mary@mail.com],[John,johnnybravo@mail.com]]", "output": "[[John,john00@mail.com,john_newyork@mail.com,johnsmith@mail.com],[John,johnnybravo@mail.com],[Mary,mary@mail.com]]" }
        ],
        "constraints": ["1<=accounts.length<=1000", "2<=accounts[i].length<=10"],
        "hints": [
          "DSU on emails; map each email to an account representative",
          "Group all emails by their root; sort and prepend name"
        ],
        "tags": ["union-find", "string", "hash-table"],
        "js": "function accountsMerge(accounts) {\n  // your code here\n}",
        "py": "def accounts_merge(accounts):\n    pass",
        "testCases": [
          { "input": "[[\"John\",\"johnsmith@mail.com\",\"john_newyork@mail.com\"],[\"John\",\"johnsmith@mail.com\",\"john00@mail.com\"],[\"Mary\",\"mary@mail.com\"],[\"John\",\"johnnybravo@mail.com\"]]", "expectedOutput": "[[\"John\",\"john00@mail.com\",\"john_newyork@mail.com\",\"johnsmith@mail.com\"],[\"John\",\"johnnybravo@mail.com\"],[\"Mary\",\"mary@mail.com\"]]" }
        ],
        "xpReward": 90
      },
      {
        "title": "Smallest String With Swaps",
        "slug": "smallest-string-with-swaps",
        "difficulty": "medium",
        "category": "union-find",
        "description": "Given string s and pairs of indices you can swap, return lexicographically smallest s after any swaps.",
        "examples": [
          { "input": "s=dcab,pairs=[[0,3],[1,2]]", "output": "bacd" },
          { "input": "s=dcab,pairs=[[0,3],[1,2],[0,2]]", "output": "abcd" }
        ],
        "constraints": ["1<=s.length<=10^5", "0<=pairs.length<=10^5"],
        "hints": [
          "DSU to group connected indices",
          "Within each group, sort characters and assign lexicographically smallest"
        ],
        "tags": ["union-find", "string", "sorting"],
        "js": "function smallestStringWithSwaps(s, pairs) {\n  // your code here\n}",
        "py": "def smallest_string_with_swaps(s, pairs):\n    pass",
        "testCases": [
          { "input": "dcab\n[[0,3],[1,2]]", "expectedOutput": "bacd" },
          { "input": "dcab\n[[0,3],[1,2],[0,2]]", "expectedOutput": "abcd" }
        ],
        "xpReward": 90
      },
      {
        "title": "Number of Islands II",
        "slug": "number-of-islands-ii",
        "difficulty": "hard",
        "category": "union-find",
        "description": "Grid starts all water. Given list of land additions, return number of islands after each addition.",
        "examples": [
          { "input": "m=3,n=3,positions=[[0,0],[0,1],[1,2],[2,1]]", "output": "[1,1,2,3]" }
        ],
        "constraints": ["1<=m,n<=10^4", "1<=positions.length<=10^4"],
        "hints": [
          "DSU on m*n cells; each addition creates island; check 4 neighbors for unions",
          "Track island count: +1 on add, -1 for each distinct neighbor union"
        ],
        "tags": ["union-find", "matrix", "graph"],
        "js": "function numIslands2(m, n, positions) {\n  // your code here\n}",
        "py": "def num_islands2(m, n, positions):\n    pass",
        "testCases": [
          { "input": "3\n3\n[[0,0],[0,1],[1,2],[2,1]]", "expectedOutput": "[1,1,2,3]" }
        ],
        "xpReward": 110
      }
    ]
  },
  {
    "dayNumber": 44,
    "topic": "Segment Trees & Binary Indexed Trees",
    "lesson": "Fenwick (BIT): prefix sum with point update in O(log n). update(i, delta): i += i & (-i). query(i): sum 1..i, i -= i & (-i). Segment tree: range query AND range update in O(log n). Use lazy propagation for range updates. BIT simpler but less powerful.",
    "problems": [
      {
        "title": "Range Sum Query - Mutable",
        "slug": "range-sum-query-mutable",
        "difficulty": "medium",
        "category": "segment-tree",
        "description": "Implement NumArray with update(i, val) and sumRange(left, right) both in O(log n).",
        "examples": [
          { "input": "NumArray([1,3,5]),sumRange(0,2)->9,update(1,2),sumRange(0,2)->8", "output": "see description" }
        ],
        "constraints": ["1<=nums.length<=3*10^4", "At most 3*10^4 calls"],
        "hints": [
          "Fenwick tree: update O(log n), prefix query O(log n)",
          "sumRange(l,r) = query(r+1) - query(l)"
        ],
        "tags": ["segment-tree", "binary-indexed-tree", "design"],
        "js": "class NumArray {\n  constructor(nums) {}\n  update(index, val) {}\n  sumRange(left, right) {}\n}",
        "py": "class NumArray:\n    def __init__(self, nums):\n        pass\n    def update(self, index, val):\n        pass\n    def sum_range(self, left, right):\n        pass",
        "testCases": [
          { "input": "NumArray\n[1,3,5]\nsumRange\n0\n2\nupdate\n1\n2\nsumRange\n0\n2", "expectedOutput": "null\n9\nnull\n8" }
        ],
        "xpReward": 90
      },
      {
        "title": "Count of Smaller Numbers After Self",
        "slug": "count-smaller-numbers-after-self",
        "difficulty": "hard",
        "category": "segment-tree",
        "description": "Given array nums, return counts[i] = number of smaller elements to the right of nums[i].",
        "examples": [
          { "input": "nums=[5,2,6,1]", "output": "[2,1,1,0]" },
          { "input": "nums=[-1]", "output": "[0]" },
          { "input": "nums=[-1,-1]", "output": "[0,0]" }
        ],
        "constraints": ["1<=nums.length<=10^5", "-10^4<=nums[i]<=10^4"],
        "hints": [
          "Process right to left; Fenwick tree on coordinate-compressed values",
          "For each num: query(num-1) gives count of smaller already inserted"
        ],
        "tags": ["segment-tree", "binary-indexed-tree", "merge-sort", "array"],
        "js": "function countSmaller(nums) {\n  // your code here\n}",
        "py": "def count_smaller(nums):\n    pass",
        "testCases": [
          { "input": "[5,2,6,1]", "expectedOutput": "[2,1,1,0]" },
          { "input": "[-1]", "expectedOutput": "[0]" },
          { "input": "[-1,-1]", "expectedOutput": "[0,0]", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Range Sum Query 2D - Mutable",
        "slug": "range-sum-query-2d-mutable",
        "difficulty": "hard",
        "category": "segment-tree",
        "description": "Implement NumMatrix with update(row,col,val) and sumRegion(r1,c1,r2,c2) in O(log m * log n).",
        "examples": [
          { "input": "NumMatrix([[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]),sumRegion(2,1,4,3)->8,update(3,2,2),sumRegion(2,1,4,3)->10", "output": "see description" }
        ],
        "constraints": ["1<=m,n<=200", "At most 5000 calls"],
        "hints": [
          "2D Fenwick tree",
          "update adds delta to all ancestors; query sums prefix"
        ],
        "tags": ["segment-tree", "binary-indexed-tree", "matrix", "design"],
        "js": "class NumMatrix {\n  constructor(matrix) {}\n  update(row, col, val) {}\n  sumRegion(row1, col1, row2, col2) {}\n}",
        "py": "class NumMatrix:\n    def __init__(self, matrix):\n        pass\n    def update(self, row, col, val):\n        pass\n    def sum_region(self, row1, col1, row2, col2):\n        pass",
        "testCases": [
          { "input": "NumMatrix\n[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]\nsumRegion\n2\n1\n4\n3\nupdate\n3\n2\n2\nsumRegion\n2\n1\n4\n3", "expectedOutput": "null\n8\nnull\n10" }
        ],
        "xpReward": 130
      },
      {
        "title": "My Calendar I",
        "slug": "my-calendar-i",
        "difficulty": "medium",
        "category": "segment-tree",
        "description": "Implement MyCalendar with book(start,end). Return true if no overlap with existing events, else false.",
        "examples": [
          { "input": "book(10,20)->true,book(15,25)->false,book(20,30)->true", "output": "see description" }
        ],
        "constraints": ["0<=start<end<=10^9", "At most 1000 calls"],
        "hints": [
          "Sorted list of intervals; binary search for overlap check",
          "Overlap when newStart < existing.end AND newEnd > existing.start"
        ],
        "tags": ["segment-tree", "binary-search", "design"],
        "js": "class MyCalendar {\n  constructor() {}\n  book(start, end) {}\n}",
        "py": "class MyCalendar:\n    def __init__(self):\n        pass\n    def book(self, start, end):\n        pass",
        "testCases": [
          { "input": "book\n10\n20\nbook\n15\n25\nbook\n20\n30", "expectedOutput": "true\nfalse\ntrue" }
        ],
        "xpReward": 80
      },
      {
        "title": "Number of Longest Increasing Subsequence",
        "slug": "number-of-lis",
        "difficulty": "medium",
        "category": "segment-tree",
        "description": "Return the number of longest increasing subsequences in nums.",
        "examples": [
          { "input": "nums=[1,3,5,4,7]", "output": "2" },
          { "input": "nums=[2,2,2,2,2]", "output": "5" }
        ],
        "constraints": ["1<=nums.length<=2000", "-10^6<=nums[i]<=10^6"],
        "hints": [
          "dp[i]=(length of LIS ending at i, count of such LIS)",
          "For each i, scan j<i; if nums[j]<nums[i] and creates longer LIS: update length and count"
        ],
        "tags": ["segment-tree", "dynamic-programming", "array"],
        "js": "function findNumberOfLIS(nums) {\n  // your code here\n}",
        "py": "def find_number_of_lis(nums):\n    pass",
        "testCases": [
          { "input": "[1,3,5,4,7]", "expectedOutput": "2" },
          { "input": "[2,2,2,2,2]", "expectedOutput": "5" },
          { "input": "[1,2,4,3,5,4,7,2]", "expectedOutput": "3", "isHidden": true }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 45,
    "topic": "Graph Algorithms: Shortest Paths",
    "lesson": "Dijkstra: min-heap + dist array, O((V+E)logV). Only for non-negative weights. Bellman-Ford: relax all edges V-1 times, O(VE), handles negatives, detects negative cycles. Floyd-Warshall: all pairs O(V^3). SPFA: queue-based BF optimization. For dense graphs or all-pairs, Floyd-Warshall wins.",
    "problems": [
      {
        "title": "Network Delay Time",
        "slug": "network-delay-time",
        "difficulty": "medium",
        "category": "graph",
        "description": "Signal sent from node k through directed weighted graph. Return time for all n nodes to receive signal, or -1 if impossible.",
        "examples": [
          { "input": "times=[[2,1,1],[2,3,1],[3,4,1]],n=4,k=2", "output": "2" },
          { "input": "times=[[1,2,1]],n=2,k=1", "output": "1" },
          { "input": "times=[[1,2,1]],n=2,k=2", "output": "-1" }
        ],
        "constraints": ["1<=k<=n<=100", "1<=times.length<=6000"],
        "hints": [
          "Dijkstra from k",
          "Answer = max dist to any reachable node; -1 if any unreachable"
        ],
        "tags": ["graph", "dijkstra", "heap"],
        "js": "function networkDelayTime(times, n, k) {\n  // your code here\n}",
        "py": "def network_delay_time(times, n, k):\n    pass",
        "testCases": [
          { "input": "[[2,1,1],[2,3,1],[3,4,1]]\n4\n2", "expectedOutput": "2" },
          { "input": "[[1,2,1]]\n2\n1", "expectedOutput": "1" },
          { "input": "[[1,2,1]]\n2\n2", "expectedOutput": "-1", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Cheapest Flights Within K Stops",
        "slug": "cheapest-flights-k-stops",
        "difficulty": "medium",
        "category": "graph",
        "description": "Find cheapest price from src to dst with at most k stops. Return -1 if impossible.",
        "examples": [
          { "input": "n=4,flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],src=0,dst=3,k=1", "output": "700" },
          { "input": "n=3,flights=[[0,1,100],[1,2,100],[0,2,500]],src=0,dst=2,k=1", "output": "200" }
        ],
        "constraints": ["1<=n<=100", "0<=flights.length<=6000", "0<=k<n"],
        "hints": [
          "Modified Dijkstra tracking stops, or BF with k+1 iterations",
          "State: (cost, node, stops_remaining); don't prune on visited alone"
        ],
        "tags": ["graph", "dijkstra", "dynamic-programming", "bfs"],
        "js": "function findCheapestPrice(n, flights, src, dst, k) {\n  // your code here\n}",
        "py": "def find_cheapest_price(n, flights, src, dst, k):\n    pass",
        "testCases": [
          { "input": "4\n[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]\n0\n3\n1", "expectedOutput": "700" },
          { "input": "3\n[[0,1,100],[1,2,100],[0,2,500]]\n0\n2\n1", "expectedOutput": "200" }
        ],
        "xpReward": 100
      },
      {
        "title": "Path With Minimum Effort",
        "slug": "path-minimum-effort",
        "difficulty": "medium",
        "category": "graph",
        "description": "Grid of heights. Find path top-left to bottom-right minimizing maximum absolute difference between consecutive cells.",
        "examples": [
          { "input": "heights=[[1,2,2],[3,8,2],[5,3,5]]", "output": "2" },
          { "input": "heights=[[1,2,3],[3,8,4],[5,3,5]]", "output": "1" },
          { "input": "heights=[[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]", "output": "0" }
        ],
        "constraints": ["1<=rows,columns<=100"],
        "hints": [
          "Dijkstra where dist[r][c] = min possible max effort to reach (r,c)",
          "Or binary search on effort + BFS/DFS to check feasibility"
        ],
        "tags": ["graph", "dijkstra", "binary-search", "matrix"],
        "js": "function minimumEffortPath(heights) {\n  // your code here\n}",
        "py": "def minimum_effort_path(heights):\n    pass",
        "testCases": [
          { "input": "[[1,2,2],[3,8,2],[5,3,5]]", "expectedOutput": "2" },
          { "input": "[[1,2,3],[3,8,4],[5,3,5]]", "expectedOutput": "1" },
          { "input": "[[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 100
      },
      {
        "title": "Find the City With Smallest Number of Neighbors at Threshold Distance",
        "slug": "find-city-threshold-distance",
        "difficulty": "medium",
        "category": "graph",
        "description": "Find city with smallest number of cities reachable within distanceThreshold. Tie-break to larger city index.",
        "examples": [
          { "input": "n=4,edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]],distanceThreshold=4", "output": "3" },
          { "input": "n=5,edges=[[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]],distanceThreshold=2", "output": "0" }
        ],
        "constraints": ["2<=n<=100", "1<=edges.length<=n*(n-1)/2"],
        "hints": [
          "Floyd-Warshall for all-pairs shortest path",
          "Count cities reachable within threshold for each city"
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
        "title": "Swim in Rising Water",
        "slug": "swim-in-rising-water",
        "difficulty": "hard",
        "category": "graph",
        "description": "Grid where grid[i][j] is elevation. Wait t seconds then swim. Can move to adjacent cell if elevation <= t. Return min t to reach bottom-right.",
        "examples": [
          { "input": "grid=[[0,2],[1,3]]", "output": "3" },
          { "input": "grid=[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]", "output": "16" }
        ],
        "constraints": ["1<=n<=50", "grid[i][j] is a permutation of [0,n^2-1]"],
        "hints": [
          "Dijkstra: dist[r][c] = min bottleneck to reach (r,c)",
          "Transition cost = max(current_dist, neighbor_elevation)"
        ],
        "tags": ["graph", "dijkstra", "binary-search", "matrix"],
        "js": "function swimInWater(grid) {\n  // your code here\n}",
        "py": "def swim_in_water(grid):\n    pass",
        "testCases": [
          { "input": "[[0,2],[1,3]]", "expectedOutput": "3" },
          { "input": "[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]", "expectedOutput": "16" }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 46,
    "topic": "Topological Sort & DAG Problems",
    "lesson": "Topological sort: linearize DAG. Kahn's algorithm (BFS): add 0-indegree nodes to queue, process and reduce neighbor indegrees. DFS-based: add to result after all descendants processed (reverse). Cycle detection: if result length < n, cycle exists. Use for dependency resolution, course scheduling, build systems.",
    "problems": [
      {
        "title": "Course Schedule",
        "slug": "course-schedule",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given numCourses and prerequisites, return true if you can finish all courses (no cycle in dependency graph).",
        "examples": [
          { "input": "numCourses=2,prerequisites=[[1,0]]", "output": "true" },
          { "input": "numCourses=2,prerequisites=[[1,0],[0,1]]", "output": "false" }
        ],
        "constraints": ["1<=numCourses<=2000", "0<=prerequisites.length<=5000"],
        "hints": [
          "Topological sort; if all courses ordered -> no cycle -> true",
          "Or DFS with 3-color visited (unvisited/processing/done)"
        ],
        "tags": ["graph", "topological-sort", "dfs", "bfs"],
        "js": "function canFinish(numCourses, prerequisites) {\n  // your code here\n}",
        "py": "def can_finish(num_courses, prerequisites):\n    pass",
        "testCases": [
          { "input": "2\n[[1,0]]", "expectedOutput": "true" },
          { "input": "2\n[[1,0],[0,1]]", "expectedOutput": "false" },
          { "input": "1\n[]", "expectedOutput": "true", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Course Schedule II",
        "slug": "course-schedule-ii",
        "difficulty": "medium",
        "category": "graph",
        "description": "Return any valid order to take all courses given prerequisites. Return empty array if impossible.",
        "examples": [
          { "input": "numCourses=2,prerequisites=[[1,0]]", "output": "[0,1]" },
          { "input": "numCourses=4,prerequisites=[[1,0],[2,0],[3,1],[3,2]]", "output": "[0,2,1,3]" },
          { "input": "numCourses=1,prerequisites=[]", "output": "[0]" }
        ],
        "constraints": ["1<=numCourses<=2000"],
        "hints": [
          "Kahn's algorithm: topological order is the result",
          "Empty result if cycle detected (result.length < numCourses)"
        ],
        "tags": ["graph", "topological-sort", "bfs"],
        "js": "function findOrder(numCourses, prerequisites) {\n  // your code here\n}",
        "py": "def find_order(num_courses, prerequisites):\n    pass",
        "testCases": [
          { "input": "2\n[[1,0]]", "expectedOutput": "[0,1]" },
          { "input": "4\n[[1,0],[2,0],[3,1],[3,2]]", "expectedOutput": "[0,1,2,3]" },
          { "input": "1\n[]", "expectedOutput": "[0]", "isHidden": true }
        ],
        "xpReward": 80
      },
      {
        "title": "Alien Dictionary",
        "slug": "alien-dictionary",
        "difficulty": "hard",
        "category": "graph",
        "description": "Given sorted alien language words, derive character ordering. Return any valid ordering. Return '' if invalid.",
        "examples": [
          { "input": "words=[wrt,wrf,er,ett,rftt]", "output": "wertf" },
          { "input": "words=[z,x]", "output": "zx" },
          { "input": "words=[z,x,z]", "output": "" }
        ],
        "constraints": ["1<=words.length<=100", "1<=words[i].length<=100"],
        "hints": [
          "Compare adjacent words to extract char ordering edges",
          "If w1 is prefix of w2 but longer, return ''",
          "Topological sort; '' if cycle or not all chars included"
        ],
        "tags": ["graph", "topological-sort", "string"],
        "js": "function alienOrder(words) {\n  // your code here\n}",
        "py": "def alien_order(words):\n    pass",
        "testCases": [
          { "input": "[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]", "expectedOutput": "wertf" },
          { "input": "[\"z\",\"x\"]", "expectedOutput": "zx" },
          { "input": "[\"z\",\"x\",\"z\"]", "expectedOutput": "" }
        ],
        "xpReward": 130
      },
      {
        "title": "Minimum Height Trees",
        "slug": "minimum-height-trees",
        "difficulty": "medium",
        "category": "graph",
        "description": "For a tree of n nodes, return all root labels that minimize the tree height.",
        "examples": [
          { "input": "n=4,edges=[[1,0],[1,2],[1,3]]", "output": "[1]" },
          { "input": "n=6,edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]", "output": "[3,4]" }
        ],
        "constraints": ["1<=n<=2*10^4"],
        "hints": [
          "Topological sort from leaves inward (trim leaves iteratively)",
          "At most 2 nodes remain at the end — they are centers"
        ],
        "tags": ["graph", "topological-sort", "tree"],
        "js": "function findMinHeightTrees(n, edges) {\n  // your code here\n}",
        "py": "def find_min_height_trees(n, edges):\n    pass",
        "testCases": [
          { "input": "4\n[[1,0],[1,2],[1,3]]", "expectedOutput": "[1]" },
          { "input": "6\n[[3,0],[3,1],[3,2],[3,4],[5,4]]", "expectedOutput": "[3,4]" },
          { "input": "1\n[]", "expectedOutput": "[0]", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Parallel Courses",
        "slug": "parallel-courses",
        "difficulty": "medium",
        "category": "graph",
        "description": "Take courses with prerequisites. Each semester you can take any courses whose prerequisites are met. Return minimum semesters to finish all, or -1 if impossible.",
        "examples": [
          { "input": "n=3,relations=[[1,3],[2,3]]", "output": "2" },
          { "input": "n=3,relations=[[1,2],[2,3],[3,1]]", "output": "-1" }
        ],
        "constraints": ["1<=n<=5000", "1<=relations.length<=5000"],
        "hints": [
          "Kahn's BFS, process all 0-indegree nodes per level",
          "Levels = semesters; -1 if cycle (processed < n)"
        ],
        "tags": ["graph", "topological-sort", "bfs"],
        "js": "function minimumSemesters(n, relations) {\n  // your code here\n}",
        "py": "def minimum_semesters(n, relations):\n    pass",
        "testCases": [
          { "input": "3\n[[1,3],[2,3]]", "expectedOutput": "2" },
          { "input": "3\n[[1,2],[2,3],[3,1]]", "expectedOutput": "-1" }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 47,
    "topic": "Advanced Dynamic Programming: State Machines",
    "lesson": "State machine DP: define states as abstract machine states (e.g., holding/not-holding stock, cooldown). Transition: state[i] from state[i-1] and state[i-2]. Many 'best profit' problems reduce to this. Key: enumerate all states clearly before coding. Often O(n * states) time, O(states) space.",
    "problems": [
      {
        "title": "Best Time to Buy and Sell Stock with Cooldown",
        "slug": "stock-cooldown",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Maximize profit with cooldown: after selling you must wait 1 day before buying again.",
        "examples": [
          { "input": "prices=[1,2,3,0,2]", "output": "3" },
          { "input": "prices=[1]", "output": "0" }
        ],
        "constraints": ["1<=prices.length<=5000", "0<=prices[i]<=1000"],
        "hints": [
          "States: hold (have stock), sold (just sold, cooldown), rest (can buy)",
          "hold=max(hold,rest-price); sold=hold+price; rest=max(rest,sold)"
        ],
        "tags": ["dynamic-programming", "state-machine", "array"],
        "js": "function maxProfit(prices) {\n  // your code here\n}",
        "py": "def max_profit(prices):\n    pass",
        "testCases": [
          { "input": "[1,2,3,0,2]", "expectedOutput": "3" },
          { "input": "[1]", "expectedOutput": "0" },
          { "input": "[2,1,4]", "expectedOutput": "3", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Best Time to Buy and Sell Stock with Transaction Fee",
        "slug": "stock-transaction-fee",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Maximize profit with unlimited transactions but a fee per transaction.",
        "examples": [
          { "input": "prices=[1,3,2,8,4,9],fee=2", "output": "8" },
          { "input": "prices=[1,3,7,5,10,3],fee=3", "output": "6" }
        ],
        "constraints": ["1<=prices.length<=5*10^4", "1<=fee<=10^4"],
        "hints": [
          "States: cash (not holding), hold (holding)",
          "cash=max(cash,hold+price-fee); hold=max(hold,cash-price)"
        ],
        "tags": ["dynamic-programming", "state-machine", "greedy"],
        "js": "function maxProfit(prices, fee) {\n  // your code here\n}",
        "py": "def max_profit(prices, fee):\n    pass",
        "testCases": [
          { "input": "[1,3,2,8,4,9]\n2", "expectedOutput": "8" },
          { "input": "[1,3,7,5,10,3]\n3", "expectedOutput": "6" }
        ],
        "xpReward": 80
      },
      {
        "title": "Best Time to Buy and Sell Stock III",
        "slug": "stock-at-most-two-transactions",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Maximize profit with at most 2 transactions. You must sell before buying again.",
        "examples": [
          { "input": "prices=[3,3,5,0,0,3,1,4]", "output": "6" },
          { "input": "prices=[1,2,3,4,5]", "output": "4" },
          { "input": "prices=[7,6,4,3,1]", "output": "0" }
        ],
        "constraints": ["1<=prices.length<=10^5"],
        "hints": [
          "4 states: buy1, sell1, buy2, sell2",
          "buy1=max(buy1,-price); sell1=max(sell1,buy1+price); buy2=max(buy2,sell1-price); sell2=max(sell2,buy2+price)"
        ],
        "tags": ["dynamic-programming", "state-machine", "array"],
        "js": "function maxProfit(prices) {\n  // your code here\n}",
        "py": "def max_profit(prices):\n    pass",
        "testCases": [
          { "input": "[3,3,5,0,0,3,1,4]", "expectedOutput": "6" },
          { "input": "[1,2,3,4,5]", "expectedOutput": "4" },
          { "input": "[7,6,4,3,1]", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 110
      },
      {
        "title": "Best Time to Buy and Sell Stock IV",
        "slug": "stock-at-most-k-transactions",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Maximize profit with at most k transactions.",
        "examples": [
          { "input": "k=2,prices=[2,4,1]", "output": "2" },
          { "input": "k=2,prices=[3,2,6,5,0,3]", "output": "7" }
        ],
        "constraints": ["1<=prices.length<=1000", "0<=k<=1000"],
        "hints": [
          "If k >= n/2: unlimited transactions (greedy)",
          "dp[t][i] = max profit with t transactions up to day i"
        ],
        "tags": ["dynamic-programming", "state-machine", "array"],
        "js": "function maxProfit(k, prices) {\n  // your code here\n}",
        "py": "def max_profit(k, prices):\n    pass",
        "testCases": [
          { "input": "2\n[2,4,1]", "expectedOutput": "2" },
          { "input": "2\n[3,2,6,5,0,3]", "expectedOutput": "7" }
        ],
        "xpReward": 120
      },
      {
        "title": "Paint House II",
        "slug": "paint-house-ii",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Paint n houses with k colors. Adjacent houses must have different colors. Return minimum cost. Solve in O(n*k) time.",
        "examples": [
          { "input": "costs=[[1,5,3],[2,9,4]]", "output": "5" },
          { "input": "costs=[[1,3],[2,4]]", "output": "5" }
        ],
        "constraints": ["1<=n<=100", "2<=k<=20"],
        "hints": [
          "Track minimum and second-minimum costs from previous row",
          "If current color == prev min color index, use second min; else use min"
        ],
        "tags": ["dynamic-programming", "array"],
        "js": "function minCostII(costs) {\n  // your code here\n}",
        "py": "def min_cost_ii(costs):\n    pass",
        "testCases": [
          { "input": "[[1,5,3],[2,9,4]]", "expectedOutput": "5" },
          { "input": "[[1,3],[2,4]]", "expectedOutput": "5" }
        ],
        "xpReward": 110
      }
    ]
  },
  {
    "dayNumber": 48,
    "topic": "Bit Manipulation",
    "lesson": "Essential tricks: x & (x-1) clears lowest set bit (count bits, detect power of 2). x & (-x) isolates lowest set bit. XOR: a^a=0, a^0=a (find single number). Left/right shifts: multiply/divide by 2. Bitmask DP: subset as integer. Brian Kernighan for bit count. n & (n-1)==0 means power of 2.",
    "problems": [
      {
        "title": "Single Number II",
        "slug": "single-number-ii",
        "difficulty": "medium",
        "category": "bit-manipulation",
        "description": "Every element appears 3 times except one which appears once. Find the single element in O(1) space.",
        "examples": [
          { "input": "nums=[2,2,3,2]", "output": "3" },
          { "input": "nums=[0,1,0,1,0,1,99]", "output": "99" }
        ],
        "constraints": ["1<=nums.length<=3*10^4", "-2^31<=nums[i]<=2^31-1"],
        "hints": [
          "Count bits mod 3 across all numbers",
          "Or: ones=ones^n & ~twos; twos=twos^n & ~ones (state machine)"
        ],
        "tags": ["bit-manipulation", "array"],
        "js": "function singleNumber(nums) {\n  // your code here\n}",
        "py": "def single_number(nums):\n    pass",
        "testCases": [
          { "input": "[2,2,3,2]", "expectedOutput": "3" },
          { "input": "[0,1,0,1,0,1,99]", "expectedOutput": "99" }
        ],
        "xpReward": 90
      },
      {
        "title": "Counting Bits",
        "slug": "counting-bits",
        "difficulty": "easy",
        "category": "bit-manipulation",
        "description": "Return array ans of length n+1 where ans[i] is number of 1's in binary representation of i.",
        "examples": [
          { "input": "n=2", "output": "[0,1,1]" },
          { "input": "n=5", "output": "[0,1,1,2,1,2]" }
        ],
        "constraints": ["0<=n<=10^5"],
        "hints": [
          "dp[i] = dp[i >> 1] + (i & 1)",
          "Or dp[i] = dp[i & (i-1)] + 1"
        ],
        "tags": ["bit-manipulation", "dynamic-programming"],
        "js": "function countBits(n) {\n  // your code here\n}",
        "py": "def count_bits(n):\n    pass",
        "testCases": [
          { "input": "2", "expectedOutput": "[0,1,1]" },
          { "input": "5", "expectedOutput": "[0,1,1,2,1,2]" }
        ],
        "xpReward": 50
      },
      {
        "title": "Reverse Bits",
        "slug": "reverse-bits",
        "difficulty": "easy",
        "category": "bit-manipulation",
        "description": "Reverse bits of a 32-bit unsigned integer.",
        "examples": [
          { "input": "n=00000010100101000001111010011100", "output": "964176192" },
          { "input": "n=11111111111111111111111111111101", "output": "3221225471" }
        ],
        "constraints": ["Input is 32-bit unsigned integer"],
        "hints": [
          "Loop 32 times: result = (result << 1) | (n & 1); n >>= 1"
        ],
        "tags": ["bit-manipulation"],
        "js": "function reverseBits(n) {\n  // your code here\n}",
        "py": "def reverse_bits(n):\n    pass",
        "testCases": [
          { "input": "43261596", "expectedOutput": "964176192" },
          { "input": "4294967293", "expectedOutput": "3221225471" }
        ],
        "xpReward": 50
      },
      {
        "title": "Sum of Two Integers",
        "slug": "sum-of-two-integers",
        "difficulty": "medium",
        "category": "bit-manipulation",
        "description": "Calculate sum of two integers without using + or - operators.",
        "examples": [
          { "input": "a=1,b=2", "output": "3" },
          { "input": "a=2,b=3", "output": "5" }
        ],
        "constraints": ["-1000<=a,b<=1000"],
        "hints": [
          "XOR gives sum without carry; AND<<1 gives carry",
          "Repeat until carry is 0"
        ],
        "tags": ["bit-manipulation", "math"],
        "js": "function getSum(a, b) {\n  // your code here\n}",
        "py": "def get_sum(a, b):\n    pass",
        "testCases": [
          { "input": "1\n2", "expectedOutput": "3" },
          { "input": "2\n3", "expectedOutput": "5" },
          { "input": "-1\n1", "expectedOutput": "0", "isHidden": true }
        ],
        "xpReward": 70
      },
      {
        "title": "Total Hamming Distance",
        "slug": "total-hamming-distance",
        "difficulty": "medium",
        "category": "bit-manipulation",
        "description": "Return sum of Hamming distances between all pairs of numbers in nums.",
        "examples": [
          { "input": "nums=[4,14,2]", "output": "6" },
          { "input": "nums=[4,14,4]", "output": "4" }
        ],
        "constraints": ["1<=nums.length<=10^4", "0<=nums[i]<=10^9"],
        "hints": [
          "For each bit position: count ones (k) and zeros (n-k)",
          "Contribution to total = k * (n-k)"
        ],
        "tags": ["bit-manipulation", "array", "math"],
        "js": "function totalHammingDistance(nums) {\n  // your code here\n}",
        "py": "def total_hamming_distance(nums):\n    pass",
        "testCases": [
          { "input": "[4,14,2]", "expectedOutput": "6" },
          { "input": "[4,14,4]", "expectedOutput": "4" }
        ],
        "xpReward": 70
      }
    ]
  },
  {
    "dayNumber": 49,
    "topic": "Advanced Heap Problems",
    "lesson": "Heap patterns: (1) Top-K: maintain heap of size k. (2) Merge k sorted: heap of (val, list_idx, elem_idx). (3) Two heaps (median): max-heap for lower half, min-heap for upper. (4) Lazy deletion: mark deleted, skip when popping. Python: negate values for max-heap. Always think 'what invariant does the heap maintain?'",
    "problems": [
      {
        "title": "Find Median from Data Stream",
        "slug": "find-median-data-stream",
        "difficulty": "hard",
        "category": "heap",
        "description": "Implement MedianFinder with addNum and findMedian. findMedian returns median of all added numbers.",
        "examples": [
          { "input": "addNum(1),addNum(2),findMedian()->1.5,addNum(3),findMedian()->2.0", "output": "see description" }
        ],
        "constraints": ["-10^5<=num<=10^5", "At most 5*10^4 calls"],
        "hints": [
          "Max-heap for lower half, min-heap for upper half",
          "Balance: sizes differ by at most 1; median from tops"
        ],
        "tags": ["heap", "two-pointers", "design", "sorting"],
        "js": "class MedianFinder {\n  constructor() {}\n  addNum(num) {}\n  findMedian() {}\n}",
        "py": "class MedianFinder:\n    def __init__(self):\n        pass\n    def add_num(self, num):\n        pass\n    def find_median(self):\n        pass",
        "testCases": [
          { "input": "addNum\n1\naddNum\n2\nfindMedian\naddNum\n3\nfindMedian", "expectedOutput": "null\nnull\n1.5\nnull\n2.0" }
        ],
        "xpReward": 130
      },
      {
        "title": "Sliding Window Median",
        "slug": "sliding-window-median",
        "difficulty": "hard",
        "category": "heap",
        "description": "Given nums and window size k, return medians of each window as it slides.",
        "examples": [
          { "input": "nums=[1,3,-1,-3,5,3,6,7],k=3", "output": "[1.0,-1.0,-1.0,3.0,5.0,6.0]" },
          { "input": "nums=[1,2,3,4,2,3,1,4,2],k=3", "output": "[2.0,3.0,3.0,3.0,2.0,3.0,2.0]" }
        ],
        "constraints": ["1<=k<=nums.length<=10^5"],
        "hints": [
          "Two heaps with lazy deletion (track elements to remove)",
          "Or sorted structure with bisect"
        ],
        "tags": ["heap", "sliding-window", "array"],
        "js": "function medianSlidingWindow(nums, k) {\n  // your code here\n}",
        "py": "def median_sliding_window(nums, k):\n    pass",
        "testCases": [
          { "input": "[1,3,-1,-3,5,3,6,7]\n3", "expectedOutput": "[1.0,-1.0,-1.0,3.0,5.0,6.0]" },
          { "input": "[1,2,3,4,2,3,1,4,2]\n3", "expectedOutput": "[2.0,3.0,3.0,3.0,2.0,3.0,2.0]" }
        ],
        "xpReward": 140
      },
      {
        "title": "Merge k Sorted Lists",
        "slug": "merge-k-sorted-lists",
        "difficulty": "hard",
        "category": "heap",
        "description": "Merge k sorted linked lists into one sorted linked list.",
        "examples": [
          { "input": "lists=[[1,4,5],[1,3,4],[2,6]]", "output": "[1,1,2,3,4,4,5,6]" },
          { "input": "lists=[]", "output": "[]" },
          { "input": "lists=[[]]", "output": "[]" }
        ],
        "constraints": ["0<=k<=10^4", "0<=lists[i].length<=500"],
        "hints": [
          "Min-heap of (node.val, list_index, node)",
          "Pop min, push next from same list; build result"
        ],
        "tags": ["heap", "linked-list", "divide-and-conquer"],
        "js": "function mergeKLists(lists) {\n  // your code here\n}",
        "py": "def merge_k_lists(lists):\n    pass",
        "testCases": [
          { "input": "[[1,4,5],[1,3,4],[2,6]]", "expectedOutput": "[1,1,2,3,4,4,5,6]" },
          { "input": "[]", "expectedOutput": "[]" },
          { "input": "[[]]", "expectedOutput": "[]", "isHidden": true }
        ],
        "xpReward": 120
      },
      {
        "title": "Task Scheduler",
        "slug": "task-scheduler",
        "difficulty": "medium",
        "category": "heap",
        "description": "Schedule tasks with cooldown n between same-type tasks. Return minimum intervals needed.",
        "examples": [
          { "input": "tasks=[A,A,A,B,B,B],n=2", "output": "8" },
          { "input": "tasks=[A,C,A,B,D,B],n=1", "output": "6" },
          { "input": "tasks=[A,A,A,B,B,B],n=3", "output": "10" }
        ],
        "constraints": ["1<=tasks.length<=10^4", "0<=n<=100"],
        "hints": [
          "Most frequent task determines idle time",
          "idleSlots = (maxFreq-1)*n; fill with other tasks; max(tasks.length, result)"
        ],
        "tags": ["heap", "greedy", "array"],
        "js": "function leastInterval(tasks, n) {\n  // your code here\n}",
        "py": "def least_interval(tasks, n):\n    pass",
        "testCases": [
          { "input": "[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"]\n2", "expectedOutput": "8" },
          { "input": "[\"A\",\"C\",\"A\",\"B\",\"D\",\"B\"]\n1", "expectedOutput": "6" },
          { "input": "[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"]\n3", "expectedOutput": "10", "isHidden": true }
        ],
        "xpReward": 90
      },
      {
        "title": "Reorganize String",
        "slug": "reorganize-string",
        "difficulty": "medium",
        "category": "heap",
        "description": "Rearrange characters so no two adjacent are the same. Return any valid arrangement or '' if impossible.",
        "examples": [
          { "input": "s=aab", "output": "aba" },
          { "input": "s=aaab", "output": "" }
        ],
        "constraints": ["1<=s.length<=500"],
        "hints": [
          "Max-heap of (count, char)",
          "Always pick most frequent; if same as last, pick second most frequent"
        ],
        "tags": ["heap", "greedy", "string"],
        "js": "function reorganizeString(s) {\n  // your code here\n}",
        "py": "def reorganize_string(s):\n    pass",
        "testCases": [
          { "input": "aab", "expectedOutput": "aba" },
          { "input": "aaab", "expectedOutput": "" },
          { "input": "vvvlo", "expectedOutput": "vlvov", "isHidden": true }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 50,
    "topic": "System Design Coding Patterns & Mock Interview",
    "lesson": "Day 50 synthesis: LRU Cache combines hashmap + doubly linked list for O(1) ops. LFU adds frequency tracking. Rate limiter uses sliding window. Design problems test data structure selection. Interview tip: state assumptions, discuss tradeoffs, start with brute force then optimize. O(1) usually means hashmap or pre-computation.",
    "problems": [
      {
        "title": "LRU Cache",
        "slug": "lru-cache",
        "difficulty": "medium",
        "category": "design",
        "description": "Design LRU cache with get(key) and put(key, value) in O(1). Evict least recently used when over capacity.",
        "examples": [
          { "input": "LRUCache(2),put(1,1),put(2,2),get(1)->1,put(3,3),get(2)->-1,put(4,4),get(1)->-1,get(3)->3,get(4)->4", "output": "see description" }
        ],
        "constraints": ["1<=capacity<=3000", "At most 3*10^4 calls"],
        "hints": [
          "HashMap for O(1) lookup + doubly linked list for O(1) insertion/deletion",
          "Dummy head and tail nodes simplify edge cases"
        ],
        "tags": ["design", "hash-table", "linked-list"],
        "js": "class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}",
        "py": "class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass",
        "testCases": [
          { "input": "LRUCache\n2\nput\n1\n1\nput\n2\n2\nget\n1\nput\n3\n3\nget\n2\nput\n4\n4\nget\n1\nget\n3\nget\n4", "expectedOutput": "null\nnull\nnull\n1\nnull\n-1\nnull\n-1\n3\n4" }
        ],
        "xpReward": 100
      },
      {
        "title": "LFU Cache",
        "slug": "lfu-cache",
        "difficulty": "hard",
        "category": "design",
        "description": "Design LFU cache with get and put in O(1). Ties on frequency broken by LRU order.",
        "examples": [
          { "input": "LFUCache(2),put(1,1),put(2,2),get(1)->1,put(3,3),get(2)->-1,get(3)->3,put(4,4),get(1)->1,get(3)->3,get(4)->4", "output": "see description" }
        ],
        "constraints": ["0<=capacity<=10^4", "At most 10^5 calls"],
        "hints": [
          "HashMap(key->val,freq) + HashMap(freq->OrderedSet of keys) + minFreq variable",
          "On access: move key from freq bucket to freq+1 bucket; update minFreq"
        ],
        "tags": ["design", "hash-table", "linked-list"],
        "js": "class LFUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}",
        "py": "class LFUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass",
        "testCases": [
          { "input": "LFUCache\n2\nput\n1\n1\nput\n2\n2\nget\n1\nput\n3\n3\nget\n2\nget\n3\nput\n4\n4\nget\n1\nget\n3\nget\n4", "expectedOutput": "null\nnull\nnull\n1\nnull\n-1\n3\nnull\n1\n3\n4" }
        ],
        "xpReward": 150
      },
      {
        "title": "Design Twitter",
        "slug": "design-twitter",
        "difficulty": "medium",
        "category": "design",
        "description": "Implement Twitter with postTweet, getNewsFeed (10 most recent tweets from user + followees), follow, and unfollow.",
        "examples": [
          { "input": "postTweet(1,5),getNewsFeed(1)->[5],follow(1,2),postTweet(2,6),getNewsFeed(1)->[6,5],unfollow(1,2),getNewsFeed(1)->[5]", "output": "see description" }
        ],
        "constraints": ["1<=userId,tweetId<=500", "At most 3*10^4 calls"],
        "hints": [
          "HashMap(userId->list of tweets with timestamp) + HashMap(userId->set of followees)",
          "Merge k sorted lists with heap for news feed"
        ],
        "tags": ["design", "hash-table", "heap", "linked-list"],
        "js": "class Twitter {\n  constructor() {}\n  postTweet(userId, tweetId) {}\n  getNewsFeed(userId) {}\n  follow(followerId, followeeId) {}\n  unfollow(followerId, followeeId) {}\n}",
        "py": "class Twitter:\n    def __init__(self):\n        pass\n    def post_tweet(self, user_id, tweet_id):\n        pass\n    def get_news_feed(self, user_id):\n        pass\n    def follow(self, follower_id, followee_id):\n        pass\n    def unfollow(self, follower_id, followee_id):\n        pass",
        "testCases": [
          { "input": "postTweet\n1\n5\ngetNewsFeed\n1\nfollow\n1\n2\npostTweet\n2\n6\ngetNewsFeed\n1\nunfollow\n1\n2\ngetNewsFeed\n1", "expectedOutput": "null\n[5]\nnull\nnull\n[6,5]\nnull\n[5]" }
        ],
        "xpReward": 110
      },
      {
        "title": "Insert Delete GetRandom O(1)",
        "slug": "insert-delete-getrandom",
        "difficulty": "medium",
        "category": "design",
        "description": "Implement RandomizedSet with insert, remove, and getRandom — all O(1) average.",
        "examples": [
          { "input": "insert(1)->true,remove(2)->false,insert(2)->true,getRandom()->[1or2],remove(1)->true,insert(2)->false,getRandom()->2", "output": "see description" }
        ],
        "constraints": ["-2^31<=val<=2^31-1", "At most 2*10^5 calls"],
        "hints": [
          "HashMap(val->index) + array",
          "Remove: swap with last element, pop last; update hashmap"
        ],
        "tags": ["design", "hash-table", "array", "randomized"],
        "js": "class RandomizedSet {\n  constructor() {}\n  insert(val) {}\n  remove(val) {}\n  getRandom() {}\n}",
        "py": "class RandomizedSet:\n    def __init__(self):\n        pass\n    def insert(self, val):\n        pass\n    def remove(self, val):\n        pass\n    def get_random(self):\n        pass",
        "testCases": [
          { "input": "insert\n1\nremove\n2\ninsert\n2\nremove\n1\ninsert\n2\ngetRandom", "expectedOutput": "true\nfalse\ntrue\ntrue\nfalse\n2" }
        ],
        "xpReward": 90
      },
      {
        "title": "Design Snake Game",
        "slug": "design-snake-game",
        "difficulty": "medium",
        "category": "design",
        "description": "Implement SnakeGame with move(direction) returning current score, or -1 if game over (snake hits wall or itself).",
        "examples": [
          { "input": "SnakeGame(3,2,[[1,2],[0,1]]),move(R)->0,move(D)->0,move(R)->1,move(U)->1,move(L)->2,move(U)->-1", "output": "see description" }
        ],
        "constraints": ["1<=width,height<=10^4", "1<=food.length<=50", "At most 10^4 calls"],
        "hints": [
          "Deque for snake body (head at front, tail at back)",
          "HashSet for O(1) self-collision check; pop tail before adding head"
        ],
        "tags": ["design", "queue", "hash-table", "simulation"],
        "js": "class SnakeGame {\n  constructor(width, height, food) {}\n  move(direction) {}\n}",
        "py": "class SnakeGame:\n    def __init__(self, width, height, food):\n        pass\n    def move(self, direction):\n        pass",
        "testCases": [
          { "input": "SnakeGame\n3\n2\n[[1,2],[0,1]]\nmove\nR\nmove\nD\nmove\nR\nmove\nU\nmove\nL\nmove\nU", "expectedOutput": "null\n0\n0\n1\n1\n2\n-1" }
        ],
        "xpReward": 110
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
    return NextResponse.json({ success: true, message: `Days 41-50 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}