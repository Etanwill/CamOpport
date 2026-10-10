// src/app/api/code/seed-days-31-40/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 31,
    "topic": "Prefix Sum & Difference Array",
    "lesson": "Prefix sum: prefixSum[i]=arr[0]+...+arr[i-1]. Range sum [l,r]=prefixSum[r+1]-prefixSum[l]. Combine with hashmap for subarray problems. Difference array enables O(1) range updates.",
    "problems": [
      {
        "title": "Subarray Sum Equals K",
        "slug": "subarray-sum-equals-k",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Given integer array nums and integer k, return total number of subarrays whose sum equals k.",
        "examples": [
          {
            "input": "nums=[1,1,1],k=2",
            "output": "2"
          },
          {
            "input": "nums=[1,2,3],k=3",
            "output": "2"
          }
        ],
        "constraints": [
          "1<=nums.length<=2*10^4",
          "-1000<=nums[i]<=1000"
        ],
        "hints": [
          "Prefix sum + hashmap",
          "For each prefix sum, count how many previous sums equal currentSum-k"
        ],
        "tags": [
          "prefix-sum",
          "hash-table",
          "array"
        ],
        "js": "function subarraySum(nums, k) {\n  // your code here\n}",
        "py": "def subarray_sum(nums, k):\n    pass",
        "testCases": [
          {
            "input": "[1,1,1]\n2",
            "expectedOutput": "2"
          },
          {
            "input": "[1,2,3]\n3",
            "expectedOutput": "2"
          },
          {
            "input": "[-1,-1,1]\n0",
            "expectedOutput": "1",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Product of Array Except Self",
        "slug": "product-except-self",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return array where answer[i] is product of all elements except nums[i]. O(n) time, no division.",
        "examples": [
          {
            "input": "nums=[1,2,3,4]",
            "output": "[24,12,8,6]"
          },
          {
            "input": "nums=[-1,1,0,-3,3]",
            "output": "[0,0,9,0,0]"
          }
        ],
        "constraints": [
          "2<=nums.length<=10^5"
        ],
        "hints": [
          "Left pass: prefix products",
          "Right pass: multiply by suffix product running variable"
        ],
        "tags": [
          "prefix-sum",
          "array"
        ],
        "js": "function productExceptSelf(nums) {\n  // your code here\n}",
        "py": "def product_except_self(nums):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3,4]",
            "expectedOutput": "[24,12,8,6]"
          },
          {
            "input": "[-1,1,0,-3,3]",
            "expectedOutput": "[0,0,9,0,0]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Find Pivot Index",
        "slug": "find-pivot-index",
        "difficulty": "easy",
        "category": "prefix-sum",
        "description": "Return leftmost pivot index where sum of elements to left equals sum to right. Return -1 if none.",
        "examples": [
          {
            "input": "nums=[1,7,3,6,5,6]",
            "output": "3"
          },
          {
            "input": "nums=[1,2,3]",
            "output": "-1"
          }
        ],
        "constraints": [
          "1<=nums.length<=10^4"
        ],
        "hints": [
          "leftSum*2 + nums[i] == totalSum"
        ],
        "tags": [
          "prefix-sum",
          "array"
        ],
        "js": "function pivotIndex(nums) {\n  // your code here\n}",
        "py": "def pivot_index(nums):\n    pass",
        "testCases": [
          {
            "input": "[1,7,3,6,5,6]",
            "expectedOutput": "3"
          },
          {
            "input": "[1,2,3]",
            "expectedOutput": "-1"
          },
          {
            "input": "[2,1,-1]",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 50
      },
      {
        "title": "Continuous Subarray Sum",
        "slug": "continuous-subarray-sum",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return true if nums has a subarray of length >= 2 whose sum is a multiple of k.",
        "examples": [
          {
            "input": "nums=[23,2,4,6,7],k=6",
            "output": "true"
          },
          {
            "input": "nums=[23,2,6,4,7],k=6",
            "output": "true"
          }
        ],
        "constraints": [
          "1<=nums.length<=10^5",
          "0<k<=2^31-1"
        ],
        "hints": [
          "Prefix sum mod k: same remainder at index j and i with i>j+1 means valid subarray",
          "HashMap: remainder -> first index; init {0:-1}"
        ],
        "tags": [
          "prefix-sum",
          "hash-table",
          "array"
        ],
        "js": "function checkSubarraySum(nums, k) {\n  // your code here\n}",
        "py": "def check_subarray_sum(nums, k):\n    pass",
        "testCases": [
          {
            "input": "[23,2,4,6,7]\n6",
            "expectedOutput": "true"
          },
          {
            "input": "[23,2,6,4,7]\n6",
            "expectedOutput": "true"
          },
          {
            "input": "[1,0]\n2",
            "expectedOutput": "false",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Maximum Size Subarray Sum Equals K",
        "slug": "max-size-subarray-sum-k",
        "difficulty": "medium",
        "category": "prefix-sum",
        "description": "Return the maximum length of a subarray that sums to k. Return 0 if none.",
        "examples": [
          {
            "input": "nums=[1,-1,5,-2,3],k=3",
            "output": "4"
          },
          {
            "input": "nums=[-2,-1,2,1],k=1",
            "output": "2"
          }
        ],
        "constraints": [
          "1<=nums.length<=2*10^5",
          "-10^4<=nums[i]<=10^4"
        ],
        "hints": [
          "HashMap: prefix sum -> earliest index",
          "For each i, check if prefixSum[i]-k exists in map; length = i - map[prefixSum[i]-k]"
        ],
        "tags": [
          "prefix-sum",
          "hash-table",
          "array"
        ],
        "js": "function maxSubArrayLen(nums, k) {\n  // your code here\n}",
        "py": "def max_sub_array_len(nums, k):\n    pass",
        "testCases": [
          {
            "input": "[1,-1,5,-2,3]\n3",
            "expectedOutput": "4"
          },
          {
            "input": "[-2,-1,2,1]\n1",
            "expectedOutput": "2"
          }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 32,
    "topic": "Matrix Problems",
    "lesson": "Matrix traversal: dx=[0,0,1,-1], dy=[1,-1,0,0] for 4 directions. Spiral: peel layers. Rotate 90 degrees: transpose then reverse rows. For island problems: DFS/BFS marking visited. Bounds check: 0<=r<rows && 0<=c<cols.",
    "problems": [
      {
        "title": "Rotate Image",
        "slug": "rotate-image",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Given n x n matrix, rotate 90 degrees clockwise in-place.",
        "examples": [
          {
            "input": "matrix=[[1,2,3],[4,5,6],[7,8,9]]",
            "output": "[[7,4,1],[8,5,2],[9,6,3]]"
          }
        ],
        "constraints": [
          "1<=n<=20"
        ],
        "hints": [
          "Step 1: Transpose (swap [i][j] with [j][i])",
          "Step 2: Reverse each row"
        ],
        "tags": [
          "matrix",
          "array",
          "math"
        ],
        "js": "function rotate(matrix) {\n  // modify in-place\n}",
        "py": "def rotate(matrix):\n    pass",
        "testCases": [
          {
            "input": "[[1,2,3],[4,5,6],[7,8,9]]",
            "expectedOutput": "[[7,4,1],[8,5,2],[9,6,3]]"
          },
          {
            "input": "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
            "expectedOutput": "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Spiral Matrix",
        "slug": "spiral-matrix",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Given m x n matrix, return all elements in spiral order.",
        "examples": [
          {
            "input": "matrix=[[1,2,3],[4,5,6],[7,8,9]]",
            "output": "[1,2,3,6,9,8,7,4,5]"
          },
          {
            "input": "matrix=[[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
            "output": "[1,2,3,4,8,12,11,10,9,5,6,7]"
          }
        ],
        "constraints": [
          "1<=m,n<=10"
        ],
        "hints": [
          "Maintain top,bottom,left,right boundaries",
          "Traverse right->down->left->up, shrink boundaries"
        ],
        "tags": [
          "matrix",
          "array"
        ],
        "js": "function spiralOrder(matrix) {\n  // your code here\n}",
        "py": "def spiral_order(matrix):\n    pass",
        "testCases": [
          {
            "input": "[[1,2,3],[4,5,6],[7,8,9]]",
            "expectedOutput": "[1,2,3,6,9,8,7,4,5]"
          },
          {
            "input": "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
            "expectedOutput": "[1,2,3,4,8,12,11,10,9,5,6,7]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Set Matrix Zeroes",
        "slug": "set-matrix-zeroes",
        "difficulty": "medium",
        "category": "matrix",
        "description": "If element is 0, set its entire row and column to 0. Do it in-place.",
        "examples": [
          {
            "input": "matrix=[[1,1,1],[1,0,1],[1,1,1]]",
            "output": "[[1,0,1],[0,0,0],[1,0,1]]"
          },
          {
            "input": "matrix=[[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
            "output": "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]"
          }
        ],
        "constraints": [
          "1<=m,n<=200"
        ],
        "hints": [
          "Use first row and column as markers",
          "Handle first row/column separately"
        ],
        "tags": [
          "matrix",
          "array"
        ],
        "js": "function setZeroes(matrix) {\n  // modify in-place\n}",
        "py": "def set_zeroes(matrix):\n    pass",
        "testCases": [
          {
            "input": "[[1,1,1],[1,0,1],[1,1,1]]",
            "expectedOutput": "[[1,0,1],[0,0,0],[1,0,1]]"
          },
          {
            "input": "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
            "expectedOutput": "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Word Search",
        "slug": "word-search",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Return true if word exists in board as a path of adjacent cells. Each cell used at most once per path.",
        "examples": [
          {
            "input": "board=[[A,B,C,E],[S,F,C,S],[A,D,E,E]]\nword=ABCCED",
            "output": "true"
          },
          {
            "input": "board=[[A,B,C,E],[S,F,C,S],[A,D,E,E]]\nword=ABCB",
            "output": "false"
          }
        ],
        "constraints": [
          "1<=m,n<=6",
          "1<=word.length<=15"
        ],
        "hints": [
          "DFS from each matching cell",
          "Temporarily mark visited then restore after backtracking"
        ],
        "tags": [
          "matrix",
          "dfs",
          "backtracking"
        ],
        "js": "function exist(board, word) {\n  // your code here\n}",
        "py": "def exist(board, word):\n    pass",
        "testCases": [
          {
            "input": "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCCED",
            "expectedOutput": "true"
          },
          {
            "input": "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCB",
            "expectedOutput": "false"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Pacific Atlantic Water Flow",
        "slug": "pacific-atlantic-water-flow",
        "difficulty": "medium",
        "category": "matrix",
        "description": "Return all cells from which water can flow to both Pacific (top/left) and Atlantic (bottom/right) oceans.",
        "examples": [
          {
            "input": "heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
            "output": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"
          }
        ],
        "constraints": [
          "1<=m,n<=200"
        ],
        "hints": [
          "BFS from Pacific borders AND Atlantic borders separately (flow uphill)",
          "Intersect the two reachable sets"
        ],
        "tags": [
          "matrix",
          "dfs",
          "bfs"
        ],
        "js": "function pacificAtlantic(heights) {\n  // your code here\n}",
        "py": "def pacific_atlantic(heights):\n    pass",
        "testCases": [
          {
            "input": "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
            "expectedOutput": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"
          }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 33,
    "topic": "Advanced String Problems",
    "lesson": "Sliding window for substring problems: expand right, shrink left. Rabin-Karp O(n) average hashing. KMP O(n+m). For interviews: clarify case-sensitivity. String + hashmap = frequency counting.",
    "problems": [
      {
        "title": "Minimum Window Substring",
        "slug": "minimum-window-substring",
        "difficulty": "hard",
        "category": "sliding-window",
        "description": "Return the minimum window in s containing all characters of t (including duplicates). Return empty string if impossible.",
        "examples": [
          {
            "input": "s=ADOBECODEBANC,t=ABC",
            "output": "BANC"
          },
          {
            "input": "s=a,t=a",
            "output": "a"
          },
          {
            "input": "s=a,t=aa",
            "output": ""
          }
        ],
        "constraints": [
          "1<=m,n<=10^5"
        ],
        "hints": [
          "Expand right until all t chars covered",
          "Shrink left while still valid",
          "Use frequency map and satisfied counter"
        ],
        "tags": [
          "sliding-window",
          "string",
          "hash-table"
        ],
        "js": "function minWindow(s, t) {\n  // your code here\n}",
        "py": "def min_window(s, t):\n    pass",
        "testCases": [
          {
            "input": "ADOBECODEBANC\nABC",
            "expectedOutput": "BANC"
          },
          {
            "input": "a\na",
            "expectedOutput": "a"
          },
          {
            "input": "a\naa",
            "expectedOutput": "",
            "isHidden": true
          }
        ],
        "xpReward": 120
      },
      {
        "title": "Longest Repeating Character Replacement",
        "slug": "longest-repeating-char-replace",
        "difficulty": "medium",
        "category": "sliding-window",
        "description": "With at most k replacements, return length of longest all-same-letter substring.",
        "examples": [
          {
            "input": "s=ABAB,k=2",
            "output": "4"
          },
          {
            "input": "s=AABABBA,k=1",
            "output": "4"
          }
        ],
        "constraints": [
          "1<=s.length<=10^5",
          "0<=k<=s.length"
        ],
        "hints": [
          "Window valid if windowSize - maxFrequency <= k",
          "Shrink left when invalid"
        ],
        "tags": [
          "sliding-window",
          "string"
        ],
        "js": "function characterReplacement(s, k) {\n  // your code here\n}",
        "py": "def character_replacement(s, k):\n    pass",
        "testCases": [
          {
            "input": "ABAB\n2",
            "expectedOutput": "4"
          },
          {
            "input": "AABABBA\n1",
            "expectedOutput": "4"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "String to Integer (atoi)",
        "slug": "string-to-integer-atoi",
        "difficulty": "medium",
        "category": "string",
        "description": "Implement atoi: handle whitespace, optional sign, digits, non-digit stop, and clamp to [-2^31, 2^31-1].",
        "examples": [
          {
            "input": "s=42",
            "output": "42"
          },
          {
            "input": "s=   -42",
            "output": "-42"
          },
          {
            "input": "s=4193 with words",
            "output": "4193"
          }
        ],
        "constraints": [
          "0<=s.length<=200"
        ],
        "hints": [
          "Skip whitespace, read sign, read digits, clamp"
        ],
        "tags": [
          "string",
          "math"
        ],
        "js": "function myAtoi(s) {\n  // your code here\n}",
        "py": "def my_atoi(s):\n    pass",
        "testCases": [
          {
            "input": "42",
            "expectedOutput": "42"
          },
          {
            "input": "   -42",
            "expectedOutput": "-42"
          },
          {
            "input": "4193 with words",
            "expectedOutput": "4193"
          },
          {
            "input": "-91283472332",
            "expectedOutput": "-2147483648",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "ZigZag Conversion",
        "slug": "zigzag-conversion",
        "difficulty": "medium",
        "category": "string",
        "description": "Write string in zigzag pattern on numRows rows, read row by row.",
        "examples": [
          {
            "input": "s=PAYPALISHIRING,numRows=3",
            "output": "PAHNAPLSIIGYIR"
          },
          {
            "input": "s=PAYPALISHIRING,numRows=4",
            "output": "PINALSIGYAHRPI"
          }
        ],
        "constraints": [
          "1<=s.length<=1000",
          "1<=numRows<=1000"
        ],
        "hints": [
          "numRows string buffers, track row and direction",
          "Direction flips at row 0 and row numRows-1"
        ],
        "tags": [
          "string"
        ],
        "js": "function convert(s, numRows) {\n  // your code here\n}",
        "py": "def convert(s, num_rows):\n    pass",
        "testCases": [
          {
            "input": "PAYPALISHIRING\n3",
            "expectedOutput": "PAHNAPLSIIGYIR"
          },
          {
            "input": "PAYPALISHIRING\n4",
            "expectedOutput": "PINALSIGYAHRPI"
          },
          {
            "input": "A\n1",
            "expectedOutput": "A",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Count and Say",
        "slug": "count-and-say",
        "difficulty": "medium",
        "category": "string",
        "description": "Count-and-say sequence: 1,11,21,1211,111221. Each term describes the previous. Return the nth term.",
        "examples": [
          {
            "input": "n=1",
            "output": "1"
          },
          {
            "input": "n=4",
            "output": "1211"
          }
        ],
        "constraints": [
          "1<=n<=30"
        ],
        "hints": [
          "Iterate n times, each step describing runs of digits in previous term"
        ],
        "tags": [
          "string"
        ],
        "js": "function countAndSay(n) {\n  // your code here\n}",
        "py": "def count_and_say(n):\n    pass",
        "testCases": [
          {
            "input": "1",
            "expectedOutput": "1"
          },
          {
            "input": "4",
            "expectedOutput": "1211"
          },
          {
            "input": "6",
            "expectedOutput": "312211",
            "isHidden": true
          }
        ],
        "xpReward": 60
      }
    ]
  },
  {
    "dayNumber": 34,
    "topic": "Two Pointers Advanced",
    "lesson": "Two pointer patterns: (1) opposite ends \u2014 sort then converge. (2) Fast/slow \u2014 cycle detection. (3) Sliding window \u2014 valid range. (4) Merge \u2014 combine sorted. Sort first for most patterns.",
    "problems": [
      {
        "title": "Container With Most Water",
        "slug": "container-most-water",
        "difficulty": "medium",
        "category": "two-pointers",
        "description": "Given heights of vertical lines, find two that form the container holding most water.",
        "examples": [
          {
            "input": "height=[1,8,6,2,5,4,8,3,7]",
            "output": "49"
          },
          {
            "input": "height=[1,1]",
            "output": "1"
          }
        ],
        "constraints": [
          "2<=n<=10^5"
        ],
        "hints": [
          "Start widest (l=0, r=n-1)",
          "Move pointer with smaller height inward"
        ],
        "tags": [
          "two-pointers",
          "array",
          "greedy"
        ],
        "js": "function maxArea(height) {\n  // your code here\n}",
        "py": "def max_area(height):\n    pass",
        "testCases": [
          {
            "input": "[1,8,6,2,5,4,8,3,7]",
            "expectedOutput": "49"
          },
          {
            "input": "[1,1]",
            "expectedOutput": "1"
          },
          {
            "input": "[4,3,2,1,4]",
            "expectedOutput": "16",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "4Sum",
        "slug": "four-sum",
        "difficulty": "medium",
        "category": "two-pointers",
        "description": "Return all unique quadruplets in nums that sum to target.",
        "examples": [
          {
            "input": "nums=[1,0,-1,0,-2,2],target=0",
            "output": "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]"
          },
          {
            "input": "nums=[2,2,2,2,2],target=8",
            "output": "[[2,2,2,2]]"
          }
        ],
        "constraints": [
          "1<=nums.length<=200"
        ],
        "hints": [
          "Sort; fix two with nested loops; two pointers for rest",
          "Skip duplicates at each level"
        ],
        "tags": [
          "two-pointers",
          "array",
          "sorting"
        ],
        "js": "function fourSum(nums, target) {\n  // your code here\n}",
        "py": "def four_sum(nums, target):\n    pass",
        "testCases": [
          {
            "input": "[1,0,-1,0,-2,2]\n0",
            "expectedOutput": "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]"
          },
          {
            "input": "[2,2,2,2,2]\n8",
            "expectedOutput": "[[2,2,2,2]]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "3Sum Closest",
        "slug": "three-sum-closest",
        "difficulty": "medium",
        "category": "two-pointers",
        "description": "Find three integers whose sum is closest to target. Return that sum.",
        "examples": [
          {
            "input": "nums=[-1,2,1,-4],target=1",
            "output": "2"
          },
          {
            "input": "nums=[0,0,0],target=1",
            "output": "0"
          }
        ],
        "constraints": [
          "3<=nums.length<=500"
        ],
        "hints": [
          "Sort; fix one, two pointers for rest",
          "Track closest sum; move pointers toward target"
        ],
        "tags": [
          "two-pointers",
          "array",
          "sorting"
        ],
        "js": "function threeSumClosest(nums, target) {\n  // your code here\n}",
        "py": "def three_sum_closest(nums, target):\n    pass",
        "testCases": [
          {
            "input": "[-1,2,1,-4]\n1",
            "expectedOutput": "2"
          },
          {
            "input": "[0,0,0]\n1",
            "expectedOutput": "0"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Boats to Save People",
        "slug": "boats-save-people",
        "difficulty": "medium",
        "category": "two-pointers",
        "description": "Each boat carries at most 2 people within weight limit. Return minimum number of boats.",
        "examples": [
          {
            "input": "people=[1,2],limit=3",
            "output": "1"
          },
          {
            "input": "people=[3,2,2,1],limit=3",
            "output": "3"
          },
          {
            "input": "people=[3,5,3,4],limit=5",
            "output": "4"
          }
        ],
        "constraints": [
          "1<=people.length<=5*10^4"
        ],
        "hints": [
          "Sort; pair heaviest with lightest if they fit; else heaviest goes alone"
        ],
        "tags": [
          "two-pointers",
          "greedy",
          "sorting"
        ],
        "js": "function numRescueBoats(people, limit) {\n  // your code here\n}",
        "py": "def num_rescue_boats(people, limit):\n    pass",
        "testCases": [
          {
            "input": "[1,2]\n3",
            "expectedOutput": "1"
          },
          {
            "input": "[3,2,2,1]\n3",
            "expectedOutput": "3"
          },
          {
            "input": "[3,5,3,4]\n5",
            "expectedOutput": "4"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Longest Substring with At Most K Distinct Characters",
        "slug": "longest-substring-k-distinct",
        "difficulty": "medium",
        "category": "two-pointers",
        "description": "Return length of longest substring with at most k distinct characters.",
        "examples": [
          {
            "input": "s=eceba,k=2",
            "output": "3"
          },
          {
            "input": "s=aa,k=1",
            "output": "2"
          }
        ],
        "constraints": [
          "1<=s.length<=5*10^4",
          "0<=k<=50"
        ],
        "hints": [
          "Sliding window with frequency hashmap",
          "When distinct chars > k, shrink left"
        ],
        "tags": [
          "two-pointers",
          "sliding-window",
          "string",
          "hash-table"
        ],
        "js": "function lengthOfLongestSubstringKDistinct(s, k) {\n  // your code here\n}",
        "py": "def length_of_longest_substring_k_distinct(s, k):\n    pass",
        "testCases": [
          {
            "input": "eceba\n2",
            "expectedOutput": "3"
          },
          {
            "input": "aa\n1",
            "expectedOutput": "2"
          },
          {
            "input": "a\n0",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 35,
    "topic": "Advanced Linked List",
    "lesson": "Advanced linked list: reverse in groups, Floyd's cycle detection (reset pointer to head when fast meets slow, they meet at entry). Deep copy with hashmap. Dummy head node simplifies edge cases. Fast/slow pointers solve most problems.",
    "problems": [
      {
        "title": "Reverse Nodes in k-Group",
        "slug": "reverse-nodes-k-group",
        "difficulty": "hard",
        "category": "linked-list",
        "description": "Reverse nodes k at a time. If remaining nodes are fewer than k, leave them as-is.",
        "examples": [
          {
            "input": "head=[1,2,3,4,5],k=2",
            "output": "[2,1,4,3,5]"
          },
          {
            "input": "head=[1,2,3,4,5],k=3",
            "output": "[3,2,1,4,5]"
          }
        ],
        "constraints": [
          "1<=k<=n<=5000"
        ],
        "hints": [
          "Count k nodes ahead; fewer than k -> stop",
          "Reverse k nodes, connect to next group recursively"
        ],
        "tags": [
          "linked-list",
          "recursion"
        ],
        "js": "function reverseKGroup(head, k) {\n  // your code here\n}",
        "py": "def reverse_k_group(head, k):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3,4,5]\n2",
            "expectedOutput": "[2,1,4,3,5]"
          },
          {
            "input": "[1,2,3,4,5]\n3",
            "expectedOutput": "[3,2,1,4,5]"
          },
          {
            "input": "[1,2,3,4,5]\n1",
            "expectedOutput": "[1,2,3,4,5]",
            "isHidden": true
          }
        ],
        "xpReward": 120
      },
      {
        "title": "Reverse Linked List II",
        "slug": "reverse-linked-list-ii",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Reverse nodes from position left to right (1-indexed). Return the modified list.",
        "examples": [
          {
            "input": "head=[1,2,3,4,5],left=2,right=4",
            "output": "[1,4,3,2,5]"
          },
          {
            "input": "head=[5],left=1,right=1",
            "output": "[5]"
          }
        ],
        "constraints": [
          "1<=left<=right<=n<=500"
        ],
        "hints": [
          "Dummy head; find node before left",
          "Insert-at-front technique to reverse"
        ],
        "tags": [
          "linked-list"
        ],
        "js": "function reverseBetween(head, left, right) {\n  // your code here\n}",
        "py": "def reverse_between(head, left, right):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3,4,5]\n2\n4",
            "expectedOutput": "[1,4,3,2,5]"
          },
          {
            "input": "[5]\n1\n1",
            "expectedOutput": "[5]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Copy List with Random Pointer",
        "slug": "copy-list-random-pointer",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Each node has next and random pointer. Return a deep copy of the list.",
        "examples": [
          {
            "input": "head=[[7,null],[13,0],[11,4],[10,2],[1,0]]",
            "output": "[[7,null],[13,0],[11,4],[10,2],[1,0]]"
          }
        ],
        "constraints": [
          "0<=n<=1000"
        ],
        "hints": [
          "HashMap: original node -> copy",
          "Pass 1: create copies; Pass 2: set next and random"
        ],
        "tags": [
          "linked-list",
          "hash-table"
        ],
        "js": "function copyRandomList(head) {\n  // your code here\n}",
        "py": "def copy_random_list(head):\n    pass",
        "testCases": [
          {
            "input": "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
            "expectedOutput": "[[7,null],[13,0],[11,4],[10,2],[1,0]]"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Reorder List",
        "slug": "reorder-list",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Reorder L0->L1->...->Ln to L0->Ln->L1->Ln-1->L2->Ln-2->... in-place.",
        "examples": [
          {
            "input": "head=[1,2,3,4]",
            "output": "[1,4,2,3]"
          },
          {
            "input": "head=[1,2,3,4,5]",
            "output": "[1,5,2,4,3]"
          }
        ],
        "constraints": [
          "1<=n<=5*10^4"
        ],
        "hints": [
          "Find middle (fast/slow)",
          "Reverse second half",
          "Merge two halves alternately"
        ],
        "tags": [
          "linked-list",
          "two-pointers"
        ],
        "js": "function reorderList(head) {\n  // modify in-place\n}",
        "py": "def reorder_list(head):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3,4]",
            "expectedOutput": "[1,4,2,3]"
          },
          {
            "input": "[1,2,3,4,5]",
            "expectedOutput": "[1,5,2,4,3]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Linked List Cycle II",
        "slug": "linked-list-cycle-ii",
        "difficulty": "medium",
        "category": "linked-list",
        "description": "Return the node where the cycle begins, or null if no cycle.",
        "examples": [
          {
            "input": "head=[3,2,0,-4],pos=1",
            "output": "2"
          },
          {
            "input": "head=[1,2],pos=0",
            "output": "1"
          }
        ],
        "constraints": [
          "0<=n<=10^4"
        ],
        "hints": [
          "Floyd's: when fast meets slow, reset one pointer to head",
          "Move both at same pace; they meet at cycle entry"
        ],
        "tags": [
          "linked-list",
          "two-pointers"
        ],
        "js": "function detectCycle(head) {\n  // return node or null\n}",
        "py": "def detect_cycle(head):\n    pass",
        "testCases": [
          {
            "input": "[3,2,0,-4]\n1",
            "expectedOutput": "2"
          },
          {
            "input": "[1,2]\n0",
            "expectedOutput": "1"
          },
          {
            "input": "[1]\n-1",
            "expectedOutput": "null",
            "isHidden": true
          }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 36,
    "topic": "Advanced Trees",
    "lesson": "Diameter = max(leftHeight+rightHeight) per node. Path sum with prefix sums. Binary lifting for LCA in O(log n). Morris traversal: O(1) space inorder. Each node should return what its parent needs.",
    "problems": [
      {
        "title": "Diameter of Binary Tree",
        "slug": "diameter-binary-tree",
        "difficulty": "easy",
        "category": "tree",
        "description": "Return length of longest path between any two nodes in binary tree.",
        "examples": [
          {
            "input": "root=[1,2,3,4,5]",
            "output": "3"
          },
          {
            "input": "root=[1,2]",
            "output": "1"
          }
        ],
        "constraints": [
          "1<=nodes<=10^4"
        ],
        "hints": [
          "diameter at node = leftHeight + rightHeight",
          "Track global max during height recursion"
        ],
        "tags": [
          "tree",
          "dfs"
        ],
        "js": "function diameterOfBinaryTree(root) {\n  // your code here\n}",
        "py": "def diameter_of_binary_tree(root):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3,4,5]",
            "expectedOutput": "3"
          },
          {
            "input": "[1,2]",
            "expectedOutput": "1"
          }
        ],
        "xpReward": 60
      },
      {
        "title": "Binary Tree Maximum Path Sum",
        "slug": "binary-tree-max-path-sum",
        "difficulty": "hard",
        "category": "tree",
        "description": "Return the maximum path sum in binary tree. Path can start and end at any node.",
        "examples": [
          {
            "input": "root=[1,2,3]",
            "output": "6"
          },
          {
            "input": "root=[-10,9,20,null,null,15,7]",
            "output": "42"
          }
        ],
        "constraints": [
          "1<=nodes<=3*10^4",
          "-1000<=Node.val<=1000"
        ],
        "hints": [
          "maxGain at node = node.val + max(0,leftGain) + max(0,rightGain)",
          "Update global max; return node.val + max(0,leftGain,rightGain) to parent"
        ],
        "tags": [
          "tree",
          "dfs",
          "dynamic-programming"
        ],
        "js": "function maxPathSum(root) {\n  // your code here\n}",
        "py": "def max_path_sum(root):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3]",
            "expectedOutput": "6"
          },
          {
            "input": "[-10,9,20,null,null,15,7]",
            "expectedOutput": "42"
          }
        ],
        "xpReward": 120
      },
      {
        "title": "Construct Binary Tree from Preorder and Inorder",
        "slug": "construct-tree-preorder-inorder",
        "difficulty": "medium",
        "category": "tree",
        "description": "Given preorder and inorder arrays, construct and return the binary tree.",
        "examples": [
          {
            "input": "preorder=[3,9,20,15,7],inorder=[9,3,15,20,7]",
            "output": "[3,9,20,null,null,15,7]"
          }
        ],
        "constraints": [
          "1<=n<=3000",
          "All values unique"
        ],
        "hints": [
          "Root = preorder[0]; find in inorder to split left/right",
          "Hashmap for O(1) inorder lookup"
        ],
        "tags": [
          "tree",
          "hash-table",
          "divide-and-conquer"
        ],
        "js": "function buildTree(preorder, inorder) {\n  // your code here\n}",
        "py": "def build_tree(preorder, inorder):\n    pass",
        "testCases": [
          {
            "input": "[3,9,20,15,7]\n[9,3,15,20,7]",
            "expectedOutput": "[3,9,20,null,null,15,7]"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Binary Tree Right Side View",
        "slug": "binary-tree-right-side-view",
        "difficulty": "medium",
        "category": "tree",
        "description": "Return values visible from the right side of the tree (rightmost node per level).",
        "examples": [
          {
            "input": "root=[1,2,3,null,5,null,4]",
            "output": "[1,3,4]"
          },
          {
            "input": "root=[1,null,3]",
            "output": "[1,3]"
          }
        ],
        "constraints": [
          "0<=nodes<=100"
        ],
        "hints": [
          "BFS: last element of each level",
          "Or DFS: visit right before left; first at each depth is right-side view"
        ],
        "tags": [
          "tree",
          "bfs",
          "dfs"
        ],
        "js": "function rightSideView(root) {\n  // your code here\n}",
        "py": "def right_side_view(root):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3,null,5,null,4]",
            "expectedOutput": "[1,3,4]"
          },
          {
            "input": "[1,null,3]",
            "expectedOutput": "[1,3]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Path Sum III",
        "slug": "path-sum-iii",
        "difficulty": "medium",
        "category": "tree",
        "description": "Return number of downward paths in tree with sum equal to targetSum. Paths don't need to start/end at root/leaf.",
        "examples": [
          {
            "input": "root=[10,5,-3,3,2,null,11,3,-2,null,1],targetSum=8",
            "output": "3"
          },
          {
            "input": "root=[5,4,8,11,null,13,4,7,2,null,null,5,1],targetSum=22",
            "output": "3"
          }
        ],
        "constraints": [
          "0<=nodes<=1000",
          "-10^9<=Node.val<=10^9"
        ],
        "hints": [
          "Prefix sum + hashmap at each node",
          "Count previous prefix sums that differ by targetSum"
        ],
        "tags": [
          "tree",
          "prefix-sum",
          "dfs"
        ],
        "js": "function pathSum(root, targetSum) {\n  // your code here\n}",
        "py": "def path_sum(root, target_sum):\n    pass",
        "testCases": [
          {
            "input": "[10,5,-3,3,2,null,11,3,-2,null,1]\n8",
            "expectedOutput": "3"
          },
          {
            "input": "[5,4,8,11,null,13,4,7,2,null,null,5,1]\n22",
            "expectedOutput": "3"
          }
        ],
        "xpReward": 90
      }
    ]
  },
  {
    "dayNumber": 37,
    "topic": "BFS Advanced",
    "lesson": "BFS level by level. Multi-source BFS: start from all sources at once. Bidirectional BFS: meet in middle. First visit = shortest path in unweighted graphs. Mark visited before enqueuing to avoid revisiting.",
    "problems": [
      {
        "title": "Word Ladder",
        "slug": "word-ladder",
        "difficulty": "hard",
        "category": "graph",
        "description": "Return number of words in shortest transformation from beginWord to endWord. Each step changes one letter; every intermediate word must be in wordList.",
        "examples": [
          {
            "input": "beginWord=hit,endWord=cog,wordList=[hot,dot,dog,lot,log,cog]",
            "output": "5"
          },
          {
            "input": "beginWord=hit,endWord=cog,wordList=[hot,dot,dog,lot,log]",
            "output": "0"
          }
        ],
        "constraints": [
          "1<=beginWord.length<=10",
          "1<=wordList.length<=5000"
        ],
        "hints": [
          "BFS from beginWord",
          "Try changing each character to a-z; check if result in wordList set"
        ],
        "tags": [
          "graph",
          "bfs",
          "hash-table"
        ],
        "js": "function ladderLength(beginWord, endWord, wordList) {\n  // your code here\n}",
        "py": "def ladder_length(begin_word, end_word, word_list):\n    pass",
        "testCases": [
          {
            "input": "hit\ncog\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
            "expectedOutput": "5"
          },
          {
            "input": "hit\ncog\n[\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
            "expectedOutput": "0"
          }
        ],
        "xpReward": 120
      },
      {
        "title": "Rotting Oranges",
        "slug": "rotting-oranges",
        "difficulty": "medium",
        "category": "graph",
        "description": "Grid: 0=empty, 1=fresh, 2=rotten. Each minute rotten oranges rot adjacent fresh ones. Return min minutes until no fresh, or -1.",
        "examples": [
          {
            "input": "grid=[[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4"
          },
          {
            "input": "grid=[[2,1,1],[0,1,1],[1,0,1]]",
            "output": "-1"
          },
          {
            "input": "grid=[[0,2]]",
            "output": "0"
          }
        ],
        "constraints": [
          "1<=m,n<=10"
        ],
        "hints": [
          "Multi-source BFS from all initial rotten oranges",
          "Count fresh initially; decrement when rotted; -1 if any remain"
        ],
        "tags": [
          "graph",
          "bfs",
          "matrix"
        ],
        "js": "function orangesRotting(grid) {\n  // your code here\n}",
        "py": "def oranges_rotting(grid):\n    pass",
        "testCases": [
          {
            "input": "[[2,1,1],[1,1,0],[0,1,1]]",
            "expectedOutput": "4"
          },
          {
            "input": "[[2,1,1],[0,1,1],[1,0,1]]",
            "expectedOutput": "-1"
          },
          {
            "input": "[[0,2]]",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Open the Lock",
        "slug": "open-the-lock",
        "difficulty": "medium",
        "category": "graph",
        "description": "4-wheel lock 0-9 each. Given deadends and target, return minimum turns from 0000. Return -1 if impossible.",
        "examples": [
          {
            "input": "deadends=[0201,0101,0102,1212,2002],target=0202",
            "output": "6"
          },
          {
            "input": "deadends=[8888],target=0009",
            "output": "1"
          },
          {
            "input": "deadends=[0000],target=8888",
            "output": "-1"
          }
        ],
        "constraints": [
          "1<=deadends.length<=500"
        ],
        "hints": [
          "BFS; each state has 8 neighbors (4 wheels * 2 directions)",
          "Skip deadends and visited"
        ],
        "tags": [
          "graph",
          "bfs",
          "hash-table"
        ],
        "js": "function openLock(deadends, target) {\n  // your code here\n}",
        "py": "def open_lock(deadends, target):\n    pass",
        "testCases": [
          {
            "input": "[\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"]\n0202",
            "expectedOutput": "6"
          },
          {
            "input": "[\"8888\"]\n0009",
            "expectedOutput": "1"
          },
          {
            "input": "[\"0000\"]\n8888",
            "expectedOutput": "-1",
            "isHidden": true
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Jump Game III",
        "slug": "jump-game-iii",
        "difficulty": "medium",
        "category": "graph",
        "description": "From index i you can jump to i+arr[i] or i-arr[i]. Return true if you can reach any index with value 0.",
        "examples": [
          {
            "input": "arr=[4,2,3,0,3,1,2],start=5",
            "output": "true"
          },
          {
            "input": "arr=[4,2,3,0,3,1,2],start=0",
            "output": "true"
          },
          {
            "input": "arr=[3,0,2,1,2],start=2",
            "output": "false"
          }
        ],
        "constraints": [
          "1<=arr.length<=5*10^4"
        ],
        "hints": [
          "BFS/DFS from start",
          "Track visited to avoid cycles"
        ],
        "tags": [
          "graph",
          "bfs",
          "dfs",
          "array"
        ],
        "js": "function canReach(arr, start) {\n  // your code here\n}",
        "py": "def can_reach(arr, start):\n    pass",
        "testCases": [
          {
            "input": "[4,2,3,0,3,1,2]\n5",
            "expectedOutput": "true"
          },
          {
            "input": "[4,2,3,0,3,1,2]\n0",
            "expectedOutput": "true"
          },
          {
            "input": "[3,0,2,1,2]\n2",
            "expectedOutput": "false",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Bus Routes",
        "slug": "bus-routes",
        "difficulty": "hard",
        "category": "graph",
        "description": "Given bus routes and source/target stops, return minimum buses needed. Return -1 if impossible.",
        "examples": [
          {
            "input": "routes=[[1,2,7],[3,6,7]],source=1,target=6",
            "output": "2"
          },
          {
            "input": "routes=[[7,12],[4,5,15],[6],[15,19],[9,12,13]],source=15,target=12",
            "output": "-1"
          }
        ],
        "constraints": [
          "1<=routes.length<=500"
        ],
        "hints": [
          "BFS on buses not stops",
          "Map each stop to routes through it",
          "Explore all stops per route"
        ],
        "tags": [
          "graph",
          "bfs",
          "hash-table"
        ],
        "js": "function numBusesToDestination(routes, source, target) {\n  // your code here\n}",
        "py": "def num_buses_to_destination(routes, source, target):\n    pass",
        "testCases": [
          {
            "input": "[[1,2,7],[3,6,7]]\n1\n6",
            "expectedOutput": "2"
          },
          {
            "input": "[[7,12],[4,5,15],[6],[15,19],[9,12,13]]\n15\n12",
            "expectedOutput": "-1"
          }
        ],
        "xpReward": 110
      }
    ]
  },
  {
    "dayNumber": 38,
    "topic": "Greedy Advanced",
    "lesson": "Greedy: locally optimal -> globally optimal. Prove: greedy choice is in some optimal solution. Patterns: sort + scan, always pick most/least, scheduling. If greedy fails, use DP.",
    "problems": [
      {
        "title": "Jump Game II",
        "slug": "jump-game-ii",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Return minimum jumps to reach last index. nums[i] is max jump from index i.",
        "examples": [
          {
            "input": "nums=[2,3,1,1,4]",
            "output": "2"
          },
          {
            "input": "nums=[2,3,0,1,4]",
            "output": "2"
          }
        ],
        "constraints": [
          "1<=nums.length<=10^4",
          "Guaranteed reachable"
        ],
        "hints": [
          "Track current range end and farthest reachable",
          "When reaching curEnd, increment jumps, update curEnd to farthest"
        ],
        "tags": [
          "greedy",
          "array",
          "dynamic-programming"
        ],
        "js": "function jump(nums) {\n  // your code here\n}",
        "py": "def jump(nums):\n    pass",
        "testCases": [
          {
            "input": "[2,3,1,1,4]",
            "expectedOutput": "2"
          },
          {
            "input": "[2,3,0,1,4]",
            "expectedOutput": "2"
          },
          {
            "input": "[1,1,1,1]",
            "expectedOutput": "3",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Partition Labels",
        "slug": "partition-labels",
        "difficulty": "medium",
        "category": "greedy",
        "description": "Partition s so each letter appears in at most one part. Return list of partition sizes.",
        "examples": [
          {
            "input": "s=ababcbacadefegdehijhklij",
            "output": "[9,7,8]"
          },
          {
            "input": "s=eccbbbbdec",
            "output": "[10]"
          }
        ],
        "constraints": [
          "1<=s.length<=500"
        ],
        "hints": [
          "Record last occurrence of each char",
          "Extend current partition to last occurrence of all chars seen; record when i==end"
        ],
        "tags": [
          "greedy",
          "string",
          "hash-table"
        ],
        "js": "function partitionLabels(s) {\n  // your code here\n}",
        "py": "def partition_labels(s):\n    pass",
        "testCases": [
          {
            "input": "ababcbacadefegdehijhklij",
            "expectedOutput": "[9,7,8]"
          },
          {
            "input": "eccbbbbdec",
            "expectedOutput": "[10]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Candy",
        "slug": "candy",
        "difficulty": "hard",
        "category": "greedy",
        "description": "N children with ratings. Each gets at least 1 candy; higher rating than neighbor gets more. Return minimum total candies.",
        "examples": [
          {
            "input": "ratings=[1,0,2]",
            "output": "5"
          },
          {
            "input": "ratings=[1,2,2]",
            "output": "4"
          }
        ],
        "constraints": [
          "1<=n<=2*10^4"
        ],
        "hints": [
          "Two passes: left->right then right->left",
          "Take max of both for each child"
        ],
        "tags": [
          "greedy",
          "array"
        ],
        "js": "function candy(ratings) {\n  // your code here\n}",
        "py": "def candy(ratings):\n    pass",
        "testCases": [
          {
            "input": "[1,0,2]",
            "expectedOutput": "5"
          },
          {
            "input": "[1,2,2]",
            "expectedOutput": "4"
          },
          {
            "input": "[1,3,2,2,1]",
            "expectedOutput": "7",
            "isHidden": true
          }
        ],
        "xpReward": 110
      },
      {
        "title": "IPO",
        "slug": "ipo-maximize-capital",
        "difficulty": "hard",
        "category": "greedy",
        "description": "With w capital and k max projects, each with profit and minimum capital, return max capital after at most k projects.",
        "examples": [
          {
            "input": "k=2,w=0,profits=[1,2,3],capital=[0,1,1]",
            "output": "4"
          },
          {
            "input": "k=3,w=0,profits=[1,2,3],capital=[0,1,2]",
            "output": "6"
          }
        ],
        "constraints": [
          "1<=k<=10^5",
          "1<=n<=10^5"
        ],
        "hints": [
          "Sort by capital; max-heap of available profits",
          "Each round: add affordable projects to heap; pick most profitable"
        ],
        "tags": [
          "greedy",
          "heap",
          "sorting"
        ],
        "js": "function findMaximizedCapital(k, w, profits, capital) {\n  // your code here\n}",
        "py": "def find_maximized_capital(k, w, profits, capital):\n    pass",
        "testCases": [
          {
            "input": "2\n0\n[1,2,3]\n[0,1,1]",
            "expectedOutput": "4"
          },
          {
            "input": "3\n0\n[1,2,3]\n[0,1,2]",
            "expectedOutput": "6"
          }
        ],
        "xpReward": 110
      },
      {
        "title": "Minimum Number of Refueling Stops",
        "slug": "min-refueling-stops",
        "difficulty": "hard",
        "category": "greedy",
        "description": "Car starts at 0 with startFuel. Given stations[i]=[pos,fuel], return minimum stops to reach target. Return -1 if impossible.",
        "examples": [
          {
            "input": "target=100,startFuel=10,stations=[[10,60],[20,30],[30,30],[60,40]]",
            "output": "2"
          },
          {
            "input": "target=100,startFuel=1,stations=[[10,100]]",
            "output": "-1"
          }
        ],
        "constraints": [
          "1<=target,startFuel<=10^9",
          "0<=stations.length<=500"
        ],
        "hints": [
          "Max-heap; when out of fuel take largest passed station's fuel",
          "If heap empty and can't continue, return -1"
        ],
        "tags": [
          "greedy",
          "heap",
          "dynamic-programming"
        ],
        "js": "function minRefuelStops(target, startFuel, stations) {\n  // your code here\n}",
        "py": "def min_refuel_stops(target, start_fuel, stations):\n    pass",
        "testCases": [
          {
            "input": "100\n10\n[[10,60],[20,30],[30,30],[60,40]]",
            "expectedOutput": "2"
          },
          {
            "input": "100\n1\n[[10,100]]",
            "expectedOutput": "-1"
          }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 39,
    "topic": "Backtracking Advanced",
    "lesson": "Advanced backtracking: pruning is everything. Sort for duplicate skipping. Swap-in-place for permutations. Constraint propagation for Sudoku/N-Queens. Always prune early: if current state can't lead to valid answer, backtrack immediately.",
    "problems": [
      {
        "title": "Subsets II",
        "slug": "subsets-ii",
        "difficulty": "medium",
        "category": "backtracking",
        "description": "Given nums possibly with duplicates, return all possible subsets with no duplicate subsets.",
        "examples": [
          {
            "input": "nums=[1,2,2]",
            "output": "[[],[1],[1,2],[1,2,2],[2],[2,2]]"
          },
          {
            "input": "nums=[0]",
            "output": "[[],[0]]"
          }
        ],
        "constraints": [
          "1<=nums.length<=10"
        ],
        "hints": [
          "Sort first; skip if nums[i]==nums[i-1] at same recursion level (i>start)"
        ],
        "tags": [
          "backtracking",
          "array"
        ],
        "js": "function subsetsWithDup(nums) {\n  // your code here\n}",
        "py": "def subsets_with_dup(nums):\n    pass",
        "testCases": [
          {
            "input": "[1,2,2]",
            "expectedOutput": "[[],[1],[1,2],[1,2,2],[2],[2,2]]"
          },
          {
            "input": "[0]",
            "expectedOutput": "[[],[0]]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Combination Sum II",
        "slug": "combination-sum-ii",
        "difficulty": "medium",
        "category": "backtracking",
        "description": "Find all unique combinations from candidates summing to target. Each number used at most once.",
        "examples": [
          {
            "input": "candidates=[10,1,2,7,6,1,5],target=8",
            "output": "[[1,1,6],[1,2,5],[1,7],[2,6]]"
          },
          {
            "input": "candidates=[2,5,2,1,2],target=5",
            "output": "[[1,2,2],[5]]"
          }
        ],
        "constraints": [
          "1<=candidates.length<=100"
        ],
        "hints": [
          "Sort; skip duplicates at same level",
          "Each element used once (increment index)"
        ],
        "tags": [
          "backtracking",
          "array"
        ],
        "js": "function combinationSum2(candidates, target) {\n  // your code here\n}",
        "py": "def combination_sum2(candidates, target):\n    pass",
        "testCases": [
          {
            "input": "[10,1,2,7,6,1,5]\n8",
            "expectedOutput": "[[1,1,6],[1,2,5],[1,7],[2,6]]"
          },
          {
            "input": "[2,5,2,1,2]\n5",
            "expectedOutput": "[[1,2,2],[5]]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Sudoku Solver",
        "slug": "sudoku-solver",
        "difficulty": "hard",
        "category": "backtracking",
        "description": "Solve a Sudoku puzzle by filling empty '.' cells. Each digit 1-9 appears once per row, column, and 3x3 box.",
        "examples": [
          {
            "input": "board=[[5,3,.,.,7,.,.,.,.],...]]",
            "output": "solved board"
          }
        ],
        "constraints": [
          "board.length==9",
          "Guaranteed one valid solution"
        ],
        "hints": [
          "For each '.' try digits 1-9 checking constraints",
          "Backtrack if none work",
          "Sets for O(1) constraint checking"
        ],
        "tags": [
          "backtracking",
          "matrix"
        ],
        "js": "function solveSudoku(board) {\n  // solve in-place\n}",
        "py": "def solve_sudoku(board):\n    pass",
        "testCases": [
          {
            "input": "[[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]",
            "expectedOutput": "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]"
          }
        ],
        "xpReward": 140
      },
      {
        "title": "Palindrome Partitioning",
        "slug": "palindrome-partitioning",
        "difficulty": "medium",
        "category": "backtracking",
        "description": "Partition s so every substring is a palindrome. Return all possible partitionings.",
        "examples": [
          {
            "input": "s=aab",
            "output": "[[a,a,b],[aa,b]]"
          },
          {
            "input": "s=a",
            "output": "[[a]]"
          }
        ],
        "constraints": [
          "1<=s.length<=16"
        ],
        "hints": [
          "Backtrack: try all substrings from current position",
          "Only recurse if current substring is palindrome",
          "Pre-compute isPalindrome[i][j] with DP"
        ],
        "tags": [
          "backtracking",
          "string",
          "dynamic-programming"
        ],
        "js": "function partition(s) {\n  // your code here\n}",
        "py": "def partition(s):\n    pass",
        "testCases": [
          {
            "input": "aab",
            "expectedOutput": "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]"
          },
          {
            "input": "a",
            "expectedOutput": "[[\"a\"]]"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Expression Add Operators",
        "slug": "expression-add-operators",
        "difficulty": "hard",
        "category": "backtracking",
        "description": "Insert +, -, * between digits of num to make expression equal to target. Return all such expressions.",
        "examples": [
          {
            "input": "num=123,target=6",
            "output": "[1*2*3,1+2+3]"
          },
          {
            "input": "num=232,target=8",
            "output": "[2*3+2,2+3*2]"
          }
        ],
        "constraints": [
          "1<=num.length<=10"
        ],
        "hints": [
          "Backtrack choosing number length and operator at each position",
          "Track running total and last operand for multiplication precedence"
        ],
        "tags": [
          "backtracking",
          "math",
          "string"
        ],
        "js": "function addOperators(num, target) {\n  // your code here\n}",
        "py": "def add_operators(num, target):\n    pass",
        "testCases": [
          {
            "input": "123\n6",
            "expectedOutput": "[\"1*2*3\",\"1+2+3\"]"
          },
          {
            "input": "232\n8",
            "expectedOutput": "[\"2*3+2\",\"2+3*2\"]"
          }
        ],
        "xpReward": 130
      }
    ]
  },
  {
    "dayNumber": 40,
    "topic": "Hard Dynamic Programming",
    "lesson": "Hard DP: Interval DP: dp[i][j] = answer for range [i,j], O(n^3). Bitmask DP: O(n*2^n). Define state carefully, base cases, transitions cover all subproblems. Think about what the last operation is \u2014 often key insight.",
    "problems": [
      {
        "title": "Burst Balloons",
        "slug": "burst-balloons",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Burst balloons for coins = nums[left]*nums[i]*nums[right]. Return maximum total coins.",
        "examples": [
          {
            "input": "nums=[3,1,5,8]",
            "output": "167"
          },
          {
            "input": "nums=[1,5]",
            "output": "10"
          }
        ],
        "constraints": [
          "1<=n<=300",
          "0<=nums[i]<=100"
        ],
        "hints": [
          "Add 1 to both ends",
          "dp[i][j] = max coins bursting all between i and j",
          "Think in reverse: which balloon is burst LAST in [i,j]?"
        ],
        "tags": [
          "dynamic-programming",
          "divide-and-conquer"
        ],
        "js": "function maxCoins(nums) {\n  // your code here\n}",
        "py": "def max_coins(nums):\n    pass",
        "testCases": [
          {
            "input": "[3,1,5,8]",
            "expectedOutput": "167"
          },
          {
            "input": "[1,5]",
            "expectedOutput": "10"
          }
        ],
        "xpReward": 140
      },
      {
        "title": "Strange Printer",
        "slug": "strange-printer",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Printer prints one char sequence per turn. Return minimum turns to print string s.",
        "examples": [
          {
            "input": "s=aaabbb",
            "output": "2"
          },
          {
            "input": "s=aba",
            "output": "2"
          }
        ],
        "constraints": [
          "1<=s.length<=100"
        ],
        "hints": [
          "Interval DP: dp[i][j] = min turns for s[i..j]",
          "If s[i]==s[k] for k in (i,j]: dp[i][j] = min(dp[i+1][k]+dp[k+1][j])"
        ],
        "tags": [
          "dynamic-programming",
          "string"
        ],
        "js": "function strangePrinter(s) {\n  // your code here\n}",
        "py": "def strange_printer(s):\n    pass",
        "testCases": [
          {
            "input": "aaabbb",
            "expectedOutput": "2"
          },
          {
            "input": "aba",
            "expectedOutput": "2"
          },
          {
            "input": "tbgtgb",
            "expectedOutput": "4",
            "isHidden": true
          }
        ],
        "xpReward": 130
      },
      {
        "title": "Minimum Cost to Cut a Stick",
        "slug": "min-cost-cut-stick",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Stick of length n. Given cut positions, reorder cuts to minimize total cost (each cut costs current stick length).",
        "examples": [
          {
            "input": "n=7,cuts=[1,3,4,5]",
            "output": "16"
          },
          {
            "input": "n=9,cuts=[5,6,1,4,2]",
            "output": "22"
          }
        ],
        "constraints": [
          "2<=n<=10^6",
          "1<=cuts.length<=100"
        ],
        "hints": [
          "Add 0 and n to cuts; sort",
          "dp[i][j] = min cost for cuts between cuts[i] and cuts[j]",
          "dp[i][j] = cuts[j]-cuts[i] + min(dp[i][k]+dp[k][j])"
        ],
        "tags": [
          "dynamic-programming"
        ],
        "js": "function minCost(n, cuts) {\n  // your code here\n}",
        "py": "def min_cost(n, cuts):\n    pass",
        "testCases": [
          {
            "input": "7\n[1,3,4,5]",
            "expectedOutput": "16"
          },
          {
            "input": "9\n[5,6,1,4,2]",
            "expectedOutput": "22"
          }
        ],
        "xpReward": 140
      },
      {
        "title": "Wildcard Matching",
        "slug": "wildcard-matching",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Pattern p with '?' (any single char) and '*' (any sequence). Return true if p matches entire s.",
        "examples": [
          {
            "input": "s=aa,p=a",
            "output": "false"
          },
          {
            "input": "s=aa,p=*",
            "output": "true"
          },
          {
            "input": "s=cb,p=?a",
            "output": "false"
          },
          {
            "input": "s=adceb,p=*a*b",
            "output": "true"
          }
        ],
        "constraints": [
          "0<=s.length,p.length<=2000"
        ],
        "hints": [
          "dp[i][j] = does s[0..i-1] match p[0..j-1]",
          "'*': zero = dp[i][j-2]; one+ = dp[i-1][j] if chars match"
        ],
        "tags": [
          "dynamic-programming",
          "string",
          "greedy"
        ],
        "js": "function isMatch(s, p) {\n  // your code here\n}",
        "py": "def is_match(s, p):\n    pass",
        "testCases": [
          {
            "input": "aa\na",
            "expectedOutput": "false"
          },
          {
            "input": "aa\n*",
            "expectedOutput": "true"
          },
          {
            "input": "cb\n?a",
            "expectedOutput": "false"
          },
          {
            "input": "adceb\n*a*b",
            "expectedOutput": "true",
            "isHidden": true
          }
        ],
        "xpReward": 140
      },
      {
        "title": "Regular Expression Matching",
        "slug": "regular-expression-matching",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Pattern p with '.' (any char) and '*' (zero or more of preceding). Return true if p matches entire s.",
        "examples": [
          {
            "input": "s=aa,p=a",
            "output": "false"
          },
          {
            "input": "s=aa,p=a*",
            "output": "true"
          },
          {
            "input": "s=ab,p=.*",
            "output": "true"
          },
          {
            "input": "s=aab,p=c*a*b",
            "output": "true"
          }
        ],
        "constraints": [
          "1<=s.length<=20",
          "1<=p.length<=30"
        ],
        "hints": [
          "dp[i][j] = does s[0..i-1] match p[0..j-1]",
          "'*': zero occurrences dp[i][j-2]; one+ if chars match dp[i-1][j]"
        ],
        "tags": [
          "dynamic-programming",
          "string",
          "recursion"
        ],
        "js": "function isMatch(s, p) {\n  // your code here\n}",
        "py": "def is_match(s, p):\n    pass",
        "testCases": [
          {
            "input": "aa\na",
            "expectedOutput": "false"
          },
          {
            "input": "aa\na*",
            "expectedOutput": "true"
          },
          {
            "input": "ab\n.*",
            "expectedOutput": "true"
          },
          {
            "input": "aab\nc*a*b",
            "expectedOutput": "true",
            "isHidden": true
          }
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
    return NextResponse.json({ success: true, message: `Days 31-40 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}