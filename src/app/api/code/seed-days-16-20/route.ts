// src/app/api/code/seed-days-16-20/route.ts
// ONE-TIME route: seeds days 16-20 with real problems
// Visit /api/code/seed-days-16-20 once then delete this file

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 16,
    "topic": "Binary Search Trees",
    "lesson": "BST: left < root < right. Inorder traversal gives sorted output. Validate by passing min/max bounds recursively. Average O(log n) for search/insert/delete.",
    "problems": [
      {
        "title": "Kth Smallest in BST",
        "slug": "kth-smallest-bst",
        "difficulty": "medium",
        "category": "tree",
        "description": "Given the root of a BST and integer k, return the kth smallest value.",
        "examples": [
          {
            "input": "root = [3,1,4,null,2], k = 1",
            "output": "1"
          },
          {
            "input": "root = [5,3,6,2,4,null,null,1], k = 3",
            "output": "3"
          }
        ],
        "constraints": [
          "1 <= k <= n <= 10^4",
          "-10^4 <= Node.val <= 10^4"
        ],
        "hints": [
          "Inorder traversal of BST gives sorted values",
          "Count visited nodes; stop when count equals k"
        ],
        "tags": [
          "tree",
          "bst"
        ],
        "js": "function kthSmallest(root, k) {\n  // your code here\n}",
        "py": "def kth_smallest(root, k):\n    pass",
        "testCases": [
          {
            "input": "[3,1,4,null,2]\n1",
            "expectedOutput": "1"
          },
          {
            "input": "[5,3,6,2,4,null,null,1]\n3",
            "expectedOutput": "3"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Validate Binary Search Tree",
        "slug": "validate-bst",
        "difficulty": "medium",
        "category": "tree",
        "description": "Given the root of a binary tree, determine if it is a valid BST. Left subtree nodes < root, right > root, both subtrees also valid BSTs.",
        "examples": [
          {
            "input": "root = [2,1,3]",
            "output": "true"
          },
          {
            "input": "root = [5,1,4,null,null,3,6]",
            "output": "false",
            "explanation": "Root is 5 but right child is 4 which is less than 5"
          }
        ],
        "constraints": [
          "1 <= number of nodes <= 10^4",
          "-2^31 <= Node.val <= 2^31 - 1"
        ],
        "hints": [
          "Pass min and max bounds through recursion",
          "Left child must be less than current node AND greater than inherited min bound"
        ],
        "tags": [
          "tree",
          "bst",
          "recursion"
        ],
        "js": "function isValidBST(root) {\n  // your code here\n}",
        "py": "def is_valid_bst(root):\n    pass",
        "testCases": [
          {
            "input": "[2,1,3]",
            "expectedOutput": "true"
          },
          {
            "input": "[5,1,4,null,null,3,6]",
            "expectedOutput": "false"
          },
          {
            "input": "[2,2,2]",
            "expectedOutput": "false",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Lowest Common Ancestor of BST",
        "slug": "lca-bst",
        "difficulty": "medium",
        "category": "tree",
        "description": "Given a BST and two nodes p and q, find their lowest common ancestor \u2014 the lowest node that has both as descendants.",
        "examples": [
          {
            "input": "root = [6,2,8,0,4,7,9], p = 2, q = 8",
            "output": "6"
          },
          {
            "input": "root = [6,2,8,0,4,7,9], p = 2, q = 4",
            "output": "2"
          }
        ],
        "constraints": [
          "2 <= number of nodes <= 10^5",
          "Node values are unique"
        ],
        "hints": [
          "If both p,q < root go left",
          "If both > root go right",
          "Otherwise root is the LCA"
        ],
        "tags": [
          "tree",
          "bst"
        ],
        "js": "function lowestCommonAncestor(root, p, q) {\n  // your code here\n}",
        "py": "def lowest_common_ancestor(root, p, q):\n    pass",
        "testCases": [
          {
            "input": "[6,2,8,0,4,7,9]\n2\n8",
            "expectedOutput": "6"
          },
          {
            "input": "[6,2,8,0,4,7,9]\n2\n4",
            "expectedOutput": "2"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Insert into BST",
        "slug": "insert-bst",
        "difficulty": "easy",
        "category": "tree",
        "description": "Given the root of a BST and an integer val, insert val and return the root. Tree must remain a valid BST.",
        "examples": [
          {
            "input": "root = [4,2,7,1,3], val = 5",
            "output": "[4,2,7,1,3,5]"
          }
        ],
        "constraints": [
          "0 <= number of nodes <= 10^4",
          "val is not in the BST"
        ],
        "hints": [
          "If val < root.val recurse left, else recurse right",
          "When you hit null, create a new node there"
        ],
        "tags": [
          "tree",
          "bst"
        ],
        "js": "function insertIntoBST(root, val) {\n  // your code here\n}",
        "py": "def insert_into_bst(root, val):\n    pass",
        "testCases": [
          {
            "input": "[4,2,7,1,3]\n5",
            "expectedOutput": "[4,2,7,1,3,5]"
          }
        ],
        "xpReward": 50
      },
      {
        "title": "Range Sum of BST",
        "slug": "range-sum-bst",
        "difficulty": "easy",
        "category": "tree",
        "description": "Given root of BST and integers low and high, return sum of values of all nodes with value in the inclusive range [low, high].",
        "examples": [
          {
            "input": "root = [10,5,15,3,7,null,18], low = 7, high = 15",
            "output": "32"
          },
          {
            "input": "root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10",
            "output": "23"
          }
        ],
        "constraints": [
          "1 <= number of nodes <= 2*10^4",
          "1 <= low <= high <= 10^5"
        ],
        "hints": [
          "If node.val < low, skip the entire left subtree",
          "If node.val > high, skip the entire right subtree",
          "Otherwise add node.val and recurse both sides"
        ],
        "tags": [
          "tree",
          "bst",
          "recursion"
        ],
        "js": "function rangeSumBST(root, low, high) {\n  // your code here\n}",
        "py": "def range_sum_bst(root, low, high):\n    pass",
        "testCases": [
          {
            "input": "[10,5,15,3,7,null,18]\n7\n15",
            "expectedOutput": "32"
          },
          {
            "input": "[10,5,15,3,7,13,18,1,null,6]\n6\n10",
            "expectedOutput": "23"
          }
        ],
        "xpReward": 50
      }
    ]
  },
  {
    "dayNumber": 17,
    "topic": "Heaps & Priority Queues",
    "lesson": "Min-heap: every parent <= children. Insert/extract O(log n). Get min O(1). Stored as array: children of i at 2i+1 and 2i+2. Use for top-K problems, Dijkstra, and task scheduling.",
    "problems": [
      {
        "title": "Last Stone Weight",
        "slug": "last-stone-weight",
        "difficulty": "easy",
        "category": "heap",
        "description": "You have stones with weights. Each turn pick the two heaviest: if equal both destroyed, else the difference remains. Return the weight of the last stone, or 0 if none remain.",
        "examples": [
          {
            "input": "stones = [2,7,4,1,8,1]",
            "output": "1"
          },
          {
            "input": "stones = [1]",
            "output": "1"
          }
        ],
        "constraints": [
          "1 <= stones.length <= 30",
          "1 <= stones[i] <= 1000"
        ],
        "hints": [
          "Use a max-heap (negate values for min-heap)",
          "Keep popping two heaviest until one or zero remain"
        ],
        "tags": [
          "heap",
          "array"
        ],
        "js": "function lastStoneWeight(stones) {\n  // your code here\n}",
        "py": "def last_stone_weight(stones):\n    pass",
        "testCases": [
          {
            "input": "[2,7,4,1,8,1]",
            "expectedOutput": "1"
          },
          {
            "input": "[1]",
            "expectedOutput": "1"
          },
          {
            "input": "[2,2]",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 50
      },
      {
        "title": "K Closest Points to Origin",
        "slug": "k-closest-points",
        "difficulty": "medium",
        "category": "heap",
        "description": "Given an array of points on a plane and integer k, return the k closest points to the origin (0,0). Distance is Euclidean. Return in any order.",
        "examples": [
          {
            "input": "points = [[1,3],[-2,2]], k = 1",
            "output": "[[-2,2]]"
          },
          {
            "input": "points = [[3,3],[5,-1],[-2,4]], k = 2",
            "output": "[[3,3],[-2,4]]"
          }
        ],
        "constraints": [
          "1 <= k <= points.length <= 10^4",
          "-10^4 <= xi, yi <= 10^4"
        ],
        "hints": [
          "Distance squared = x*x + y*y (no need for sqrt)",
          "Max-heap of size k; replace root if smaller distance found"
        ],
        "tags": [
          "heap",
          "array",
          "math"
        ],
        "js": "function kClosest(points, k) {\n  // your code here\n}",
        "py": "def k_closest(points, k):\n    pass",
        "testCases": [
          {
            "input": "[[1,3],[-2,2]]\n1",
            "expectedOutput": "[[-2,2]]"
          },
          {
            "input": "[[3,3],[5,-1],[-2,4]]\n2",
            "expectedOutput": "[[3,3],[-2,4]]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Kth Largest Element in an Array",
        "slug": "kth-largest-array",
        "difficulty": "medium",
        "category": "heap",
        "description": "Given an integer array nums and integer k, return the kth largest element (not kth distinct).",
        "examples": [
          {
            "input": "nums = [3,2,1,5,6,4], k = 2",
            "output": "5"
          },
          {
            "input": "nums = [3,2,3,1,2,4,5,5,6], k = 4",
            "output": "4"
          }
        ],
        "constraints": [
          "1 <= k <= nums.length <= 10^4"
        ],
        "hints": [
          "Min-heap of size k",
          "After processing all elements, root of heap is the kth largest"
        ],
        "tags": [
          "heap",
          "array",
          "sorting"
        ],
        "js": "function findKthLargest(nums, k) {\n  // your code here\n}",
        "py": "def find_kth_largest(nums, k):\n    pass",
        "testCases": [
          {
            "input": "[3,2,1,5,6,4]\n2",
            "expectedOutput": "5"
          },
          {
            "input": "[3,2,3,1,2,4,5,5,6]\n4",
            "expectedOutput": "4"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Task Scheduler",
        "slug": "task-scheduler",
        "difficulty": "medium",
        "category": "heap",
        "description": "Given tasks (characters) and cooldown n, return minimum intervals to finish all tasks. Between same tasks there must be at least n intervals (idle or other tasks).",
        "examples": [
          {
            "input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2",
            "output": "8",
            "explanation": "A->B->idle->A->B->idle->A->B"
          }
        ],
        "constraints": [
          "1 <= tasks.length <= 10^4",
          "0 <= n <= 100"
        ],
        "hints": [
          "Most frequent task determines minimum time",
          "Answer = max(tasks.length, (maxFreq-1)*(n+1) + countOfMaxFreq)"
        ],
        "tags": [
          "heap",
          "greedy"
        ],
        "js": "function leastInterval(tasks, n) {\n  // your code here\n}",
        "py": "def least_interval(tasks, n):\n    pass",
        "testCases": [
          {
            "input": "[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"]\n2",
            "expectedOutput": "8"
          },
          {
            "input": "[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"]\n0",
            "expectedOutput": "6"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Find Median from Data Stream",
        "slug": "median-data-stream",
        "difficulty": "hard",
        "category": "heap",
        "description": "Implement MedianFinder with addNum(num) and findMedian() returning the median of all numbers added so far.",
        "examples": [
          {
            "input": "addNum(1), addNum(2), findMedian() = 1.5, addNum(3), findMedian() = 2.0",
            "output": "[1.5, 2.0]"
          }
        ],
        "constraints": [
          "-10^5 <= num <= 10^5",
          "At most 5*10^4 calls"
        ],
        "hints": [
          "Two heaps: max-heap for lower half, min-heap for upper half",
          "Keep sizes balanced; median is root(s)"
        ],
        "tags": [
          "heap",
          "design"
        ],
        "js": "class MedianFinder {\n  constructor() {}\n  addNum(num) {}\n  findMedian() {}\n}",
        "py": "class MedianFinder:\n    def __init__(self): pass\n    def add_num(self, num): pass\n    def find_median(self): pass",
        "testCases": [
          {
            "input": "[1,2,3]",
            "expectedOutput": "[1.0,1.5,2.0]"
          }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 18,
    "topic": "Tries (Prefix Trees)",
    "lesson": "Trie stores strings character by character. Each node has 26 children (one per letter) and an isEnd flag. Insert/search/startsWith all O(L) where L is word length. Perfect for autocomplete and prefix queries.",
    "problems": [
      {
        "title": "Implement Trie",
        "slug": "implement-trie",
        "difficulty": "medium",
        "category": "trie",
        "description": "Implement a Trie with insert(word), search(word) returns true if word exists, and startsWith(prefix) returns true if any word starts with prefix.",
        "examples": [
          {
            "input": "insert(\"apple\"); search(\"apple\") = true; search(\"app\") = false; startsWith(\"app\") = true; insert(\"app\"); search(\"app\") = true",
            "output": "[true,false,true,true]"
          }
        ],
        "constraints": [
          "1 <= word.length <= 2000",
          "All chars are lowercase English letters",
          "At most 3*10^4 operations"
        ],
        "hints": [
          "Each node has 26 children and an isEnd flag",
          "insert: create nodes along path, set isEnd at last node",
          "search: traverse path, return isEnd of last node"
        ],
        "tags": [
          "trie",
          "design",
          "string"
        ],
        "js": "class Trie {\n  constructor() {}\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}",
        "py": "class Trie:\n    def __init__(self): pass\n    def insert(self, word): pass\n    def search(self, word): pass\n    def starts_with(self, prefix): pass",
        "testCases": [
          {
            "input": "insert:apple\nsearch:apple\nsearch:app\nstartsWith:app",
            "expectedOutput": "true\nfalse\ntrue"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Replace Words",
        "slug": "replace-words",
        "difficulty": "medium",
        "category": "trie",
        "description": "Given a dictionary of roots and a sentence, replace each word with the shortest matching root from the dictionary. Keep original if no root matches.",
        "examples": [
          {
            "input": "dictionary = [\"cat\",\"bat\",\"rat\"], sentence = \"the cattle was rattled by the battery\"",
            "output": "\"the cat was rat by the bat\""
          }
        ],
        "constraints": [
          "1 <= dictionary.length <= 1000",
          "1 <= sentence.length <= 10^6"
        ],
        "hints": [
          "Insert all roots into a trie",
          "For each word in sentence, search trie for the shortest prefix match"
        ],
        "tags": [
          "trie",
          "string"
        ],
        "js": "function replaceWords(dictionary, sentence) {\n  // your code here\n}",
        "py": "def replace_words(dictionary, sentence):\n    pass",
        "testCases": [
          {
            "input": "[\"cat\",\"bat\",\"rat\"]\nthe cattle was rattled by the battery",
            "expectedOutput": "the cat was rat by the bat"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Design Add and Search Words",
        "slug": "add-search-words",
        "difficulty": "medium",
        "category": "trie",
        "description": "Design a data structure with addWord(word) and search(word) where '.' in search matches any single character.",
        "examples": [
          {
            "input": "addWord(\"bad\"), addWord(\"dad\"), addWord(\"mad\"), search(\"pad\") = false, search(\"bad\") = true, search(\".ad\") = true, search(\"b..\") = true",
            "output": "[false,true,true,true]"
          }
        ],
        "constraints": [
          "1 <= word.length <= 25",
          "word contains only lowercase letters and '.'"
        ],
        "hints": [
          "Build a trie for addWord",
          "For '.' in search, recursively try all 26 children"
        ],
        "tags": [
          "trie",
          "design",
          "dfs"
        ],
        "js": "class WordDictionary {\n  constructor() {}\n  addWord(word) {}\n  search(word) {}\n}",
        "py": "class WordDictionary:\n    def __init__(self): pass\n    def add_word(self, word): pass\n    def search(self, word): pass",
        "testCases": [
          {
            "input": "add:bad\nadd:dad\nadd:mad\nsearch:pad\nsearch:bad\nsearch:.ad",
            "expectedOutput": "false\ntrue\ntrue"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Longest Word in Dictionary",
        "slug": "longest-word-dictionary",
        "difficulty": "easy",
        "category": "trie",
        "description": "Return the longest word in words that can be built one character at a time by other words in the array. If there is a tie, return the lexicographically smallest.",
        "examples": [
          {
            "input": "words = [\"w\",\"wo\",\"wor\",\"worl\",\"world\"]",
            "output": "\"world\""
          },
          {
            "input": "words = [\"a\",\"banana\",\"app\",\"appl\",\"ap\",\"apply\",\"apple\"]",
            "output": "\"apple\""
          }
        ],
        "constraints": [
          "1 <= words.length <= 1000",
          "1 <= words[i].length <= 30"
        ],
        "hints": [
          "Sort words first",
          "Add to trie only when all prefixes already exist in trie",
          "Track the longest valid word found"
        ],
        "tags": [
          "trie",
          "string",
          "sorting"
        ],
        "js": "function longestWord(words) {\n  // your code here\n}",
        "py": "def longest_word(words):\n    pass",
        "testCases": [
          {
            "input": "[\"w\",\"wo\",\"wor\",\"worl\",\"world\"]",
            "expectedOutput": "world"
          },
          {
            "input": "[\"a\",\"banana\",\"app\",\"appl\",\"ap\",\"apply\",\"apple\"]",
            "expectedOutput": "apple"
          }
        ],
        "xpReward": 60
      },
      {
        "title": "Word Search II",
        "slug": "word-search-ii",
        "difficulty": "hard",
        "category": "trie",
        "description": "Given a 2D board and a list of words, return all words that can be found in the board. Words can be formed by sequentially adjacent cells (horizontally or vertically), each cell used at most once.",
        "examples": [
          {
            "input": "board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]",
            "output": "[\"eat\",\"oath\"]"
          }
        ],
        "constraints": [
          "1 <= m, n <= 12",
          "1 <= words.length <= 3*10^4"
        ],
        "hints": [
          "Build a trie from all words",
          "DFS from each cell, following trie paths",
          "Remove found words from trie to avoid duplicates"
        ],
        "tags": [
          "trie",
          "dfs",
          "backtracking"
        ],
        "js": "function findWords(board, words) {\n  // your code here\n}",
        "py": "def find_words(board, words):\n    pass",
        "testCases": [
          {
            "input": "[[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]]\n[\"oath\",\"pea\",\"eat\",\"rain\"]",
            "expectedOutput": "[\"eat\",\"oath\"]"
          }
        ],
        "xpReward": 130
      }
    ]
  },
  {
    "dayNumber": 19,
    "topic": "Advanced DP - Knapsack",
    "lesson": "0/1 Knapsack: dp[i][w] = max value using first i items with weight capacity w. Space optimize to 1D by traversing backwards. Each item used at most once. Unbounded: traverse forwards, items can repeat.",
    "problems": [
      {
        "title": "Partition Equal Subset Sum",
        "slug": "partition-equal-subset",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given an integer array nums, return true if you can partition it into two subsets with equal sum.",
        "examples": [
          {
            "input": "nums = [1,5,11,5]",
            "output": "true",
            "explanation": "[1,5,5] and [11]"
          },
          {
            "input": "nums = [1,2,3,5]",
            "output": "false"
          }
        ],
        "constraints": [
          "1 <= nums.length <= 200",
          "1 <= nums[i] <= 100"
        ],
        "hints": [
          "Find subset summing to totalSum/2 (0/1 knapsack)",
          "dp[j] = can we achieve sum j using elements so far",
          "Traverse j backwards when adding each element"
        ],
        "tags": [
          "dynamic-programming",
          "array"
        ],
        "js": "function canPartition(nums) {\n  // your code here\n}",
        "py": "def can_partition(nums):\n    pass",
        "testCases": [
          {
            "input": "[1,5,11,5]",
            "expectedOutput": "true"
          },
          {
            "input": "[1,2,3,5]",
            "expectedOutput": "false"
          },
          {
            "input": "[1,1]",
            "expectedOutput": "true",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Target Sum",
        "slug": "target-sum",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given nums and target, assign '+' or '-' to each number. Return the number of ways to reach target.",
        "examples": [
          {
            "input": "nums = [1,1,1,1,1], target = 3",
            "output": "5"
          }
        ],
        "constraints": [
          "1 <= nums.length <= 20",
          "0 <= nums[i] <= 1000",
          "-1000 <= target <= 1000"
        ],
        "hints": [
          "dp[sum + offset] = number of ways to reach sum",
          "Or convert: find subset P where sum(P)*2 - total = target"
        ],
        "tags": [
          "dynamic-programming",
          "backtracking"
        ],
        "js": "function findTargetSumWays(nums, target) {\n  // your code here\n}",
        "py": "def find_target_sum_ways(nums, target):\n    pass",
        "testCases": [
          {
            "input": "[1,1,1,1,1]\n3",
            "expectedOutput": "5"
          },
          {
            "input": "[1]\n1",
            "expectedOutput": "1"
          },
          {
            "input": "[1,0]\n1",
            "expectedOutput": "2",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Coin Change II",
        "slug": "coin-change-ii",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given coin denominations and an amount, return the number of combinations that make up that amount. You may use each coin unlimited times.",
        "examples": [
          {
            "input": "amount = 5, coins = [1,2,5]",
            "output": "4"
          },
          {
            "input": "amount = 3, coins = [2]",
            "output": "0"
          }
        ],
        "constraints": [
          "1 <= coins.length <= 300",
          "0 <= amount <= 5000"
        ],
        "hints": [
          "Unbounded knapsack: iterate coins in outer loop",
          "dp[j] += dp[j - coin] for each coin"
        ],
        "tags": [
          "dynamic-programming",
          "array"
        ],
        "js": "function change(amount, coins) {\n  // your code here\n}",
        "py": "def change(amount, coins):\n    pass",
        "testCases": [
          {
            "input": "5\n[1,2,5]",
            "expectedOutput": "4"
          },
          {
            "input": "3\n[2]",
            "expectedOutput": "0"
          },
          {
            "input": "10\n[10]",
            "expectedOutput": "1",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Last Stone Weight II",
        "slug": "last-stone-weight-ii",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "You can smash any two stones: result = |weight1 - weight2|. Return minimum possible weight of the last remaining stone (or 0).",
        "examples": [
          {
            "input": "stones = [2,7,4,1,8,1]",
            "output": "1"
          },
          {
            "input": "stones = [31,26,33,21,40]",
            "output": "5"
          }
        ],
        "constraints": [
          "1 <= stones.length <= 30",
          "1 <= stones[i] <= 100"
        ],
        "hints": [
          "Split stones into two groups minimizing |sum(A) - sum(B)|",
          "Knapsack: find max subset sum <= totalSum/2",
          "Answer = totalSum - 2 * maxSubsetSum"
        ],
        "tags": [
          "dynamic-programming",
          "array"
        ],
        "js": "function lastStoneWeightII(stones) {\n  // your code here\n}",
        "py": "def last_stone_weight_ii(stones):\n    pass",
        "testCases": [
          {
            "input": "[2,7,4,1,8,1]",
            "expectedOutput": "1"
          },
          {
            "input": "[31,26,33,21,40]",
            "expectedOutput": "5"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Ones and Zeroes",
        "slug": "ones-and-zeroes",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given binary strings and limits m zeros and n ones, find the largest subset of strs using at most m 0s and n 1s.",
        "examples": [
          {
            "input": "strs = [\"10\",\"0001\",\"111001\",\"1\",\"0\"], m = 5, n = 3",
            "output": "4"
          }
        ],
        "constraints": [
          "1 <= strs.length <= 600",
          "0 <= m, n <= 100"
        ],
        "hints": [
          "2D knapsack: dp[i][j] = max strings with at most i zeros and j ones",
          "Update dp backwards for each string"
        ],
        "tags": [
          "dynamic-programming",
          "string"
        ],
        "js": "function findMaxForm(strs, m, n) {\n  // your code here\n}",
        "py": "def find_max_form(strs, m, n):\n    pass",
        "testCases": [
          {
            "input": "[\"10\",\"0001\",\"111001\",\"1\",\"0\"]\n5\n3",
            "expectedOutput": "4"
          },
          {
            "input": "[\"10\",\"0\",\"1\"]\n1\n1",
            "expectedOutput": "2"
          }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 20,
    "topic": "Advanced DP - Strings",
    "lesson": "String DP uses a 2D table where dp[i][j] = answer for substrings ending at indices i and j. LCS, Edit Distance, and Palindrome problems all use this pattern. Key recurrence: if chars equal use diagonal; else use min/max of adjacent.",
    "problems": [
      {
        "title": "Longest Common Subsequence",
        "slug": "longest-common-subsequence",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is formed by deleting some characters without changing relative order.",
        "examples": [
          {
            "input": "text1 = \"abcde\", text2 = \"ace\"",
            "output": "3",
            "explanation": "LCS is \"ace\""
          },
          {
            "input": "text1 = \"abc\", text2 = \"abc\"",
            "output": "3"
          }
        ],
        "constraints": [
          "1 <= text1.length, text2.length <= 1000"
        ],
        "hints": [
          "dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]",
          "Chars match: dp[i][j] = dp[i-1][j-1] + 1",
          "Chars differ: dp[i][j] = max(dp[i-1][j], dp[i][j-1])"
        ],
        "tags": [
          "dynamic-programming",
          "string"
        ],
        "js": "function longestCommonSubsequence(text1, text2) {\n  // your code here\n}",
        "py": "def longest_common_subsequence(text1, text2):\n    pass",
        "testCases": [
          {
            "input": "abcde\nace",
            "expectedOutput": "3"
          },
          {
            "input": "abc\nabc",
            "expectedOutput": "3"
          },
          {
            "input": "abc\ndef",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Edit Distance",
        "slug": "edit-distance",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2.",
        "examples": [
          {
            "input": "word1 = \"horse\", word2 = \"ros\"",
            "output": "3",
            "explanation": "horse -> rorse -> rose -> ros"
          },
          {
            "input": "word1 = \"intention\", word2 = \"execution\"",
            "output": "5"
          }
        ],
        "constraints": [
          "0 <= word1.length, word2.length <= 500"
        ],
        "hints": [
          "dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]",
          "Chars equal: dp[i][j] = dp[i-1][j-1]",
          "Chars differ: 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])"
        ],
        "tags": [
          "dynamic-programming",
          "string"
        ],
        "js": "function minDistance(word1, word2) {\n  // your code here\n}",
        "py": "def min_distance(word1, word2):\n    pass",
        "testCases": [
          {
            "input": "horse\nros",
            "expectedOutput": "3"
          },
          {
            "input": "intention\nexecution",
            "expectedOutput": "5"
          },
          {
            "input": "\na",
            "expectedOutput": "1",
            "isHidden": true
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Longest Palindromic Subsequence",
        "slug": "longest-palindromic-subsequence",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given a string s, find the length of the longest palindromic subsequence.",
        "examples": [
          {
            "input": "s = \"bbbab\"",
            "output": "4",
            "explanation": "\"bbbb\""
          },
          {
            "input": "s = \"cbbd\"",
            "output": "2"
          }
        ],
        "constraints": [
          "1 <= s.length <= 1000"
        ],
        "hints": [
          "LPS(s) = LCS(s, reverse(s))",
          "Or dp[i][j] = LPS of s[i..j]"
        ],
        "tags": [
          "dynamic-programming",
          "string"
        ],
        "js": "function longestPalindromeSubseq(s) {\n  // your code here\n}",
        "py": "def longest_palindrome_subseq(s):\n    pass",
        "testCases": [
          {
            "input": "bbbab",
            "expectedOutput": "4"
          },
          {
            "input": "cbbd",
            "expectedOutput": "2"
          },
          {
            "input": "a",
            "expectedOutput": "1",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Palindromic Substrings",
        "slug": "palindromic-substrings",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given a string s, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters.",
        "examples": [
          {
            "input": "s = \"abc\"",
            "output": "3",
            "explanation": "\"a\", \"b\", \"c\""
          },
          {
            "input": "s = \"aaa\"",
            "output": "6",
            "explanation": "\"a\", \"a\", \"a\", \"aa\", \"aa\", \"aaa\""
          }
        ],
        "constraints": [
          "1 <= s.length <= 1000"
        ],
        "hints": [
          "Expand around center: for each position try odd and even length palindromes",
          "Count valid expansions"
        ],
        "tags": [
          "dynamic-programming",
          "string",
          "two-pointers"
        ],
        "js": "function countSubstrings(s) {\n  // your code here\n}",
        "py": "def count_substrings(s):\n    pass",
        "testCases": [
          {
            "input": "abc",
            "expectedOutput": "3"
          },
          {
            "input": "aaa",
            "expectedOutput": "6"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Distinct Subsequences",
        "slug": "distinct-subsequences",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Given strings s and t, return the number of distinct subsequences of s which equals t.",
        "examples": [
          {
            "input": "s = \"rabbbit\", t = \"rabbit\"",
            "output": "3"
          },
          {
            "input": "s = \"babgbag\", t = \"bag\"",
            "output": "5"
          }
        ],
        "constraints": [
          "1 <= s.length, t.length <= 1000"
        ],
        "hints": [
          "dp[i][j] = ways to form t[0..j-1] from s[0..i-1]",
          "If s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]",
          "Else: dp[i][j] = dp[i-1][j]"
        ],
        "tags": [
          "dynamic-programming",
          "string"
        ],
        "js": "function numDistinct(s, t) {\n  // your code here\n}",
        "py": "def num_distinct(s, t):\n    pass",
        "testCases": [
          {
            "input": "rabbbit\nrabbit",
            "expectedOutput": "3"
          },
          {
            "input": "babgbag\nbag",
            "expectedOutput": "5"
          }
        ],
        "xpReward": 110
      }
    ]
  }
];


export async function GET() {
  try {
    let inserted = 0;

    // Delete ALL existing problems for days 16-20 first (including any old placeholders)
    for (const dayNum of [16, 17, 18, 19, 20]) {
      await db.delete(codingChallenges).where(eq(codingChallenges.dayNumber, dayNum));
    }

    for (const day of DAYS_DATA) {
      for (const p of day.problems) {
        await db.insert(codingChallenges).values({
          dayNumber:   day.dayNumber,
          title:       p.title,
          slug:        p.slug,
          difficulty:  p.difficulty as any,
          category:    p.category,
          description: p.description,
          examples:    p.examples,
          constraints: p.constraints,
          hints:       p.hints,
          tags:        p.tags,
          starterCode: { javascript: p.js, typescript: p.js, python: p.py, java: "class Solution {\n    // implement here\n}", cpp: "#include <bits/stdc++.h>\nusing namespace std;\n// implement here", c: "#include <stdio.h>\n// implement here" },
          testCases:   p.testCases,
          xpReward:    p.xpReward,
          source:      "custom",
          externalUrl: null,
          cfRating:    null,
        }).onConflictDoUpdate({
          target: codingChallenges.slug,
          set: {
            dayNumber:   day.dayNumber,
            title:       p.title,
            difficulty:  p.difficulty as any,
            category:    p.category,
            description: p.description,
            examples:    p.examples,
            constraints: p.constraints,
            hints:       p.hints,
            tags:        p.tags,
            starterCode: { javascript: p.js, typescript: p.js, python: p.py, java: "class Solution {\n    // implement here\n}", cpp: "#include <bits/stdc++.h>\nusing namespace std;\n// implement here", c: "#include <stdio.h>\n// implement here" },
            testCases:   p.testCases,
            xpReward:    p.xpReward,
          },
        });
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Days 16-20 seeded successfully: ${inserted} problems inserted`,
      inserted,
    });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}