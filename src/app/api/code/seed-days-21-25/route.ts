// src/app/api/code/seed-days-21-25/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 21,
    "topic": "Union Find (Disjoint Sets)",
    "lesson": "Union-Find tracks connected components. find(x) with path compression is nearly O(1). union by rank keeps trees flat. Used for cycle detection, Kruskal MST, connected components.",
    "problems": [
      {
        "title": "Number of Provinces",
        "slug": "number-of-provinces",
        "difficulty": "medium",
        "category": "union-find",
        "description": "There are n cities. isConnected[i][j]=1 means cities i and j are directly connected. Return the number of provinces (groups of directly or indirectly connected cities).",
        "examples": [
          {
            "input": "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
            "output": "2"
          },
          {
            "input": "isConnected = [[1,0,0],[0,1,0],[0,0,1]]",
            "output": "3"
          }
        ],
        "constraints": [
          "1 <= n <= 200",
          "n == isConnected.length",
          "isConnected[i][j] is 1 or 0",
          "isConnected[i][i] == 1"
        ],
        "hints": [
          "Use Union-Find or DFS/BFS",
          "Count the number of distinct roots after all unions"
        ],
        "tags": [
          "union-find",
          "graph",
          "dfs"
        ],
        "js": "function findCircleNum(isConnected) {\n  // your code here\n}",
        "py": "def find_circle_num(is_connected):\n    pass",
        "testCases": [
          {
            "input": "[[1,1,0],[1,1,0],[0,0,1]]",
            "expectedOutput": "2"
          },
          {
            "input": "[[1,0,0],[0,1,0],[0,0,1]]",
            "expectedOutput": "3"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Redundant Connection",
        "slug": "redundant-connection",
        "difficulty": "medium",
        "category": "union-find",
        "description": "Given n nodes labeled 1 to n and n edges forming a tree plus one extra edge, return the redundant edge that creates a cycle. If multiple answers, return the last one.",
        "examples": [
          {
            "input": "edges = [[1,2],[1,3],[2,3]]",
            "output": "[2,3]"
          },
          {
            "input": "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]",
            "output": "[1,4]"
          }
        ],
        "constraints": [
          "n == edges.length",
          "3 <= n <= 1000",
          "edges[i].length == 2",
          "All edges are distinct"
        ],
        "hints": [
          "Process edges one by one using Union-Find",
          "The first edge where both nodes already have the same root is the redundant edge"
        ],
        "tags": [
          "union-find",
          "graph"
        ],
        "js": "function findRedundantConnection(edges) {\n  // your code here\n}",
        "py": "def find_redundant_connection(edges):\n    pass",
        "testCases": [
          {
            "input": "[[1,2],[1,3],[2,3]]",
            "expectedOutput": "[2,3]"
          },
          {
            "input": "[[1,2],[2,3],[3,4],[1,4],[1,5]]",
            "expectedOutput": "[1,4]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Accounts Merge",
        "slug": "accounts-merge",
        "difficulty": "medium",
        "category": "union-find",
        "description": "Given accounts where accounts[i] = [name, email1, email2, ...], merge accounts that share any email. Return merged accounts with emails sorted.",
        "examples": [
          {
            "input": "accounts = [[\"John\",\"a@m.com\",\"b@m.com\"],[\"John\",\"b@m.com\",\"c@m.com\"],[\"Mary\",\"d@m.com\"]]",
            "output": "[[\"John\",\"a@m.com\",\"b@m.com\",\"c@m.com\"],[\"Mary\",\"d@m.com\"]]"
          }
        ],
        "constraints": [
          "1 <= accounts.length <= 1000",
          "2 <= accounts[i].length <= 10",
          "1 <= accounts[i][j].length <= 30"
        ],
        "hints": [
          "Map each email to an id and union emails in the same account",
          "Group emails by their root id, attach name, and sort"
        ],
        "tags": [
          "union-find",
          "string",
          "hash-table"
        ],
        "js": "function accountsMerge(accounts) {\n  // your code here\n}",
        "py": "def accounts_merge(accounts):\n    pass",
        "testCases": [
          {
            "input": "[[\"John\",\"a@m.com\",\"b@m.com\"],[\"John\",\"b@m.com\",\"c@m.com\"],[\"Mary\",\"d@m.com\"]]",
            "expectedOutput": "[[\"John\",\"a@m.com\",\"b@m.com\",\"c@m.com\"],[\"Mary\",\"d@m.com\"]]"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Satisfiability of Equality Equations",
        "slug": "satisfiability-equality",
        "difficulty": "medium",
        "category": "union-find",
        "description": "Given equations like [\"a==b\",\"b!=c\",\"c==a\"], return true if all equations can be satisfied simultaneously.",
        "examples": [
          {
            "input": "equations = [\"a==b\",\"b!=c\",\"c==a\"]",
            "output": "false"
          },
          {
            "input": "equations = [\"c==c\",\"b==d\",\"x!=z\"]",
            "output": "true"
          }
        ],
        "constraints": [
          "1 <= equations.length <= 500",
          "equations[i].length == 4",
          "equations[i][0] and equations[i][3] are lowercase letters",
          "equations[i][1] is either '=' or '!'",
          "equations[i][2] is '='"
        ],
        "hints": [
          "Process all '==' equations first \u2014 union both variable sides",
          "Then check all '!=' equations: if both sides have the same root, return false"
        ],
        "tags": [
          "union-find",
          "graph",
          "string"
        ],
        "js": "function equationsPossible(equations) {\n  // your code here\n}",
        "py": "def equations_possible(equations):\n    pass",
        "testCases": [
          {
            "input": "[\"a==b\",\"b!=c\",\"c==a\"]",
            "expectedOutput": "false"
          },
          {
            "input": "[\"c==c\",\"b==d\",\"x!=z\"]",
            "expectedOutput": "true"
          },
          {
            "input": "[\"a==b\",\"a!=b\"]",
            "expectedOutput": "false",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Making a Large Island",
        "slug": "making-large-island",
        "difficulty": "hard",
        "category": "union-find",
        "description": "Given an n x n binary grid, you may change at most one 0 to 1. Return the size of the largest island after this operation.",
        "examples": [
          {
            "input": "grid = [[1,0],[0,1]]",
            "output": "3"
          },
          {
            "input": "grid = [[1,1],[1,0]]",
            "output": "4"
          }
        ],
        "constraints": [
          "n == grid.length == grid[i].length",
          "1 <= n <= 500",
          "grid[i][j] is 0 or 1"
        ],
        "hints": [
          "Label each island with Union-Find and record sizes",
          "For each 0 cell, check all 4 neighboring islands and sum their sizes + 1"
        ],
        "tags": [
          "union-find",
          "dfs",
          "matrix"
        ],
        "js": "function largestIsland(grid) {\n  // your code here\n}",
        "py": "def largest_island(grid):\n    pass",
        "testCases": [
          {
            "input": "[[1,0],[0,1]]",
            "expectedOutput": "3"
          },
          {
            "input": "[[1,1],[1,0]]",
            "expectedOutput": "4"
          },
          {
            "input": "[[1,1],[1,1]]",
            "expectedOutput": "4",
            "isHidden": true
          }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 22,
    "topic": "Shortest Path \u2014 Dijkstra",
    "lesson": "Dijkstra finds shortest paths in weighted graphs with non-negative edges. Use a min-heap: always process the node with smallest known distance first. Update neighbors if shorter path found. Time O((V+E) log V). Never use on negative weights.",
    "problems": [
      {
        "title": "Network Delay Time",
        "slug": "network-delay-time",
        "difficulty": "medium",
        "category": "graph",
        "description": "There are n nodes labeled 1 to n and directed weighted edges times[i]=[u,v,w]. A signal is sent from node k. Return the minimum time for all nodes to receive the signal, or -1 if impossible.",
        "examples": [
          {
            "input": "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
            "output": "2"
          }
        ],
        "constraints": [
          "1 <= k <= n <= 100",
          "1 <= times.length <= 6000",
          "times[i].length == 3"
        ],
        "hints": [
          "Run Dijkstra from source k",
          "Answer is the maximum of all shortest distances; return -1 if any node is unreachable"
        ],
        "tags": [
          "graph",
          "dijkstra",
          "shortest-path"
        ],
        "js": "function networkDelayTime(times, n, k) {\n  // your code here\n}",
        "py": "def network_delay_time(times, n, k):\n    pass",
        "testCases": [
          {
            "input": "[[2,1,1],[2,3,1],[3,4,1]]\n4\n2",
            "expectedOutput": "2"
          },
          {
            "input": "[[1,2,1]]\n2\n1",
            "expectedOutput": "1"
          },
          {
            "input": "[[1,2,1]]\n2\n2",
            "expectedOutput": "-1",
            "isHidden": true
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Path with Minimum Effort",
        "slug": "path-min-effort",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given an m x n matrix of heights, return the minimum effort to travel from top-left to bottom-right. Effort of a path = maximum absolute difference in heights between consecutive cells.",
        "examples": [
          {
            "input": "heights = [[1,2,2],[3,8,2],[5,3,5]]",
            "output": "2"
          },
          {
            "input": "heights = [[1,2,3],[3,8,4],[5,3,5]]",
            "output": "1"
          }
        ],
        "constraints": [
          "rows == heights.length",
          "columns == heights[i].length",
          "1 <= rows, columns <= 100",
          "1 <= heights[i][j] <= 10^6"
        ],
        "hints": [
          "Modified Dijkstra where the cost to reach a cell = max(current_effort, |height diff|)",
          "Use a min-heap ordered by effort"
        ],
        "tags": [
          "graph",
          "dijkstra",
          "binary-search",
          "matrix"
        ],
        "js": "function minimumEffortPath(heights) {\n  // your code here\n}",
        "py": "def minimum_effort_path(heights):\n    pass",
        "testCases": [
          {
            "input": "[[1,2,2],[3,8,2],[5,3,5]]",
            "expectedOutput": "2"
          },
          {
            "input": "[[1,2,3],[3,8,4],[5,3,5]]",
            "expectedOutput": "1"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Cheapest Flights Within K Stops",
        "slug": "cheapest-flights-k-stops",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given n cities and flights [from,to,price], find the cheapest price from src to dst with at most k stops. Return -1 if impossible.",
        "examples": [
          {
            "input": "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1",
            "output": "700"
          }
        ],
        "constraints": [
          "1 <= n <= 100",
          "0 <= flights.length <= n*(n-1)",
          "0 <= k < n"
        ],
        "hints": [
          "Bellman-Ford relaxed exactly k+1 times",
          "Use a copy of distances array each iteration to avoid using edges from the same round"
        ],
        "tags": [
          "graph",
          "dijkstra",
          "bellman-ford",
          "dynamic-programming"
        ],
        "js": "function findCheapestPrice(n, flights, src, dst, k) {\n  // your code here\n}",
        "py": "def find_cheapest_price(n, flights, src, dst, k):\n    pass",
        "testCases": [
          {
            "input": "4\n[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]\n0\n3\n1",
            "expectedOutput": "700"
          },
          {
            "input": "3\n[[0,1,100],[1,2,100],[0,2,500]]\n0\n2\n1",
            "expectedOutput": "200"
          }
        ],
        "xpReward": 100
      },
      {
        "title": "Swim in Rising Water",
        "slug": "swim-rising-water",
        "difficulty": "hard",
        "category": "graph",
        "description": "In an n x n grid, grid[i][j] = elevation. At time t you can swim to adjacent cells with elevation <= t. Return the minimum time t to swim from (0,0) to (n-1,n-1).",
        "examples": [
          {
            "input": "grid = [[0,2],[1,3]]",
            "output": "3"
          },
          {
            "input": "grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]",
            "output": "16"
          }
        ],
        "constraints": [
          "n == grid.length",
          "1 <= n <= 50",
          "grid[i][j] is a permutation of [0, n^2-1]"
        ],
        "hints": [
          "Dijkstra where cost to reach a cell = max(time to reach parent, grid[cell])",
          "Or use binary search + BFS"
        ],
        "tags": [
          "graph",
          "dijkstra",
          "binary-search",
          "matrix"
        ],
        "js": "function swimInWater(grid) {\n  // your code here\n}",
        "py": "def swim_in_water(grid):\n    pass",
        "testCases": [
          {
            "input": "[[0,2],[1,3]]",
            "expectedOutput": "3"
          },
          {
            "input": "[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]",
            "expectedOutput": "16"
          }
        ],
        "xpReward": 120
      },
      {
        "title": "Number of Ways to Arrive at Destination",
        "slug": "ways-arrive-destination",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given n intersections and roads with travel times, return the number of ways to travel from intersection 0 to n-1 in the shortest time. Answer modulo 10^9+7.",
        "examples": [
          {
            "input": "n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]",
            "output": "4"
          }
        ],
        "constraints": [
          "1 <= n <= 200",
          "n-1 <= roads.length <= n*(n-1)/2"
        ],
        "hints": [
          "Dijkstra tracking both shortest distance and count of shortest paths",
          "If new shortest found: update dist + reset count; if equal distance: add to count"
        ],
        "tags": [
          "graph",
          "dijkstra",
          "dynamic-programming"
        ],
        "js": "function countPaths(n, roads) {\n  // your code here\n}",
        "py": "def count_paths(n, roads):\n    pass",
        "testCases": [
          {
            "input": "7\n[[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]",
            "expectedOutput": "4"
          },
          {
            "input": "2\n[[1,0,10]]",
            "expectedOutput": "1",
            "isHidden": true
          }
        ],
        "xpReward": 100
      }
    ]
  },
  {
    "dayNumber": 23,
    "topic": "Bit Manipulation",
    "lesson": "Key tricks: n & (n-1) clears the lowest set bit. n & (-n) isolates the lowest set bit. a ^ a = 0 and a ^ 0 = a. XOR finds unique elements in O(n) O(1). Left shift multiplies by 2. Check bit i: (n >> i) & 1. Set bit i: n | (1 << i).",
    "problems": [
      {
        "title": "Single Number",
        "slug": "single-number",
        "difficulty": "easy",
        "category": "bit-manipulation",
        "description": "Given a non-empty array where every element appears twice except for one, find that single element. Must run in O(n) time and O(1) space.",
        "examples": [
          {
            "input": "nums = [2,2,1]",
            "output": "1"
          },
          {
            "input": "nums = [4,1,2,1,2]",
            "output": "4"
          }
        ],
        "constraints": [
          "1 <= nums.length <= 3*10^4",
          "-3*10^4 <= nums[i] <= 3*10^4",
          "Each element appears twice except for one"
        ],
        "hints": [
          "XOR all numbers together",
          "Duplicate pairs cancel out (a ^ a = 0), leaving only the single number"
        ],
        "tags": [
          "bit-manipulation",
          "array"
        ],
        "js": "function singleNumber(nums) {\n  // your code here\n}",
        "py": "def single_number(nums):\n    pass",
        "testCases": [
          {
            "input": "[2,2,1]",
            "expectedOutput": "1"
          },
          {
            "input": "[4,1,2,1,2]",
            "expectedOutput": "4"
          },
          {
            "input": "[1]",
            "expectedOutput": "1",
            "isHidden": true
          }
        ],
        "xpReward": 40
      },
      {
        "title": "Number of 1 Bits",
        "slug": "number-of-1-bits",
        "difficulty": "easy",
        "category": "bit-manipulation",
        "description": "Write a function that takes an unsigned integer and returns the number of '1' bits it has (Hamming weight).",
        "examples": [
          {
            "input": "n = 11",
            "output": "3",
            "explanation": "Binary 1011 has three 1 bits"
          },
          {
            "input": "n = 128",
            "output": "1",
            "explanation": "Binary 10000000 has one 1 bit"
          }
        ],
        "constraints": [
          "The input must be a binary string of length 32"
        ],
        "hints": [
          "Repeatedly apply n = n & (n-1) to clear the lowest set bit, counting iterations",
          "Or check each bit with (n >> i) & 1 for i in 0..31"
        ],
        "tags": [
          "bit-manipulation"
        ],
        "js": "function hammingWeight(n) {\n  // your code here\n}",
        "py": "def hamming_weight(n):\n    pass",
        "testCases": [
          {
            "input": "11",
            "expectedOutput": "3"
          },
          {
            "input": "128",
            "expectedOutput": "1"
          },
          {
            "input": "2147483645",
            "expectedOutput": "30",
            "isHidden": true
          }
        ],
        "xpReward": 40
      },
      {
        "title": "Counting Bits",
        "slug": "counting-bits",
        "difficulty": "easy",
        "category": "bit-manipulation",
        "description": "Given an integer n, return an array ans of length n+1 such that ans[i] is the number of 1 bits in the binary representation of i.",
        "examples": [
          {
            "input": "n = 2",
            "output": "[0,1,1]"
          },
          {
            "input": "n = 5",
            "output": "[0,1,1,2,1,2]"
          }
        ],
        "constraints": [
          "0 <= n <= 10^5"
        ],
        "hints": [
          "dp: bits[i] = bits[i >> 1] + (i & 1)",
          "Right shift removes the last bit; add 1 if that last bit was 1"
        ],
        "tags": [
          "bit-manipulation",
          "dynamic-programming"
        ],
        "js": "function countBits(n) {\n  // your code here\n}",
        "py": "def count_bits(n):\n    pass",
        "testCases": [
          {
            "input": "2",
            "expectedOutput": "[0,1,1]"
          },
          {
            "input": "5",
            "expectedOutput": "[0,1,1,2,1,2]"
          },
          {
            "input": "0",
            "expectedOutput": "[0]",
            "isHidden": true
          }
        ],
        "xpReward": 40
      },
      {
        "title": "Reverse Bits",
        "slug": "reverse-bits",
        "difficulty": "easy",
        "category": "bit-manipulation",
        "description": "Reverse the bits of a given 32-bit unsigned integer.",
        "examples": [
          {
            "input": "n = 43261596",
            "output": "964176192",
            "explanation": "00000010100101000001111010011100 reversed is 00111001011110000010100101000000 = 964176192"
          }
        ],
        "constraints": [
          "The input must be a binary string of length 32"
        ],
        "hints": [
          "Build result bit by bit: extract LSB with n&1, append to result shifted left, then shift n right",
          "Repeat 32 times"
        ],
        "tags": [
          "bit-manipulation"
        ],
        "js": "function reverseBits(n) {\n  // your code here\n}",
        "py": "def reverse_bits(n):\n    pass",
        "testCases": [
          {
            "input": "43261596",
            "expectedOutput": "964176192"
          },
          {
            "input": "4294967293",
            "expectedOutput": "3221225471",
            "isHidden": true
          }
        ],
        "xpReward": 50
      },
      {
        "title": "Sum of Two Integers",
        "slug": "sum-two-integers",
        "difficulty": "medium",
        "category": "bit-manipulation",
        "description": "Given two integers a and b, return the sum of the two integers without using the operators + and -.",
        "examples": [
          {
            "input": "a = 1, b = 2",
            "output": "3"
          },
          {
            "input": "a = 2, b = 3",
            "output": "5"
          }
        ],
        "constraints": [
          "-1000 <= a, b <= 1000"
        ],
        "hints": [
          "XOR gives sum without carry: a ^ b",
          "AND gives carry bits: (a & b) << 1",
          "Repeat until there is no carry"
        ],
        "tags": [
          "bit-manipulation",
          "math"
        ],
        "js": "function getSum(a, b) {\n  // your code here\n}",
        "py": "def get_sum(a, b):\n    pass",
        "testCases": [
          {
            "input": "1\n2",
            "expectedOutput": "3"
          },
          {
            "input": "2\n3",
            "expectedOutput": "5"
          },
          {
            "input": "-1\n1",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 70
      }
    ]
  },
  {
    "dayNumber": 24,
    "topic": "Math & Number Theory",
    "lesson": "Key math for coding: GCD via Euclidean algorithm gcd(a,b)=gcd(b,a%b). Sieve of Eratosthenes for primes in O(n log log n). Modular arithmetic: (a*b)%m = ((a%m)*(b%m))%m. Fast power: a^n in O(log n) via repeated squaring.",
    "problems": [
      {
        "title": "Count Primes",
        "slug": "count-primes",
        "difficulty": "medium",
        "category": "math",
        "description": "Given an integer n, return the number of prime numbers that are strictly less than n.",
        "examples": [
          {
            "input": "n = 10",
            "output": "4",
            "explanation": "2, 3, 5, 7 are the four primes less than 10"
          },
          {
            "input": "n = 0",
            "output": "0"
          },
          {
            "input": "n = 1",
            "output": "0"
          }
        ],
        "constraints": [
          "0 <= n <= 5 * 10^6"
        ],
        "hints": [
          "Sieve of Eratosthenes: create a boolean array, mark all multiples of each prime as composite",
          "Start marking from p*p (smaller multiples are already marked)"
        ],
        "tags": [
          "math",
          "sieve"
        ],
        "js": "function countPrimes(n) {\n  // your code here\n}",
        "py": "def count_primes(n):\n    pass",
        "testCases": [
          {
            "input": "10",
            "expectedOutput": "4"
          },
          {
            "input": "0",
            "expectedOutput": "0"
          },
          {
            "input": "1",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 60
      },
      {
        "title": "Power of Three",
        "slug": "power-of-three",
        "difficulty": "easy",
        "category": "math",
        "description": "Given an integer n, return true if it is a power of three. Otherwise, return false. Try to solve it without a loop or recursion.",
        "examples": [
          {
            "input": "n = 27",
            "output": "true"
          },
          {
            "input": "n = 0",
            "output": "false"
          },
          {
            "input": "n = 9",
            "output": "true"
          },
          {
            "input": "n = -1",
            "output": "false"
          }
        ],
        "constraints": [
          "-2^31 <= n <= 2^31 - 1"
        ],
        "hints": [
          "3^19 = 1162261467 is the largest power of 3 fitting in a 32-bit integer",
          "n > 0 && 1162261467 % n === 0"
        ],
        "tags": [
          "math",
          "recursion"
        ],
        "js": "function isPowerOfThree(n) {\n  // your code here\n}",
        "py": "def is_power_of_three(n):\n    pass",
        "testCases": [
          {
            "input": "27",
            "expectedOutput": "true"
          },
          {
            "input": "0",
            "expectedOutput": "false"
          },
          {
            "input": "9",
            "expectedOutput": "true"
          },
          {
            "input": "-1",
            "expectedOutput": "false",
            "isHidden": true
          }
        ],
        "xpReward": 40
      },
      {
        "title": "Happy Number",
        "slug": "happy-number",
        "difficulty": "easy",
        "category": "math",
        "description": "Starting with any positive integer n, replace it by the sum of squares of its digits, and repeat. If this process ends in 1, the number is happy. Return true if n is a happy number.",
        "examples": [
          {
            "input": "n = 19",
            "output": "true",
            "explanation": "1^2+9^2=82 -> 8^2+2^2=68 -> 6^2+8^2=100 -> 1^2=1"
          },
          {
            "input": "n = 2",
            "output": "false"
          }
        ],
        "constraints": [
          "1 <= n <= 2^31 - 1"
        ],
        "hints": [
          "Use a Set to detect if we've seen a number before (cycle detection)",
          "Or use Floyd's fast/slow pointer on the sequence"
        ],
        "tags": [
          "math",
          "hash-table"
        ],
        "js": "function isHappy(n) {\n  // your code here\n}",
        "py": "def is_happy(n):\n    pass",
        "testCases": [
          {
            "input": "19",
            "expectedOutput": "true"
          },
          {
            "input": "2",
            "expectedOutput": "false"
          },
          {
            "input": "1",
            "expectedOutput": "true",
            "isHidden": true
          }
        ],
        "xpReward": 50
      },
      {
        "title": "Excel Sheet Column Number",
        "slug": "excel-column-number",
        "difficulty": "easy",
        "category": "math",
        "description": "Given a string columnTitle that represents the column title as appears in an Excel sheet, return its corresponding column number. A=1, B=2, ..., Z=26, AA=27, AB=28.",
        "examples": [
          {
            "input": "columnTitle = \"A\"",
            "output": "1"
          },
          {
            "input": "columnTitle = \"AB\"",
            "output": "28"
          },
          {
            "input": "columnTitle = \"ZY\"",
            "output": "701"
          }
        ],
        "constraints": [
          "1 <= columnTitle.length <= 7",
          "columnTitle consists only of uppercase English letters"
        ],
        "hints": [
          "This is base-26 to decimal conversion",
          "Process left to right: result = result * 26 + (charCode - 'A' + 1)"
        ],
        "tags": [
          "math",
          "string"
        ],
        "js": "function titleToNumber(columnTitle) {\n  // your code here\n}",
        "py": "def title_to_number(column_title):\n    pass",
        "testCases": [
          {
            "input": "A",
            "expectedOutput": "1"
          },
          {
            "input": "AB",
            "expectedOutput": "28"
          },
          {
            "input": "ZY",
            "expectedOutput": "701"
          },
          {
            "input": "FXSHRXW",
            "expectedOutput": "2147483647",
            "isHidden": true
          }
        ],
        "xpReward": 40
      },
      {
        "title": "Ugly Number II",
        "slug": "ugly-number-ii",
        "difficulty": "medium",
        "category": "math",
        "description": "An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, return the nth ugly number.",
        "examples": [
          {
            "input": "n = 10",
            "output": "12",
            "explanation": "First 10 ugly numbers: 1,2,3,4,5,6,8,9,10,12"
          },
          {
            "input": "n = 1",
            "output": "1"
          }
        ],
        "constraints": [
          "1 <= n <= 1690"
        ],
        "hints": [
          "Use three pointers p2, p3, p5 for next multiple of 2, 3, 5",
          "Next ugly = min(ugly[p2]*2, ugly[p3]*3, ugly[p5]*5); advance the corresponding pointer"
        ],
        "tags": [
          "math",
          "dynamic-programming",
          "heap"
        ],
        "js": "function nthUglyNumber(n) {\n  // your code here\n}",
        "py": "def nth_ugly_number(n):\n    pass",
        "testCases": [
          {
            "input": "10",
            "expectedOutput": "12"
          },
          {
            "input": "1",
            "expectedOutput": "1"
          },
          {
            "input": "15",
            "expectedOutput": "24",
            "isHidden": true
          }
        ],
        "xpReward": 70
      }
    ]
  },
  {
    "dayNumber": 25,
    "topic": "Monotonic Stack",
    "lesson": "A monotonic stack maintains elements in increasing or decreasing order. When a new element breaks monotonicity, pop until it doesn't. Classic problems: Next Greater Element, Largest Rectangle in Histogram, Trapping Rain Water. Time O(n) \u2014 each element pushed/popped at most once.",
    "problems": [
      {
        "title": "Next Greater Element I",
        "slug": "next-greater-element-i",
        "difficulty": "easy",
        "category": "stack",
        "description": "nums1 is a subset of nums2. For each element in nums1, find its next greater element in nums2 to the right. Return -1 if none exists.",
        "examples": [
          {
            "input": "nums1 = [4,1,2], nums2 = [1,3,4,2]",
            "output": "[-1,3,-1]"
          },
          {
            "input": "nums1 = [2,4], nums2 = [1,2,3,4]",
            "output": "[3,-1]"
          }
        ],
        "constraints": [
          "1 <= nums1.length <= nums2.length <= 1000",
          "All integers are unique"
        ],
        "hints": [
          "Precompute the next greater element for all of nums2 using a monotonic decreasing stack",
          "Store results in a hashmap: element -> its next greater element"
        ],
        "tags": [
          "stack",
          "array",
          "monotonic-stack"
        ],
        "js": "function nextGreaterElement(nums1, nums2) {\n  // your code here\n}",
        "py": "def next_greater_element(nums1, nums2):\n    pass",
        "testCases": [
          {
            "input": "[4,1,2]\n[1,3,4,2]",
            "expectedOutput": "[-1,3,-1]"
          },
          {
            "input": "[2,4]\n[1,2,3,4]",
            "expectedOutput": "[3,-1]"
          }
        ],
        "xpReward": 50
      },
      {
        "title": "Largest Rectangle in Histogram",
        "slug": "largest-rectangle-histogram",
        "difficulty": "hard",
        "category": "stack",
        "description": "Given an array of integers heights representing the histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
        "examples": [
          {
            "input": "heights = [2,1,5,6,2,3]",
            "output": "10",
            "explanation": "The rectangle spans bars 2 and 3 with height 5"
          },
          {
            "input": "heights = [2,4]",
            "output": "4"
          }
        ],
        "constraints": [
          "1 <= heights.length <= 10^5",
          "0 <= heights[i] <= 10^4"
        ],
        "hints": [
          "Use a monotonic increasing stack of indices",
          "When current bar is shorter than stack top, the top bar forms its maximum rectangle"
        ],
        "tags": [
          "stack",
          "array",
          "monotonic-stack"
        ],
        "js": "function largestRectangleArea(heights) {\n  // your code here\n}",
        "py": "def largest_rectangle_area(heights):\n    pass",
        "testCases": [
          {
            "input": "[2,1,5,6,2,3]",
            "expectedOutput": "10"
          },
          {
            "input": "[2,4]",
            "expectedOutput": "4"
          },
          {
            "input": "[1]",
            "expectedOutput": "1",
            "isHidden": true
          }
        ],
        "xpReward": 120
      },
      {
        "title": "Trapping Rain Water",
        "slug": "trapping-rain-water",
        "difficulty": "hard",
        "category": "stack",
        "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        "examples": [
          {
            "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
            "output": "6"
          },
          {
            "input": "height = [4,2,0,3,2,5]",
            "output": "9"
          }
        ],
        "constraints": [
          "n == height.length",
          "1 <= n <= 2*10^4",
          "0 <= height[i] <= 10^5"
        ],
        "hints": [
          "water[i] = min(maxLeft[i], maxRight[i]) - height[i]",
          "Two pointers: always process from the side with smaller max height"
        ],
        "tags": [
          "stack",
          "array",
          "two-pointers",
          "monotonic-stack"
        ],
        "js": "function trap(height) {\n  // your code here\n}",
        "py": "def trap(height):\n    pass",
        "testCases": [
          {
            "input": "[0,1,0,2,1,0,1,3,2,1,2,1]",
            "expectedOutput": "6"
          },
          {
            "input": "[4,2,0,3,2,5]",
            "expectedOutput": "9"
          },
          {
            "input": "[3,0,2,0,4]",
            "expectedOutput": "7",
            "isHidden": true
          }
        ],
        "xpReward": 120
      },
      {
        "title": "Next Greater Element II",
        "slug": "next-greater-element-ii",
        "difficulty": "medium",
        "category": "stack",
        "description": "Given a circular integer array nums, return the next greater number for each element in nums. The next greater number wraps around. Return -1 if none.",
        "examples": [
          {
            "input": "nums = [1,2,1]",
            "output": "[2,-1,2]"
          },
          {
            "input": "nums = [1,2,3,4,3]",
            "output": "[2,3,4,-1,4]"
          }
        ],
        "constraints": [
          "1 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9"
        ],
        "hints": [
          "Traverse the array twice (0 to 2n-1) with index % n to simulate circular behavior",
          "Use a monotonic decreasing stack of indices"
        ],
        "tags": [
          "stack",
          "array",
          "monotonic-stack"
        ],
        "js": "function nextGreaterElements(nums) {\n  // your code here\n}",
        "py": "def next_greater_elements(nums):\n    pass",
        "testCases": [
          {
            "input": "[1,2,1]",
            "expectedOutput": "[2,-1,2]"
          },
          {
            "input": "[1,2,3,4,3]",
            "expectedOutput": "[2,3,4,-1,4]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Remove K Digits",
        "slug": "remove-k-digits",
        "difficulty": "medium",
        "category": "stack",
        "description": "Given a string num representing a non-negative integer and an integer k, remove k digits from num to make the resulting number as small as possible. Return the result as a string.",
        "examples": [
          {
            "input": "num = \"1432219\", k = 3",
            "output": "\"1219\""
          },
          {
            "input": "num = \"10200\", k = 1",
            "output": "\"200\""
          },
          {
            "input": "num = \"10\", k = 2",
            "output": "\"0\""
          }
        ],
        "constraints": [
          "1 <= k <= num.length <= 10^5",
          "num consists of only digits",
          "num does not have leading zeros except the number 0 itself"
        ],
        "hints": [
          "Use a monotonic increasing stack",
          "Remove digits that are greater than the next digit; handle remaining k and leading zeros"
        ],
        "tags": [
          "stack",
          "greedy",
          "string",
          "monotonic-stack"
        ],
        "js": "function removeKdigits(num, k) {\n  // your code here\n}",
        "py": "def remove_kdigits(num, k):\n    pass",
        "testCases": [
          {
            "input": "1432219\n3",
            "expectedOutput": "1219"
          },
          {
            "input": "10200\n1",
            "expectedOutput": "200"
          },
          {
            "input": "10\n2",
            "expectedOutput": "0"
          }
        ],
        "xpReward": 80
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
          starterCode: {
            javascript: p.js,
            typescript: p.js.replace("function ", "function ").replace(/\) {/, "): any {"),
            python:     p.py,
            java:       "import java.util.*;\n\nclass Solution {\n    public static void main(String[] args) {\n        // test here\n    }\n\n    public Object solve(Object input) {\n        // implement here\n        return null;\n    }\n}",
            cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // implement here\n    return 0;\n}",
            c:          "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    /* implement here */\n    return 0;\n}",
          },
          testCases:   p.testCases,
          xpReward:    p.xpReward,
          source:      "custom",
          externalUrl: null,
          cfRating:    null,
        }).onConflictDoUpdate({
          target: codingChallenges.slug,
          set: {
            title:       p.title,
            dayNumber:   day.dayNumber,
            description: p.description,
            examples:    p.examples,
            constraints: p.constraints,
            hints:       p.hints,
            tags:        p.tags,
            testCases:   p.testCases,
            xpReward:    p.xpReward,
          },
        });
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Days 21-25 seeded: ${inserted} problems inserted/updated`,
      inserted,
    });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}