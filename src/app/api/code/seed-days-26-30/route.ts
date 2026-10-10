// src/app/api/code/seed-days-26-30/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS_DATA = [
  {
    "dayNumber": 26,
    "topic": "Design Problems",
    "lesson": "Design problems: identify which operations need O(1) then build accordingly. LRU Cache = doubly linked list + hashmap. MinStack = two stacks. Always consider get, put, delete time complexity before choosing data structures.",
    "problems": [
      {
        "title": "LRU Cache",
        "slug": "lru-cache",
        "difficulty": "medium",
        "category": "design",
        "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get(key) which returns the value or -1, and put(key, value) which inserts/updates. Both must run in O(1). Evict the least recently used item when over capacity.",
        "examples": [
          {
            "input": "LRUCache(2); put(1,1); put(2,2); get(1)=1; put(3,3) evicts key 2; get(2)=-1; put(4,4) evicts key 1; get(1)=-1; get(3)=3; get(4)=4",
            "output": "[1,-1,-1,3,4]"
          }
        ],
        "constraints": [
          "1 <= capacity <= 3000",
          "0 <= key <= 10^4",
          "0 <= value <= 10^5",
          "At most 2*10^5 calls to get and put"
        ],
        "hints": [
          "Use a doubly linked list for O(1) move-to-front and remove",
          "Use a HashMap from key to node for O(1) lookup",
          "Maintain dummy head and tail nodes to simplify edge cases"
        ],
        "tags": [
          "design",
          "hash-table",
          "linked-list"
        ],
        "js": "class LRUCache {\n  constructor(capacity) {\n    // your code here\n  }\n  get(key) {\n    // return value or -1\n  }\n  put(key, value) {\n    // insert or update\n  }\n}",
        "py": "class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass",
        "testCases": [
          {
            "input": "2\n[put(1,1),put(2,2),get(1),put(3,3),get(2),put(4,4),get(1),get(3),get(4)]",
            "expectedOutput": "[1,-1,-1,3,4]"
          }
        ],
        "xpReward": 100
      },
      {
        "title": "Min Stack",
        "slug": "min-stack-design",
        "difficulty": "medium",
        "category": "design",
        "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement MinStack with push(val), pop(), top(), and getMin() \u2014 all O(1).",
        "examples": [
          {
            "input": "push(-2); push(0); push(-3); getMin()=-3; pop(); top()=0; getMin()=-2",
            "output": "[-3,0,-2]"
          }
        ],
        "constraints": [
          "-2^31 <= val <= 2^31-1",
          "pop/top/getMin called on non-empty stack",
          "At most 3*10^4 calls"
        ],
        "hints": [
          "Use an auxiliary stack that stores the current minimum at each level",
          "Push (val, currentMin) pairs so you always know the min after any pop"
        ],
        "tags": [
          "design",
          "stack"
        ],
        "js": "class MinStack {\n  constructor() {\n    // your code here\n  }\n  push(val) {}\n  pop() {}\n  top() {}\n  getMin() {}\n}",
        "py": "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def top(self):\n        pass\n    def get_min(self):\n        pass",
        "testCases": [
          {
            "input": "[push(-2),push(0),push(-3),getMin,pop,top,getMin]",
            "expectedOutput": "[-3,0,-2]"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Design Twitter",
        "slug": "design-twitter",
        "difficulty": "medium",
        "category": "design",
        "description": "Design a simplified version of Twitter. Implement postTweet(userId, tweetId), getNewsFeed(userId) returning 10 most recent tweets from user and followees, follow(followerId, followeeId), and unfollow(followerId, followeeId).",
        "examples": [
          {
            "input": "postTweet(1,5); getNewsFeed(1)=[5]; follow(1,2); postTweet(2,6); getNewsFeed(1)=[6,5]; unfollow(1,2); getNewsFeed(1)=[5]",
            "output": "[[5],[6,5],[5]]"
          }
        ],
        "constraints": [
          "1 <= userId, followerId, followeeId, tweetId <= 500",
          "All tweetIds are unique",
          "At most 3*10^4 calls"
        ],
        "hints": [
          "Store tweets per user with a global timestamp counter",
          "getNewsFeed: collect tweets from user + followees, use a max-heap to get 10 most recent"
        ],
        "tags": [
          "design",
          "heap",
          "hash-table"
        ],
        "js": "class Twitter {\n  constructor() {\n    // your code here\n  }\n  postTweet(userId, tweetId) {}\n  getNewsFeed(userId) {}\n  follow(followerId, followeeId) {}\n  unfollow(followerId, followeeId) {}\n}",
        "py": "class Twitter:\n    def __init__(self):\n        pass\n    def post_tweet(self, userId, tweetId):\n        pass\n    def get_news_feed(self, userId):\n        pass\n    def follow(self, followerId, followeeId):\n        pass\n    def unfollow(self, followerId, followeeId):\n        pass",
        "testCases": [
          {
            "input": "postTweet(1,5)\ngetNewsFeed(1)\nfollow(1,2)\npostTweet(2,6)\ngetNewsFeed(1)",
            "expectedOutput": "[[5],[6,5]]"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Design HashMap",
        "slug": "design-hashmap",
        "difficulty": "easy",
        "category": "design",
        "description": "Design a HashMap without using any built-in hash table libraries. Implement put(key, value), get(key) which returns -1 if not exists, and remove(key).",
        "examples": [
          {
            "input": "put(1,1); put(2,2); get(1)=1; get(3)=-1; put(2,1); get(2)=1; remove(2); get(2)=-1",
            "output": "[1,-1,1,-1]"
          }
        ],
        "constraints": [
          "0 <= key, value <= 10^6",
          "At most 10^4 calls to put, get, and remove"
        ],
        "hints": [
          "Use an array of buckets (size ~1000) to reduce collisions",
          "Each bucket is a linked list of (key, value) pairs to handle collisions"
        ],
        "tags": [
          "design",
          "hash-table",
          "linked-list"
        ],
        "js": "class MyHashMap {\n  constructor() {\n    // your code here\n  }\n  put(key, value) {}\n  get(key) {}\n  remove(key) {}\n}",
        "py": "class MyHashMap:\n    def __init__(self):\n        pass\n    def put(self, key, value):\n        pass\n    def get(self, key):\n        pass\n    def remove(self, key):\n        pass",
        "testCases": [
          {
            "input": "[put(1,1),put(2,2),get(1),get(3),put(2,1),get(2),remove(2),get(2)]",
            "expectedOutput": "[1,-1,1,-1]"
          }
        ],
        "xpReward": 60
      },
      {
        "title": "Serialize and Deserialize Binary Tree",
        "slug": "serialize-deserialize-tree",
        "difficulty": "hard",
        "category": "design",
        "description": "Design an algorithm to serialize a binary tree to a string and deserialize a string back to a binary tree. There is no restriction on your serialization/deserialization algorithm.",
        "examples": [
          {
            "input": "root = [1,2,3,null,null,4,5]",
            "output": "[1,2,3,null,null,4,5]",
            "explanation": "Serialize to string then deserialize back to the same tree"
          }
        ],
        "constraints": [
          "The number of nodes is in [0, 10^4]",
          "-1000 <= Node.val <= 1000"
        ],
        "hints": [
          "Use BFS (level-order) with null markers for serialize",
          "For deserialize, use a queue to process values level by level",
          "Or use DFS preorder: serialize joins values with delimiter, deserialize recurses"
        ],
        "tags": [
          "design",
          "tree",
          "bfs",
          "dfs",
          "string"
        ],
        "js": "function serialize(root) {\n  // return string\n}\nfunction deserialize(data) {\n  // return TreeNode\n}",
        "py": "def serialize(root):\n    pass\ndef deserialize(data):\n    pass",
        "testCases": [
          {
            "input": "[1,2,3,null,null,4,5]",
            "expectedOutput": "[1,2,3,null,null,4,5]"
          }
        ],
        "xpReward": 120
      }
    ]
  },
  {
    "dayNumber": 27,
    "topic": "Intervals",
    "lesson": "Interval problems: sort by start to merge. Sort by end to greedily keep non-overlapping intervals. Meeting rooms: sort + min-heap of end times. Two intervals overlap if start1 <= end2 AND start2 <= end1. Insert interval: find where it fits, merge with all overlapping.",
    "problems": [
      {
        "title": "Merge Intervals",
        "slug": "merge-intervals",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        "examples": [
          {
            "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            "output": "[[1,6],[8,10],[15,18]]"
          },
          {
            "input": "intervals = [[1,4],[4,5]]",
            "output": "[[1,5]]"
          }
        ],
        "constraints": [
          "1 <= intervals.length <= 10^4",
          "intervals[i].length == 2",
          "0 <= starti <= endi <= 10^4"
        ],
        "hints": [
          "Sort intervals by start time",
          "For each interval, if it overlaps with the last merged one, extend the end; otherwise add it"
        ],
        "tags": [
          "intervals",
          "array",
          "sorting"
        ],
        "js": "function merge(intervals) {\n  // your code here\n}",
        "py": "def merge(intervals):\n    pass",
        "testCases": [
          {
            "input": "[[1,3],[2,6],[8,10],[15,18]]",
            "expectedOutput": "[[1,6],[8,10],[15,18]]"
          },
          {
            "input": "[[1,4],[4,5]]",
            "expectedOutput": "[[1,5]]"
          },
          {
            "input": "[[1,4],[0,4]]",
            "expectedOutput": "[[0,4]]",
            "isHidden": true
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Insert Interval",
        "slug": "insert-interval",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Given an array of non-overlapping sorted intervals and a newInterval, insert it and merge if necessary. Return the resulting array.",
        "examples": [
          {
            "input": "intervals = [[1,3],[6,9]], newInterval = [2,5]",
            "output": "[[1,5],[6,9]]"
          },
          {
            "input": "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
            "output": "[[1,2],[3,10],[12,16]]"
          }
        ],
        "constraints": [
          "0 <= intervals.length <= 10^4",
          "intervals is sorted by starti"
        ],
        "hints": [
          "Add all intervals that end before newInterval starts",
          "Merge all overlapping intervals with newInterval",
          "Add all intervals that start after newInterval ends"
        ],
        "tags": [
          "intervals",
          "array"
        ],
        "js": "function insert(intervals, newInterval) {\n  // your code here\n}",
        "py": "def insert(intervals, new_interval):\n    pass",
        "testCases": [
          {
            "input": "[[1,3],[6,9]]\n[2,5]",
            "expectedOutput": "[[1,5],[6,9]]"
          },
          {
            "input": "[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]",
            "expectedOutput": "[[1,2],[3,10],[12,16]]"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Non-overlapping Intervals",
        "slug": "non-overlapping-intervals",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Given an array of intervals, return the minimum number of intervals you need to remove to make the rest non-overlapping.",
        "examples": [
          {
            "input": "intervals = [[1,2],[2,3],[3,4],[1,3]]",
            "output": "1",
            "explanation": "Remove [1,3] and the rest are non-overlapping"
          },
          {
            "input": "intervals = [[1,2],[1,2],[1,2]]",
            "output": "2"
          }
        ],
        "constraints": [
          "1 <= intervals.length <= 10^5"
        ],
        "hints": [
          "Sort by end time",
          "Greedily keep the interval with the earliest end time that doesn't overlap with the previous kept interval",
          "Count how many you remove"
        ],
        "tags": [
          "intervals",
          "greedy",
          "sorting"
        ],
        "js": "function eraseOverlapIntervals(intervals) {\n  // your code here\n}",
        "py": "def erase_overlap_intervals(intervals):\n    pass",
        "testCases": [
          {
            "input": "[[1,2],[2,3],[3,4],[1,3]]",
            "expectedOutput": "1"
          },
          {
            "input": "[[1,2],[1,2],[1,2]]",
            "expectedOutput": "2"
          },
          {
            "input": "[[1,2],[2,3]]",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Meeting Rooms II",
        "slug": "meeting-rooms-ii",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Given an array of meeting time intervals where intervals[i] = [start, end], return the minimum number of conference rooms required.",
        "examples": [
          {
            "input": "intervals = [[0,30],[5,10],[15,20]]",
            "output": "2"
          },
          {
            "input": "intervals = [[7,10],[2,4]]",
            "output": "1"
          }
        ],
        "constraints": [
          "1 <= intervals.length <= 10^4"
        ],
        "hints": [
          "Sort meetings by start time",
          "Use a min-heap of end times to track room availability",
          "If current meeting starts after the earliest ending meeting, reuse that room; otherwise add a new one"
        ],
        "tags": [
          "intervals",
          "heap",
          "sorting"
        ],
        "js": "function minMeetingRooms(intervals) {\n  // your code here\n}",
        "py": "def min_meeting_rooms(intervals):\n    pass",
        "testCases": [
          {
            "input": "[[0,30],[5,10],[15,20]]",
            "expectedOutput": "2"
          },
          {
            "input": "[[7,10],[2,4]]",
            "expectedOutput": "1"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Minimum Number of Arrows to Burst Balloons",
        "slug": "min-arrows-balloons",
        "difficulty": "medium",
        "category": "intervals",
        "description": "Balloons are represented as intervals [start, end] on a flat wall. An arrow shot vertically at position x bursts all balloons where start <= x <= end. Return the minimum number of arrows needed to burst all balloons.",
        "examples": [
          {
            "input": "points = [[10,16],[2,8],[1,6],[7,12]]",
            "output": "2"
          },
          {
            "input": "points = [[1,2],[3,4],[5,6],[7,8]]",
            "output": "4"
          }
        ],
        "constraints": [
          "1 <= points.length <= 10^5",
          "points[i].length == 2"
        ],
        "hints": [
          "Sort by end position",
          "Greedily shoot at the end of the current balloon to hit as many overlapping ones as possible"
        ],
        "tags": [
          "intervals",
          "greedy",
          "sorting"
        ],
        "js": "function findMinArrowShots(points) {\n  // your code here\n}",
        "py": "def find_min_arrow_shots(points):\n    pass",
        "testCases": [
          {
            "input": "[[10,16],[2,8],[1,6],[7,12]]",
            "expectedOutput": "2"
          },
          {
            "input": "[[1,2],[3,4],[5,6],[7,8]]",
            "expectedOutput": "4"
          },
          {
            "input": "[[1,2],[2,3],[3,4],[4,5]]",
            "expectedOutput": "2",
            "isHidden": true
          }
        ],
        "xpReward": 80
      }
    ]
  },
  {
    "dayNumber": 28,
    "topic": "Topological Sort",
    "lesson": "Topological sort orders nodes of a DAG so all edges point forward. Kahn's algorithm: track in-degrees, process nodes with 0 in-degree using a queue. DFS: run DFS, prepend node to result after finishing all neighbors. If a cycle is detected, topological sort is impossible.",
    "problems": [
      {
        "title": "Course Schedule",
        "slug": "course-schedule-topo",
        "difficulty": "medium",
        "category": "graph",
        "description": "There are numCourses courses labeled 0 to numCourses-1. prerequisites[i]=[a,b] means you must take b before a. Return true if you can finish all courses.",
        "examples": [
          {
            "input": "numCourses = 2, prerequisites = [[1,0]]",
            "output": "true"
          },
          {
            "input": "numCourses = 2, prerequisites = [[1,0],[0,1]]",
            "output": "false"
          }
        ],
        "constraints": [
          "1 <= numCourses <= 2000",
          "0 <= prerequisites.length <= 5000",
          "prerequisites[i].length == 2",
          "No duplicate prerequisites"
        ],
        "hints": [
          "This is cycle detection in a directed graph",
          "Kahn's algorithm: if we can process all nodes (zero in-degree queue empties with all nodes processed), no cycle exists"
        ],
        "tags": [
          "graph",
          "topological-sort",
          "dfs",
          "bfs"
        ],
        "js": "function canFinish(numCourses, prerequisites) {\n  // your code here\n}",
        "py": "def can_finish(num_courses, prerequisites):\n    pass",
        "testCases": [
          {
            "input": "2\n[[1,0]]",
            "expectedOutput": "true"
          },
          {
            "input": "2\n[[1,0],[0,1]]",
            "expectedOutput": "false"
          },
          {
            "input": "1\n[]",
            "expectedOutput": "true",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Course Schedule II",
        "slug": "course-schedule-ii",
        "difficulty": "medium",
        "category": "graph",
        "description": "Same setup as Course Schedule. Return the ordering of courses to finish all of them, or an empty array if impossible.",
        "examples": [
          {
            "input": "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
            "output": "[0,2,1,3]"
          },
          {
            "input": "numCourses = 1, prerequisites = []",
            "output": "[0]"
          }
        ],
        "constraints": [
          "1 <= numCourses <= 2000",
          "0 <= prerequisites.length <= numCourses*(numCourses-1)"
        ],
        "hints": [
          "Kahn's algorithm: the order in which nodes are dequeued from the zero-in-degree queue is the topological order",
          "If not all nodes are processed, return empty array (cycle detected)"
        ],
        "tags": [
          "graph",
          "topological-sort",
          "bfs"
        ],
        "js": "function findOrder(numCourses, prerequisites) {\n  // your code here\n}",
        "py": "def find_order(num_courses, prerequisites):\n    pass",
        "testCases": [
          {
            "input": "4\n[[1,0],[2,0],[3,1],[3,2]]",
            "expectedOutput": "[0,1,2,3]"
          },
          {
            "input": "2\n[[1,0]]",
            "expectedOutput": "[0,1]"
          },
          {
            "input": "2\n[[1,0],[0,1]]",
            "expectedOutput": "[]",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Alien Dictionary",
        "slug": "alien-dictionary",
        "difficulty": "hard",
        "category": "graph",
        "description": "There is a new alien language that uses the English alphabet. You are given a list of strings words from the alien language's dictionary which is sorted lexicographically. Derive the order of letters or return empty string if impossible.",
        "examples": [
          {
            "input": "words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]",
            "output": "\"wertf\""
          },
          {
            "input": "words = [\"z\",\"x\",\"z\"]",
            "output": "\"\"",
            "explanation": "Cycle detected"
          }
        ],
        "constraints": [
          "1 <= words.length <= 100",
          "1 <= words[i].length <= 100",
          "words[i] consists of only lowercase English letters"
        ],
        "hints": [
          "Compare adjacent words character by character to extract ordering edges",
          "Run topological sort on the resulting directed graph; cycle means return empty string"
        ],
        "tags": [
          "graph",
          "topological-sort",
          "string"
        ],
        "js": "function alienOrder(words) {\n  // your code here\n}",
        "py": "def alien_order(words):\n    pass",
        "testCases": [
          {
            "input": "[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]",
            "expectedOutput": "wertf"
          },
          {
            "input": "[\"z\",\"x\",\"z\"]",
            "expectedOutput": ""
          }
        ],
        "xpReward": 130
      },
      {
        "title": "Find All Possible Recipes from Given Supplies",
        "slug": "find-all-possible-recipes",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given recipes, their required ingredients, and available supplies, return all recipes you can create. A recipe can be an ingredient for another recipe.",
        "examples": [
          {
            "input": "recipes = [\"bread\"], ingredients = [[\"yeast\",\"flour\"]], supplies = [\"yeast\",\"flour\",\"corn\"]",
            "output": "[\"bread\"]"
          },
          {
            "input": "recipes = [\"bread\",\"sandwich\"], ingredients = [[\"yeast\",\"flour\"],[\"bread\",\"meat\"]], supplies = [\"yeast\",\"flour\",\"meat\"]",
            "output": "[\"bread\",\"sandwich\"]"
          }
        ],
        "constraints": [
          "n == recipes.length == ingredients.length",
          "1 <= n <= 100",
          "1 <= supplies.length <= 100"
        ],
        "hints": [
          "Model as a directed graph: ingredients point to recipes that need them",
          "Topological sort: a recipe is available once all its ingredients are available (in supplies or already created)"
        ],
        "tags": [
          "graph",
          "topological-sort",
          "hash-table"
        ],
        "js": "function findAllRecipes(recipes, ingredients, supplies) {\n  // your code here\n}",
        "py": "def find_all_recipes(recipes, ingredients, supplies):\n    pass",
        "testCases": [
          {
            "input": "[\"bread\"]\n[[\"yeast\",\"flour\"]]\n[\"yeast\",\"flour\",\"corn\"]",
            "expectedOutput": "[\"bread\"]"
          },
          {
            "input": "[\"bread\",\"sandwich\"]\n[[\"yeast\",\"flour\"],[\"bread\",\"meat\"]]\n[\"yeast\",\"flour\",\"meat\"]",
            "expectedOutput": "[\"bread\",\"sandwich\"]"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Parallel Courses III",
        "slug": "parallel-courses-iii",
        "difficulty": "hard",
        "category": "graph",
        "description": "You have n courses labeled 1 to n, each taking time[i] months. relations[i]=[a,b] means course b must be taken after course a finishes. Return the minimum number of months to complete all courses.",
        "examples": [
          {
            "input": "n = 3, relations = [[1,3],[2,3]], time = [3,2,5]",
            "output": "8",
            "explanation": "Courses 1 and 2 in parallel (3 months), then course 3 (5 months) = 8"
          },
          {
            "input": "n = 5, relations = [[1,5],[2,5],[3,5],[3,4],[4,5]], time = [1,2,3,4,5]",
            "output": "12"
          }
        ],
        "constraints": [
          "1 <= n <= 5*10^4",
          "0 <= relations.length <= min(n*(n-1)/2, 5*10^4)",
          "time.length == n"
        ],
        "hints": [
          "Topological sort with DP",
          "dp[i] = earliest time course i can be completed = time[i-1] + max(dp[prerequisites of i])",
          "Answer is max of all dp values"
        ],
        "tags": [
          "graph",
          "topological-sort",
          "dynamic-programming"
        ],
        "js": "function minimumTime(n, relations, time) {\n  // your code here\n}",
        "py": "def minimum_time(n, relations, time):\n    pass",
        "testCases": [
          {
            "input": "3\n[[1,3],[2,3]]\n[3,2,5]",
            "expectedOutput": "8"
          },
          {
            "input": "5\n[[1,5],[2,5],[3,5],[3,4],[4,5]]\n[1,2,3,4,5]",
            "expectedOutput": "12"
          }
        ],
        "xpReward": 110
      }
    ]
  },
  {
    "dayNumber": 29,
    "topic": "Minimum Spanning Trees",
    "lesson": "MST connects all nodes with minimum total edge weight. Kruskal's: sort edges by weight, add if no cycle (Union-Find). Prim's: start from any node, use min-heap to greedily add cheapest edge to unvisited node. Both are O(E log E). MST has exactly V-1 edges for V nodes.",
    "problems": [
      {
        "title": "Min Cost to Connect All Points",
        "slug": "min-cost-connect-points",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given n points on a 2D plane, return the minimum cost to connect all points. The cost of connecting two points is their Manhattan distance: |xi-xj| + |yi-yj|.",
        "examples": [
          {
            "input": "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]",
            "output": "20"
          },
          {
            "input": "points = [[3,12],[-2,5],[-4,1]]",
            "output": "18"
          }
        ],
        "constraints": [
          "1 <= points.length <= 1000",
          "-10^6 <= xi, yi <= 10^6",
          "All pairs of points are distinct"
        ],
        "hints": [
          "Build a complete graph with Manhattan distances as edge weights",
          "Apply Prim's or Kruskal's MST algorithm"
        ],
        "tags": [
          "graph",
          "mst",
          "prim",
          "kruskal"
        ],
        "js": "function minCostConnectPoints(points) {\n  // your code here\n}",
        "py": "def min_cost_connect_points(points):\n    pass",
        "testCases": [
          {
            "input": "[[0,0],[2,2],[3,10],[5,2],[7,0]]",
            "expectedOutput": "20"
          },
          {
            "input": "[[3,12],[-2,5],[-4,1]]",
            "expectedOutput": "18"
          },
          {
            "input": "[[0,0]]",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Connecting Cities with Minimum Cost",
        "slug": "connecting-cities-min-cost",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given N cities and connections[i]=[city1, city2, cost], return the minimum cost to connect all cities. Return -1 if it is impossible.",
        "examples": [
          {
            "input": "N = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]",
            "output": "6"
          },
          {
            "input": "N = 4, connections = [[1,2,3],[3,4,4]]",
            "output": "-1"
          }
        ],
        "constraints": [
          "1 <= N <= 10^4",
          "1 <= connections.length <= 10^4"
        ],
        "hints": [
          "Kruskal's algorithm: sort by cost, use Union-Find to detect cycles",
          "If the number of edges added is less than N-1, return -1"
        ],
        "tags": [
          "graph",
          "mst",
          "union-find"
        ],
        "js": "function minimumCost(N, connections) {\n  // your code here\n}",
        "py": "def minimum_cost(N, connections):\n    pass",
        "testCases": [
          {
            "input": "3\n[[1,2,5],[1,3,6],[2,3,1]]",
            "expectedOutput": "6"
          },
          {
            "input": "4\n[[1,2,3],[3,4,4]]",
            "expectedOutput": "-1"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Optimize Water Distribution in a Village",
        "slug": "optimize-water-distribution",
        "difficulty": "hard",
        "category": "graph",
        "description": "n houses. wells[i] = cost to build a well at house i+1. pipes = [house1, house2, cost] connections. Supply water to all houses at minimum cost using wells and pipes.",
        "examples": [
          {
            "input": "n = 3, wells = [1,2,2], pipes = [[1,2,1],[2,3,1]]",
            "output": "3",
            "explanation": "Build well at house 1 (cost 1), pipe to house 2 (cost 1), pipe to house 3 (cost 1)"
          }
        ],
        "constraints": [
          "1 <= n <= 10^4",
          "wells.length == n",
          "1 <= wells[i] <= 10^5"
        ],
        "hints": [
          "Add a virtual node 0 connected to each house i with edge weight wells[i-1]",
          "Find the MST of this extended graph including the virtual node"
        ],
        "tags": [
          "graph",
          "mst",
          "union-find"
        ],
        "js": "function minCostToSupplyWater(n, wells, pipes) {\n  // your code here\n}",
        "py": "def min_cost_to_supply_water(n, wells, pipes):\n    pass",
        "testCases": [
          {
            "input": "3\n[1,2,2]\n[[1,2,1],[2,3,1]]",
            "expectedOutput": "3"
          },
          {
            "input": "2\n[1,1]\n[[1,2,100]]",
            "expectedOutput": "2",
            "isHidden": true
          }
        ],
        "xpReward": 110
      },
      {
        "title": "Find MST Weight via Kruskal",
        "slug": "mst-weight",
        "difficulty": "medium",
        "category": "graph",
        "description": "Given n nodes (1-indexed) and weighted undirected edges, find the total weight of the Minimum Spanning Tree using Kruskal's algorithm. Assume the graph is connected.",
        "examples": [
          {
            "input": "n = 4, edges = [[1,2,1],[2,3,2],[3,4,3],[1,4,10]]",
            "output": "6"
          },
          {
            "input": "n = 2, edges = [[1,2,5]]",
            "output": "5"
          }
        ],
        "constraints": [
          "2 <= n <= 10^4",
          "1 <= edges.length <= 10^5",
          "edges[i] = [u, v, weight]"
        ],
        "hints": [
          "Sort edges by weight ascending",
          "Use Union-Find: add an edge if it connects two different components",
          "Stop when you have added n-1 edges"
        ],
        "tags": [
          "graph",
          "mst",
          "union-find",
          "sorting"
        ],
        "js": "function kruskalMST(n, edges) {\n  // your code here\n}",
        "py": "def kruskal_mst(n, edges):\n    pass",
        "testCases": [
          {
            "input": "4\n[[1,2,1],[2,3,2],[3,4,3],[1,4,10]]",
            "expectedOutput": "6"
          },
          {
            "input": "2\n[[1,2,5]]",
            "expectedOutput": "5"
          }
        ],
        "xpReward": 90
      },
      {
        "title": "Find Critical and Pseudo-Critical Edges in MST",
        "slug": "critical-pseudo-critical-edges",
        "difficulty": "hard",
        "category": "graph",
        "description": "Given n nodes and edges, find all critical edges (MST weight increases if removed) and pseudo-critical edges (appear in some but not all MSTs). Return [criticalEdges, pseudoCriticalEdges].",
        "examples": [
          {
            "input": "n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]",
            "output": "[[0,1],[2,3,4,5]]"
          }
        ],
        "constraints": [
          "2 <= n <= 100",
          "1 <= edges.length <= 200",
          "edges[i].length == 3"
        ],
        "hints": [
          "For each edge: try building MST without it (critical if weight increases)",
          "Try building MST with it forced as first edge (pseudo-critical if final weight equals original MST weight)"
        ],
        "tags": [
          "graph",
          "mst",
          "union-find"
        ],
        "js": "function findCriticalAndPseudoCriticalEdges(n, edges) {\n  // your code here\n}",
        "py": "def find_critical_and_pseudo_critical_edges(n, edges):\n    pass",
        "testCases": [
          {
            "input": "5\n[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]",
            "expectedOutput": "[[0,1],[2,3,4,5]]"
          }
        ],
        "xpReward": 140
      }
    ]
  },
  {
    "dayNumber": 30,
    "topic": "Dynamic Programming \u2014 Review",
    "lesson": "DP review: every problem needs (1) a clear state definition, (2) a recurrence relation, (3) base cases. Common patterns: linear DP (1D array), grid DP (2D), knapsack, string DP. Always start with brute force + memoization, then optimize to bottom-up tabulation.",
    "problems": [
      {
        "title": "Decode Ways",
        "slug": "decode-ways",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "A string of digits can be decoded: '1'='A', '2'='B', ..., '26'='Z'. Given string s, return the number of ways to decode it. Return 0 if no valid decoding.",
        "examples": [
          {
            "input": "s = \"12\"",
            "output": "2",
            "explanation": "\"AB\" (1 2) or \"L\" (12)"
          },
          {
            "input": "s = \"226\"",
            "output": "3",
            "explanation": "\"BZ\", \"VF\", or \"BBF\""
          },
          {
            "input": "s = \"06\"",
            "output": "0",
            "explanation": "'06' cannot be mapped to 'F' due to leading zero"
          }
        ],
        "constraints": [
          "1 <= s.length <= 100",
          "s contains only digits",
          "s may contain leading zeros"
        ],
        "hints": [
          "dp[i] = number of ways to decode s[0..i-1]",
          "Check single digit: s[i-1] != '0'",
          "Check two digits: s[i-2..i-1] is between 10 and 26"
        ],
        "tags": [
          "dynamic-programming",
          "string"
        ],
        "js": "function numDecodings(s) {\n  // your code here\n}",
        "py": "def num_decodings(s):\n    pass",
        "testCases": [
          {
            "input": "12",
            "expectedOutput": "2"
          },
          {
            "input": "226",
            "expectedOutput": "3"
          },
          {
            "input": "06",
            "expectedOutput": "0"
          },
          {
            "input": "11106",
            "expectedOutput": "2",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Word Break",
        "slug": "word-break",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given a string s and a dictionary wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
        "examples": [
          {
            "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
            "output": "true"
          },
          {
            "input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]",
            "output": "true"
          },
          {
            "input": "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
            "output": "false"
          }
        ],
        "constraints": [
          "1 <= s.length <= 300",
          "1 <= wordDict.length <= 1000",
          "All strings consist of lowercase English letters"
        ],
        "hints": [
          "dp[i] = can s[0..i-1] be segmented",
          "For each i, try all j < i: if dp[j] is true and s[j..i-1] is in dictionary, then dp[i] = true"
        ],
        "tags": [
          "dynamic-programming",
          "string",
          "trie"
        ],
        "js": "function wordBreak(s, wordDict) {\n  // your code here\n}",
        "py": "def word_break(s, word_dict):\n    pass",
        "testCases": [
          {
            "input": "leetcode\n[\"leet\",\"code\"]",
            "expectedOutput": "true"
          },
          {
            "input": "applepenapple\n[\"apple\",\"pen\"]",
            "expectedOutput": "true"
          },
          {
            "input": "catsandog\n[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
            "expectedOutput": "false"
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Maximum Product Subarray",
        "slug": "max-product-subarray",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given an integer array nums, find a subarray that has the largest product, and return the product.",
        "examples": [
          {
            "input": "nums = [2,3,-2,4]",
            "output": "6",
            "explanation": "[2,3] has the largest product 6"
          },
          {
            "input": "nums = [-2,0,-1]",
            "output": "0"
          }
        ],
        "constraints": [
          "1 <= nums.length <= 2*10^4",
          "-10 <= nums[i] <= 10",
          "The product of any prefix or suffix of nums fits in a 32-bit integer"
        ],
        "hints": [
          "Track both max and min product ending at current index",
          "A negative number can turn min into max and vice versa",
          "maxProd[i] = max(nums[i], maxProd[i-1]*nums[i], minProd[i-1]*nums[i])"
        ],
        "tags": [
          "dynamic-programming",
          "array"
        ],
        "js": "function maxProduct(nums) {\n  // your code here\n}",
        "py": "def max_product(nums):\n    pass",
        "testCases": [
          {
            "input": "[2,3,-2,4]",
            "expectedOutput": "6"
          },
          {
            "input": "[-2,0,-1]",
            "expectedOutput": "0"
          },
          {
            "input": "[-2,3,-4]",
            "expectedOutput": "24",
            "isHidden": true
          }
        ],
        "xpReward": 80
      },
      {
        "title": "Minimum Path Sum",
        "slug": "minimum-path-sum",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "Given an m x n grid filled with non-negative numbers, find a path from top-left to bottom-right (only right or down moves) which minimizes the sum of all numbers along the path.",
        "examples": [
          {
            "input": "grid = [[1,3,1],[1,5,1],[4,2,1]]",
            "output": "7",
            "explanation": "Path: 1 -> 3 -> 1 -> 1 -> 1"
          }
        ],
        "constraints": [
          "m == grid.length",
          "n == grid[i].length",
          "1 <= m, n <= 200",
          "0 <= grid[i][j] <= 200"
        ],
        "hints": [
          "dp[i][j] = minimum cost to reach cell (i,j)",
          "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
          "Handle first row and first column as base cases"
        ],
        "tags": [
          "dynamic-programming",
          "matrix"
        ],
        "js": "function minPathSum(grid) {\n  // your code here\n}",
        "py": "def min_path_sum(grid):\n    pass",
        "testCases": [
          {
            "input": "[[1,3,1],[1,5,1],[4,2,1]]",
            "expectedOutput": "7"
          },
          {
            "input": "[[1,2,3],[4,5,6]]",
            "expectedOutput": "12"
          }
        ],
        "xpReward": 70
      },
      {
        "title": "Unique Paths II",
        "slug": "unique-paths-ii",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "A robot is in an m x n grid. It can only move right or down. Some cells have obstacles (1 = obstacle, 0 = empty). Count the number of unique paths from top-left to bottom-right.",
        "examples": [
          {
            "input": "obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]",
            "output": "2"
          },
          {
            "input": "obstacleGrid = [[0,1],[0,0]]",
            "output": "1"
          }
        ],
        "constraints": [
          "m == obstacleGrid.length",
          "n == obstacleGrid[i].length",
          "1 <= m, n <= 100",
          "obstacleGrid[i][j] is 0 or 1"
        ],
        "hints": [
          "dp[i][j] = 0 if obstacle",
          "dp[i][j] = dp[i-1][j] + dp[i][j-1] otherwise",
          "Handle starting cell: if it has an obstacle, return 0"
        ],
        "tags": [
          "dynamic-programming",
          "matrix"
        ],
        "js": "function uniquePathsWithObstacles(obstacleGrid) {\n  // your code here\n}",
        "py": "def unique_paths_with_obstacles(obstacle_grid):\n    pass",
        "testCases": [
          {
            "input": "[[0,0,0],[0,1,0],[0,0,0]]",
            "expectedOutput": "2"
          },
          {
            "input": "[[0,1],[0,0]]",
            "expectedOutput": "1"
          },
          {
            "input": "[[1]]",
            "expectedOutput": "0",
            "isHidden": true
          }
        ],
        "xpReward": 70
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
            typescript: p.js,
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
    return NextResponse.json({ success: true, message: `Days 26-30 seeded: ${inserted} problems`, inserted });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}