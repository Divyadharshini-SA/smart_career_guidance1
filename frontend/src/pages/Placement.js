import React, { useState, useEffect } from 'react';
import API from '../api';

// ══════════════════════════════════════════════════════════════
// DIRECT LINKS — every topic goes to its exact page
// ══════════════════════════════════════════════════════════════

const DSA_PROBLEMS = [
  // Arrays — direct video links (Striver/NeetCode)
  {
    topic: 'Arrays', name: 'Two Sum',
    lc: 'https://leetcode.com/problems/two-sum/',
    gfg: 'https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/',
    hr: 'https://www.hackerrank.com/challenges/pairs/problem',
    yt: 'https://www.youtube.com/watch?v=KLlXCFG5TnA'
  },
  {
    topic: 'Arrays', name: 'Best Time to Buy & Sell Stock',
    lc: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    gfg: 'https://www.geeksforgeeks.org/best-time-to-buy-and-sell-stock/',
    hr: 'https://www.hackerrank.com/challenges/stockmax/problem',
    yt: 'https://www.youtube.com/watch?v=1pkOgXD63yU'
  },
  {
    topic: 'Arrays', name: 'Maximum Subarray (Kadane)',
    lc: 'https://leetcode.com/problems/maximum-subarray/',
    gfg: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/',
    hr: 'https://www.hackerrank.com/challenges/maxsubarray/problem',
    yt: 'https://www.youtube.com/watch?v=AHZpyENo7k4'
  },
  {
    topic: 'Arrays', name: 'Rotate Array',
    lc: 'https://leetcode.com/problems/rotate-array/',
    gfg: 'https://www.geeksforgeeks.org/array-rotation/',
    hr: 'https://www.hackerrank.com/challenges/array-left-rotation/problem',
    yt: 'https://www.youtube.com/watch?v=BHr381Guz3Y'
  },
  {
    topic: 'Arrays', name: 'Find Duplicate Number',
    lc: 'https://leetcode.com/problems/find-the-duplicate-number/',
    gfg: 'https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/',
    hr: 'https://www.hackerrank.com/challenges/duplicates/problem',
    yt: 'https://www.youtube.com/watch?v=32Ll35mhWg0'
  },

  // Linked List
  {
    topic: 'Linked List', name: 'Reverse Linked List',
    lc: 'https://leetcode.com/problems/reverse-linked-list/',
    gfg: 'https://www.geeksforgeeks.org/reverse-a-linked-list/',
    hr: 'https://www.hackerrank.com/challenges/reverse-a-linked-list/problem',
    yt: 'https://www.youtube.com/watch?v=D7y_hoT_YZI'
  },
  {
    topic: 'Linked List', name: 'Detect Cycle',
    lc: 'https://leetcode.com/problems/linked-list-cycle/',
    gfg: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/',
    hr: 'https://www.hackerrank.com/challenges/detect-whether-a-linked-list-contains-a-cycle/problem',
    yt: 'https://www.youtube.com/watch?v=wiOo4DC5GGA'
  },
  {
    topic: 'Linked List', name: 'Merge Two Sorted Lists',
    lc: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    gfg: 'https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/',
    hr: 'https://www.hackerrank.com/challenges/merge-two-sorted-linked-lists/problem',
    yt: 'https://www.youtube.com/watch?v=XIdigk956u0'
  },
  {
    topic: 'Linked List', name: 'Middle of Linked List',
    lc: 'https://leetcode.com/problems/middle-of-the-linked-list/',
    gfg: 'https://www.geeksforgeeks.org/write-a-c-function-to-print-the-middle-of-the-linked-list/',
    hr: 'https://www.hackerrank.com/challenges/find-the-merge-point-of-two-joined-linked-lists/problem',
    yt: 'https://www.youtube.com/watch?v=A2_ldqM4QcY'
  },
  {
    topic: 'Linked List', name: 'Remove Nth Node From End',
    lc: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    gfg: 'https://www.geeksforgeeks.org/remove-nth-node-from-end-of-the-linked-list/',
    hr: 'https://www.hackerrank.com/challenges/delete-a-node-from-a-linked-list/problem',
    yt: 'https://www.youtube.com/watch?v=XVuQxVej6y8'
  },

  // Stacks & Queues
  {
    topic: 'Stacks & Queues', name: 'Valid Parentheses',
    lc: 'https://leetcode.com/problems/valid-parentheses/',
    gfg: 'https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/',
    hr: 'https://www.hackerrank.com/challenges/balanced-brackets/problem',
    yt: 'https://www.youtube.com/watch?v=WTzjTskDFMg'
  },
  {
    topic: 'Stacks & Queues', name: 'Next Greater Element',
    lc: 'https://leetcode.com/problems/next-greater-element-i/',
    gfg: 'https://www.geeksforgeeks.org/next-greater-element/',
    hr: 'https://www.hackerrank.com/challenges/largest-rectangle/problem',
    yt: 'https://www.youtube.com/watch?v=Du881K7Jtk8'
  },
  {
    topic: 'Stacks & Queues', name: 'Min Stack',
    lc: 'https://leetcode.com/problems/min-stack/',
    gfg: 'https://www.geeksforgeeks.org/design-a-stack-that-supports-getmin-in-o1-time-and-o1-extra-space/',
    hr: 'https://www.hackerrank.com/challenges/maximum-element/problem',
    yt: 'https://www.youtube.com/watch?v=qkLl7nAwDPo'
  },
  {
    topic: 'Stacks & Queues', name: 'Implement Queue using Stacks',
    lc: 'https://leetcode.com/problems/implement-queue-using-stacks/',
    gfg: 'https://www.geeksforgeeks.org/queue-using-stacks/',
    hr: 'https://www.hackerrank.com/challenges/queue-using-two-stacks/problem',
    yt: 'https://www.youtube.com/watch?v=3Et9MrMc02A'
  },

  // Trees
  {
    topic: 'Trees', name: 'Maximum Depth of Binary Tree',
    lc: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    gfg: 'https://www.geeksforgeeks.org/write-a-c-program-to-find-the-maximum-depth-or-height-of-a-tree/',
    hr: 'https://www.hackerrank.com/challenges/tree-height-of-a-binary-tree/problem',
    yt: 'https://www.youtube.com/watch?v=hTM3phVI6YQ'
  },
  {
    topic: 'Trees', name: 'Inorder Traversal',
    lc: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
    gfg: 'https://www.geeksforgeeks.org/inorder-traversal-of-binary-tree/',
    hr: 'https://www.hackerrank.com/challenges/tree-inorder-traversal/problem',
    yt: 'https://www.youtube.com/watch?v=5dySuyZf9Qg'
  },
  {
    topic: 'Trees', name: 'Symmetric Tree',
    lc: 'https://leetcode.com/problems/symmetric-tree/',
    gfg: 'https://www.geeksforgeeks.org/symmetric-tree-tree-which-is-mirror-image-of-itself/',
    hr: 'https://www.hackerrank.com/challenges/symmetric-tree/problem',
    yt: 'https://www.youtube.com/watch?v=Mao9uzxwv0E'
  },
  {
    topic: 'Trees', name: 'Level Order Traversal (BFS)',
    lc: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    gfg: 'https://www.geeksforgeeks.org/level-order-tree-traversal/',
    hr: 'https://www.hackerrank.com/challenges/tree-level-order-traversal/problem',
    yt: 'https://www.youtube.com/watch?v=6ZnyEApgFYg'
  },
  {
    topic: 'Trees', name: 'Lowest Common Ancestor',
    lc: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
    gfg: 'https://www.geeksforgeeks.org/lowest-common-ancestor-binary-tree-set-1/',
    hr: 'https://www.hackerrank.com/challenges/binary-search-tree-lowest-common-ancestor/problem',
    yt: 'https://www.youtube.com/watch?v=13m9ZCB8gjw'
  },

  // Graphs
  {
    topic: 'Graphs', name: 'Number of Islands',
    lc: 'https://leetcode.com/problems/number-of-islands/',
    gfg: 'https://www.geeksforgeeks.org/find-number-of-islands/',
    hr: 'https://www.hackerrank.com/challenges/connected-cell-in-a-grid/problem',
    yt: 'https://www.youtube.com/watch?v=pV2kpPD66nE'
  },
  {
    topic: 'Graphs', name: 'BFS of Graph',
    lc: 'https://leetcode.com/problems/keys-and-rooms/',
    gfg: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/',
    hr: 'https://www.hackerrank.com/challenges/bfsshortreach/problem',
    yt: 'https://www.youtube.com/watch?v=-tgVpUgsQ5k'
  },
  {
    topic: 'Graphs', name: 'DFS of Graph',
    lc: 'https://leetcode.com/problems/number-of-provinces/',
    gfg: 'https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/',
    hr: 'https://www.hackerrank.com/challenges/dfs-edges/problem',
    yt: 'https://www.youtube.com/watch?v=PMMc4VsIacU'
  },
  {
    topic: 'Graphs', name: 'Topological Sort',
    lc: 'https://leetcode.com/problems/course-schedule/',
    gfg: 'https://www.geeksforgeeks.org/topological-sorting/',
    hr: 'https://www.hackerrank.com/challenges/torque-and-development/problem',
    yt: 'https://www.youtube.com/watch?v=dis_c84ejhQ'
  },

  // Dynamic Programming
  {
    topic: 'Dynamic Programming', name: 'Climbing Stairs',
    lc: 'https://leetcode.com/problems/climbing-stairs/',
    gfg: 'https://www.geeksforgeeks.org/count-ways-reach-nth-stair/',
    hr: 'https://www.hackerrank.com/challenges/dynamic-programming-classics-the-longest-common-subsequence/problem',
    yt: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI'
  },
  {
    topic: 'Dynamic Programming', name: 'Coin Change',
    lc: 'https://leetcode.com/problems/coin-change/',
    gfg: 'https://www.geeksforgeeks.org/coin-change-dp-7/',
    hr: 'https://www.hackerrank.com/challenges/coin-change-problem/problem',
    yt: 'https://www.youtube.com/watch?v=H9bfqozjoqs'
  },
  {
    topic: 'Dynamic Programming', name: 'Longest Common Subsequence',
    lc: 'https://leetcode.com/problems/longest-common-subsequence/',
    gfg: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/',
    hr: 'https://www.hackerrank.com/challenges/dynamic-programming-classics-the-longest-common-subsequence/problem',
    yt: 'https://www.youtube.com/watch?v=Ua0GhAsyan4'
  },
  {
    topic: 'Dynamic Programming', name: '0/1 Knapsack',
    lc: 'https://leetcode.com/problems/partition-equal-subset-sum/',
    gfg: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/',
    hr: 'https://www.hackerrank.com/challenges/unbounded-knapsack/problem',
    yt: 'https://www.youtube.com/watch?v=GqOmJHQZivw'
  },
  {
    topic: 'Dynamic Programming', name: 'Longest Increasing Subsequence',
    lc: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    gfg: 'https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/',
    hr: 'https://www.hackerrank.com/challenges/longest-increasing-subsequent/problem',
    yt: 'https://www.youtube.com/watch?v=ekcwMsSIzVc'
  },

  // Sorting & Searching
  {
    topic: 'Sorting & Searching', name: 'Binary Search',
    lc: 'https://leetcode.com/problems/binary-search/',
    gfg: 'https://www.geeksforgeeks.org/binary-search/',
    hr: 'https://www.hackerrank.com/challenges/binary-search-tree-insertion/problem',
    yt: 'https://www.youtube.com/watch?v=s4DPM8ct1pI'
  },
  {
    topic: 'Sorting & Searching', name: 'Merge Sort',
    lc: 'https://leetcode.com/problems/sort-an-array/',
    gfg: 'https://www.geeksforgeeks.org/merge-sort/',
    hr: 'https://www.hackerrank.com/challenges/merge-sort/problem',
    yt: 'https://www.youtube.com/watch?v=4VqmGXwpLqc'
  },
  {
    topic: 'Sorting & Searching', name: 'Quick Sort',
    lc: 'https://leetcode.com/problems/sort-an-array/',
    gfg: 'https://www.geeksforgeeks.org/quick-sort/',
    hr: 'https://www.hackerrank.com/challenges/quicksort1/problem',
    yt: 'https://www.youtube.com/watch?v=Hoixgm4-P4M'
  },
  {
    topic: 'Sorting & Searching', name: 'Search in Rotated Sorted Array',
    lc: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    gfg: 'https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/',
    hr: 'https://www.hackerrank.com/challenges/binary-search-tree-insertion/problem',
    yt: 'https://www.youtube.com/watch?v=oTfPJKGEHcc'
  },

  // Strings
  {
    topic: 'Strings', name: 'Reverse String',
    lc: 'https://leetcode.com/problems/reverse-string/',
    gfg: 'https://www.geeksforgeeks.org/reverse-a-string/',
    hr: 'https://www.hackerrank.com/challenges/reverse-a-string/problem',
    yt: 'https://www.youtube.com/watch?v=aUHEgIIu5_E'
  },
  {
    topic: 'Strings', name: 'Valid Anagram',
    lc: 'https://leetcode.com/problems/valid-anagram/',
    gfg: 'https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/',
    hr: 'https://www.hackerrank.com/challenges/anagram/problem',
    yt: 'https://www.youtube.com/watch?v=9UtInBqnCgA'
  },
  {
    topic: 'Strings', name: 'Longest Substring Without Repeating',
    lc: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    gfg: 'https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/',
    hr: 'https://www.hackerrank.com/challenges/sherlock-and-anagrams/problem',
    yt: 'https://www.youtube.com/watch?v=wiGpQwVHdE0'
  },
  {
    topic: 'Strings', name: 'Palindrome Check',
    lc: 'https://leetcode.com/problems/valid-palindrome/',
    gfg: 'https://www.geeksforgeeks.org/check-if-a-string-is-palindrome/',
    hr: 'https://www.hackerrank.com/challenges/palindrome-index/problem',
    yt: 'https://www.youtube.com/watch?v=xX_HBZLejRc'
  },
];

const APTITUDE_TOPICS = [
  { name: 'Percentages', indiabix: 'https://www.indiabix.com/aptitude/percentage/', yt: 'https://www.youtube.com/results?search_query=percentage+aptitude+problems' },
  { name: 'Profit & Loss', indiabix: 'https://www.indiabix.com/aptitude/profit-and-loss/', yt: 'https://www.youtube.com/results?search_query=profit+and+loss+aptitude' },
  { name: 'Time & Work', indiabix: 'https://www.indiabix.com/aptitude/time-and-work/', yt: 'https://www.youtube.com/results?search_query=time+and+work+aptitude+tricks' },
  { name: 'Speed & Distance', indiabix: 'https://www.indiabix.com/aptitude/time-and-distance/', yt: 'https://www.youtube.com/results?search_query=speed+distance+time+aptitude' },
  { name: 'Number System', indiabix: 'https://www.indiabix.com/aptitude/numbers/', yt: 'https://www.youtube.com/results?search_query=number+system+aptitude' },
  { name: 'HCF & LCM', indiabix: 'https://www.indiabix.com/aptitude/hcf-and-lcm/', yt: 'https://www.youtube.com/results?search_query=hcf+lcm+aptitude+tricks' },
  { name: 'Permutation & Combination', indiabix: 'https://www.indiabix.com/aptitude/permutation-and-combination/', yt: 'https://www.youtube.com/results?search_query=permutation+combination+aptitude' },
  { name: 'Probability', indiabix: 'https://www.indiabix.com/aptitude/probability/', yt: 'https://www.youtube.com/results?search_query=probability+aptitude+problems' },
  { name: 'Averages', indiabix: 'https://www.indiabix.com/aptitude/average/', yt: 'https://www.youtube.com/results?search_query=average+aptitude+problems' },
  { name: 'Ratio & Proportion', indiabix: 'https://www.indiabix.com/aptitude/ratio-and-proportion/', yt: 'https://www.youtube.com/results?search_query=ratio+proportion+aptitude' },
  { name: 'Simple Interest', indiabix: 'https://www.indiabix.com/aptitude/simple-interest/', yt: 'https://www.youtube.com/results?search_query=simple+interest+aptitude' },
  { name: 'Compound Interest', indiabix: 'https://www.indiabix.com/aptitude/compound-interest/', yt: 'https://www.youtube.com/results?search_query=compound+interest+aptitude' },
  { name: 'Ages Problems', indiabix: 'https://www.indiabix.com/aptitude/problems-on-ages/', yt: 'https://www.youtube.com/results?search_query=problems+on+ages+aptitude' },
  { name: 'Trains', indiabix: 'https://www.indiabix.com/aptitude/problems-on-trains/', yt: 'https://www.youtube.com/results?search_query=trains+aptitude+problems' },
  { name: 'Boats & Streams', indiabix: 'https://www.indiabix.com/aptitude/boats-and-streams/', yt: 'https://www.youtube.com/results?search_query=boats+streams+aptitude' },
  { name: 'Pipes & Cisterns', indiabix: 'https://www.indiabix.com/aptitude/pipes-and-cisterns/', yt: 'https://www.youtube.com/results?search_query=pipes+cisterns+aptitude' },
  { name: 'Partnership', indiabix: 'https://www.indiabix.com/aptitude/partnership/', yt: 'https://www.youtube.com/results?search_query=partnership+aptitude+problems' },
  { name: 'Mixtures & Alligations', indiabix: 'https://www.indiabix.com/aptitude/alligation-or-mixture/', yt: 'https://www.youtube.com/results?search_query=mixtures+alligations+aptitude' },
  { name: 'Geometry & Mensuration', indiabix: 'https://www.indiabix.com/aptitude/area/', yt: 'https://www.youtube.com/results?search_query=mensuration+aptitude+problems' },
  { name: 'Algebra', indiabix: 'https://www.indiabix.com/aptitude/simplification/', yt: 'https://www.youtube.com/results?search_query=algebra+aptitude+problems' },
];

const LOGICAL_TOPICS = [
  { name: 'Number Series', indiabix: 'https://www.indiabix.com/verbal-reasoning/number-series/', yt: 'https://www.youtube.com/results?search_query=number+series+reasoning' },
  { name: 'Letter Series', indiabix: 'https://www.indiabix.com/verbal-reasoning/letter-series/', yt: 'https://www.youtube.com/results?search_query=letter+series+reasoning' },
  { name: 'Blood Relations', indiabix: 'https://www.indiabix.com/verbal-reasoning/blood-relation/', yt: 'https://www.youtube.com/results?search_query=blood+relations+reasoning' },
  { name: 'Coding & Decoding', indiabix: 'https://www.indiabix.com/verbal-reasoning/coding-decoding/', yt: 'https://www.youtube.com/results?search_query=coding+decoding+reasoning' },
  { name: 'Direction Sense', indiabix: 'https://www.indiabix.com/verbal-reasoning/direction-sense-test/', yt: 'https://www.youtube.com/results?search_query=direction+sense+reasoning' },
  { name: 'Syllogisms', indiabix: 'https://www.indiabix.com/logical-reasoning/statement-and-argument/', yt: 'https://www.youtube.com/results?search_query=syllogism+reasoning+tricks' },
  { name: 'Seating Arrangements', indiabix: 'https://www.indiabix.com/logical-reasoning/seating-arrangement/', yt: 'https://www.youtube.com/results?search_query=seating+arrangement+reasoning' },
  { name: 'Puzzles', indiabix: 'https://www.indiabix.com/logical-reasoning/puzzle/', yt: 'https://www.youtube.com/results?search_query=puzzles+reasoning+problems' },
  { name: 'Venn Diagrams', indiabix: 'https://www.indiabix.com/logical-reasoning/venn-diagrams/', yt: 'https://www.youtube.com/results?search_query=venn+diagram+reasoning' },
  { name: 'Analogies', indiabix: 'https://www.indiabix.com/verbal-reasoning/analogy/', yt: 'https://www.youtube.com/results?search_query=analogy+reasoning+problems' },
  { name: 'Classification', indiabix: 'https://www.indiabix.com/verbal-reasoning/classification/', yt: 'https://www.youtube.com/results?search_query=classification+reasoning' },
  { name: 'Order & Ranking', indiabix: 'https://www.indiabix.com/verbal-reasoning/ranking-test/', yt: 'https://www.youtube.com/results?search_query=order+ranking+reasoning' },
  { name: 'Input & Output', indiabix: 'https://www.indiabix.com/logical-reasoning/machine-input-output/', yt: 'https://www.youtube.com/results?search_query=input+output+reasoning' },
  { name: 'Statements & Conclusions', indiabix: 'https://www.indiabix.com/logical-reasoning/statement-and-conclusion/', yt: 'https://www.youtube.com/results?search_query=statements+conclusions+reasoning' },
];

const VERBAL_TOPICS = [
  { name: 'Synonyms & Antonyms', indiabix: 'https://www.indiabix.com/verbal-ability/synonyms/', yt: 'https://www.youtube.com/results?search_query=synonyms+antonyms+english' },
  { name: 'Sentence Correction', indiabix: 'https://www.indiabix.com/verbal-ability/sentence-correction/', yt: 'https://www.youtube.com/results?search_query=sentence+correction+english' },
  { name: 'Fill in the Blanks', indiabix: 'https://www.indiabix.com/verbal-ability/fill-in-the-blanks/', yt: 'https://www.youtube.com/results?search_query=fill+in+the+blanks+english' },
  { name: 'Reading Comprehension', indiabix: 'https://www.indiabix.com/verbal-ability/reading-comprehension/', yt: 'https://www.youtube.com/results?search_query=reading+comprehension+tips' },
  { name: 'Idioms & Phrases', indiabix: 'https://www.indiabix.com/verbal-ability/idioms-and-phrases/', yt: 'https://www.youtube.com/results?search_query=idioms+phrases+english' },
  { name: 'Para Jumbles', indiabix: 'https://www.indiabix.com/verbal-ability/ordering-of-sentences/', yt: 'https://www.youtube.com/results?search_query=para+jumbles+english' },
  { name: 'Error Detection', indiabix: 'https://www.indiabix.com/verbal-ability/spotting-errors/', yt: 'https://www.youtube.com/results?search_query=error+detection+english' },
  { name: 'One Word Substitution', indiabix: 'https://www.indiabix.com/verbal-ability/one-word-substitutes/', yt: 'https://www.youtube.com/results?search_query=one+word+substitution+english' },
  { name: 'Active & Passive Voice', indiabix: 'https://www.indiabix.com/verbal-ability/change-of-voice/', yt: 'https://www.youtube.com/results?search_query=active+passive+voice+english' },
  { name: 'Vocabulary', indiabix: 'https://www.indiabix.com/verbal-ability/synonyms/', yt: 'https://www.youtube.com/results?search_query=english+vocabulary+for+placement' },
];

const INTERVIEW_RESOURCES = [
  { name: 'Tell Me About Yourself', yt: 'https://www.youtube.com/results?search_query=tell+me+about+yourself+answer', ib: 'https://www.interviewbit.com/hr-interview-questions/' },
  { name: 'Strengths & Weaknesses', yt: 'https://www.youtube.com/results?search_query=strengths+weaknesses+interview', ib: 'https://www.interviewbit.com/hr-interview-questions/#strengths-weaknesses' },
  { name: 'Why This Company?', yt: 'https://www.youtube.com/results?search_query=why+do+you+want+to+join+this+company', ib: 'https://www.interviewbit.com/hr-interview-questions/' },
  { name: 'Where Do You See Yourself in 5 Years?', yt: 'https://www.youtube.com/results?search_query=where+do+you+see+yourself+5+years+answer', ib: 'https://www.interviewbit.com/hr-interview-questions/' },
  { name: 'STAR Method for HR', yt: 'https://www.youtube.com/results?search_query=STAR+method+interview+answer', ib: 'https://www.interviewbit.com/blog/star-method-interview-questions/' },
  { name: 'Group Discussion Tips', yt: 'https://www.youtube.com/results?search_query=group+discussion+tips+placement', ib: 'https://www.interviewbit.com/group-discussion-topics/' },
  { name: 'Body Language Tips', yt: 'https://www.youtube.com/results?search_query=body+language+interview+tips', ib: 'https://www.interviewbit.com/blog/interview-tips/' },
  { name: 'Salary Negotiation', yt: 'https://www.youtube.com/results?search_query=salary+negotiation+tips+fresher', ib: 'https://www.interviewbit.com/blog/salary-negotiation-tips/' },
];

const COMPANIES = [
  { name: 'TCS', logo: '🔵', rounds: ['Aptitude Test', 'Technical MCQ', 'Technical Interview', 'HR Interview'], prep: 'https://www.geeksforgeeks.org/tcs-interview-experience/', yt: 'https://www.youtube.com/results?search_query=TCS+placement+preparation+2024' },
  { name: 'Infosys', logo: '🟢', rounds: ['Hackathon/InfyTQ', 'Reasoning & Verbal', 'Technical Interview', 'HR Interview'], prep: 'https://www.geeksforgeeks.org/infosys-interview-experience/', yt: 'https://www.youtube.com/results?search_query=Infosys+placement+preparation+2024' },
  { name: 'Wipro', logo: '🟡', rounds: ['Aptitude', 'Written Communication', 'Technical Interview', 'HR Interview'], prep: 'https://www.geeksforgeeks.org/wipro-interview-experience/', yt: 'https://www.youtube.com/results?search_query=Wipro+WILP+placement+preparation' },
  { name: 'Cognizant', logo: '🔷', rounds: ['GAME (Aptitude)', 'Coding Test', 'Technical Interview', 'HR Interview'], prep: 'https://www.geeksforgeeks.org/cognizant-interview-experience/', yt: 'https://www.youtube.com/results?search_query=Cognizant+CTS+placement+preparation' },
  { name: 'Accenture', logo: '🟣', rounds: ['Cognitive Test', 'Coding Test', 'Communication Test', 'HR Interview'], prep: 'https://www.geeksforgeeks.org/accenture-interview-experience/', yt: 'https://www.youtube.com/results?search_query=Accenture+placement+preparation+2024' },
  { name: 'Google', logo: '🔴', rounds: ['Online Coding', 'Phone Screen', '4-5 Onsite Rounds', 'System Design'], prep: 'https://www.geeksforgeeks.org/google-interview-preparation/', yt: 'https://www.youtube.com/results?search_query=google+interview+preparation+DSA' },
  { name: 'Amazon', logo: '🟠', rounds: ['Online Assessment', 'Technical Phone', 'Bar Raiser', 'Leadership Principles'], prep: 'https://www.geeksforgeeks.org/amazon-interview-preparation/', yt: 'https://www.youtube.com/results?search_query=amazon+SDE+interview+preparation' },
  { name: 'Microsoft', logo: '⬜', rounds: ['Online Coding', '4 Technical Rounds', 'Hiring Manager Round'], prep: 'https://www.geeksforgeeks.org/microsoft-interview-preparation/', yt: 'https://www.youtube.com/results?search_query=microsoft+interview+preparation+SDE' },
];

// ── Source button component ──────────────────────────────────
function SourceBtn({ href, icon, label, color }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 8, textDecoration: 'none',
      background: color + '15', border: `1.5px solid ${color}44`,
      color: color, fontSize: 12, fontWeight: 800,
      transition: 'all 0.15s', whiteSpace: 'nowrap'
    }}
      onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = color + '15'; e.currentTarget.style.color = color; }}
    >
      {icon} {label}
    </a>
  );
}

export default function Placement() {
  const [jobs, setJobs] = useState(null);
  const [tab, setTab] = useState('dsa');
  const [dsaFilter, setDsaFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/placement/jobs').then(r => setJobs(r.data)).catch(() => { });
  }, []);

  const TABS = [
    { key: 'dsa', label: '💻 DSA Problems', color: '#FF6584' },
    { key: 'aptitude', label: '📐 Aptitude', color: '#6C63FF' },
    { key: 'logical', label: '🧩 Logical', color: '#F9A825' },
    { key: 'verbal', label: '📝 Verbal', color: '#43E97B' },
    { key: 'interview', label: '🎤 Interview', color: '#AB47BC' },
    { key: 'companies', label: '🏢 Companies', color: '#29B6F6' },
    { key: 'jobs', label: '💼 Jobs', color: '#FF6584' },
  ];

  const dsaTopics = [...new Set(DSA_PROBLEMS.map(p => p.topic))];
  const filteredDSA = DSA_PROBLEMS.filter(p =>
    (dsaFilter === 'All' || p.topic === dsaFilter) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const activeTab = TABS.find(t => t.key === tab);

  return (
    <div style={{ maxWidth: 1050 }}>
      <h1 style={{ fontWeight: 900, fontSize: 28, marginBottom: 6 }}>💼 Placement Preparation</h1>
      <p style={{ color: '#7A7A9D', marginBottom: 24, fontSize: 15 }}>
        Topic-wise practice with direct links to LeetCode, GFG, IndiaBix, YouTube & more
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); }} style={{
            padding: '9px 18px', borderRadius: 12, border: `2px solid ${t.color}`,
            background: tab === t.key ? t.color : 'rgba(255,255,255,0.05)',
            color: tab === t.key ? '#fff' : t.color,
            fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── DSA PROBLEMS ── */}
      {tab === 'dsa' && (
        <div>
          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <input
              placeholder="🔍 Search problem..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#F0F0FF',
                fontSize: 14, fontWeight: 600, width: 260, outline: 'none',
                fontFamily: 'Nunito,sans-serif'
              }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['All', ...dsaTopics].map(t => (
                <button key={t} onClick={() => setDsaFilter(t)} style={{
                  padding: '8px 14px', borderRadius: 10, border: '2px solid #FF658444',
                  background: dsaFilter === t ? '#FF6584' : 'rgba(255,255,255,0.05)',
                  color: dsaFilter === t ? '#fff' : '#FF6584',
                  fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s'
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Problem list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredDSA.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#7A7A9D' }}>
                No problems found for "{search}"
              </div>
            ) : filteredDSA.map((p, i) => (
              <div key={p.name} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 20px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: '#FF658418',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 13, color: '#FF6584', flexShrink: 0
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#F0F0FF' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#7A7A9D', fontWeight: 600 }}>{p.topic}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <SourceBtn href={p.lc} icon="🟨" label="LeetCode" color="#F89F1B" />
                  <SourceBtn href={p.gfg} icon="🟩" label="GFG" color="#2F8D46" />
                  <SourceBtn href={p.hr} icon="⬛" label="HackerRank" color="#1BA94C" />
                  <SourceBtn href={p.yt} icon="🔴" label="▶ Video" color="#FF0000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── APTITUDE ── */}
      {tab === 'aptitude' && (
        <div>
          <p style={{ color: '#7A7A9D', marginBottom: 16, fontSize: 14 }}>
            Click any topic to go directly to that practice page
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
            {APTITUDE_TOPICS.map((t, i) => (
              <div key={t.name} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 18px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: '#6C63FF18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 12, color: '#6C63FF', flexShrink: 0
                  }}>{i + 1}</div>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#F0F0FF' }}>{t.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <SourceBtn href={t.indiabix} icon="📘" label="IndiaBix" color="#6C63FF" />
                  <SourceBtn href={t.yt} icon="🔴" label="YouTube" color="#FF0000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LOGICAL ── */}
      {tab === 'logical' && (
        <div>
          <p style={{ color: '#7A7A9D', marginBottom: 16, fontSize: 14 }}>
            Click any topic to go directly to that reasoning practice page
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
            {LOGICAL_TOPICS.map((t, i) => (
              <div key={t.name} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 18px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: '#F9A82518',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 12, color: '#F9A825', flexShrink: 0
                  }}>{i + 1}</div>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#F0F0FF' }}>{t.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <SourceBtn href={t.indiabix} icon="📘" label="IndiaBix" color="#F9A825" />
                  <SourceBtn href={t.yt} icon="🔴" label="YouTube" color="#FF0000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VERBAL ── */}
      {tab === 'verbal' && (
        <div>
          <p style={{ color: '#7A7A9D', marginBottom: 16, fontSize: 14 }}>
            Click any topic to practice directly on IndiaBix or watch tutorials
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
            {VERBAL_TOPICS.map((t, i) => (
              <div key={t.name} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 18px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: '#43E97B18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 12, color: '#43E97B', flexShrink: 0
                  }}>{i + 1}</div>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#F0F0FF' }}>{t.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <SourceBtn href={t.indiabix} icon="📘" label="IndiaBix" color="#43E97B" />
                  <SourceBtn href={t.yt} icon="🔴" label="YouTube" color="#FF0000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INTERVIEW ── */}
      {tab === 'interview' && (
        <div>
          <p style={{ color: '#7A7A9D', marginBottom: 16, fontSize: 14 }}>
            Prepare for HR and behavioral interviews with direct resources
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INTERVIEW_RESOURCES.map((r, i) => (
              <div key={r.name} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 20px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 12, flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: '#AB47BC18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 13, color: '#AB47BC', flexShrink: 0
                  }}>{i + 1}</div>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#F0F0FF' }}>{r.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <SourceBtn href={r.yt} icon="🔴" label="YouTube" color="#FF0000" />
                  <SourceBtn href={r.ib} icon="💡" label="InterviewBit" color="#AB47BC" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COMPANIES ── */}
      {tab === 'companies' && (
        <div>
          <p style={{ color: '#7A7A9D', marginBottom: 16, fontSize: 14 }}>
            Company-specific preparation — rounds, tips and direct links
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {COMPANIES.map(c => (
              <div key={c.name} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 22,
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: '#29B6F618',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                  }}>{c.logo}</div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#F0F0FF' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#7A7A9D', fontWeight: 600 }}>
                      {c.rounds.length} interview rounds
                    </div>
                  </div>
                </div>

                {/* Rounds */}
                <div style={{ marginBottom: 14 }}>
                  {c.rounds.map((r, i) => (
                    <div key={r} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6, background: '#29B6F618',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 900, color: '#29B6F6', flexShrink: 0
                      }}>R{i + 1}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF' }}>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <SourceBtn href={c.prep} icon="🟩" label="GFG Prep" color="#2F8D46" />
                  <SourceBtn href={c.yt} icon="🔴" label="YouTube" color="#FF0000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── JOBS ── */}
      {tab === 'jobs' && jobs && (
        <div style={{ maxWidth: 600 }}>
          <div style={{
            background: 'linear-gradient(135deg,#29B6F6,#81d4fa)',
            borderRadius: 20, padding: 24, color: '#fff', marginBottom: 20
          }}>
            <h2 style={{ fontWeight: 900, fontSize: 20, marginBottom: 4 }}>
              💼 Recommended for: {jobs.career_domain}
            </h2>
            <p style={{ opacity: 0.85, fontSize: 14 }}>Entry-level roles matching your career profile</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.recommended_roles.map(r => (
              <div key={r} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 22 }}>💼</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#F0F0FF' }}>{r}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <SourceBtn href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(r)}`} icon="🔵" label="LinkedIn" color="#0077B5" />
                  <SourceBtn href={`https://www.naukri.com/${r.toLowerCase().replace(/ /g, '-')}-jobs`} icon="🟠" label="Naukri" color="#FF7555" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // ── WAY 2: Company Tips, Rounds, Packages ────────────────────
// const COMPANY_TIPS = {
//   'Google Interview Pattern': {
//     rounds: ['Online Assessment (Coding)', 'Phone Screen', 'Technical Round 1 (DSA)', 'Technical Round 2 (DSA)', 'System Design', 'Behavioural Round', 'Hiring Committee Review'],
//     tips: ['Solve LeetCode Hard problems daily', 'System Design is critical for SDE 2+', 'Think aloud while coding — communication matters', 'Use STAR method for behavioural rounds', 'Data Structures and Algorithms are core focus'],
//     difficulty: '⭐⭐⭐⭐⭐ Very Hard',
//     package: '₹40L - ₹1.5Cr',
//     focus: 'DSA + System Design + Behavioural',
//   },
//   'Microsoft Interview Pattern': {
//     rounds: ['Online Coding Test', 'Technical Round 1 (DSA)', 'Technical Round 2 (CS Fundamentals)', 'Design Round', 'HR Round'],
//     tips: ['Focus on problem-solving approach not just solution', 'OOP concepts are frequently tested', 'OS DBMS Networking fundamentals important', 'Projects and internship experience valued', 'Practice medium-hard LeetCode problems'],
//     difficulty: '⭐⭐⭐⭐ Hard',
//     package: '₹30L - ₹90L',
//     focus: 'DSA + OOP + CS Fundamentals',
//   },
//   'Amazon Leadership Principles': {
//     rounds: ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'System Design', 'Bar Raiser Round', 'HR Round'],
//     tips: ['Prepare 2 STAR stories for each of 16 Leadership Principles', 'Customer Obsession is the most important LP', 'Bar Raiser round is the toughest — be ready', 'Dive Deep and Deliver Results LPs tested heavily', 'LeetCode Medium problems sufficient for coding'],
//     difficulty: '⭐⭐⭐⭐ Hard',
//     package: '₹25L - ₹80L',
//     focus: 'Leadership Principles + DSA + System Design',
//   },
//   'Meta Coding Focus': {
//     rounds: ['Recruiter Call', 'Technical Screen (Coding)', 'Onsite Coding Round 1', 'Onsite Coding Round 2', 'System Design', 'Behavioural Round'],
//     tips: ['Coding is more important than System Design at Meta', 'Focus on optimal solutions not just working code', 'Graph and Tree problems are very common', 'Explain trade-offs in every solution', 'Product Sense questions for senior roles'],
//     difficulty: '⭐⭐⭐⭐⭐ Very Hard',
//     package: '₹40L - ₹1.2Cr',
//     focus: 'Coding Excellence + System Design',
//   },
//   'Apple Interview Style': {
//     rounds: ['Recruiter Screen', 'Technical Phone Screen', 'Onsite Technical x4', 'Manager Round', 'HR Round'],
//     tips: ['Apple focuses on real-world problem solving', 'Deep knowledge of your tech stack expected', 'Attention to detail and product quality stressed', 'Research Apple products before interview', 'System Design for experienced roles'],
//     difficulty: '⭐⭐⭐⭐ Hard',
//     package: '₹35L - ₹1Cr',
//     focus: 'Deep Technical Knowledge + Product Thinking',
//   },
//   'System Design Basics': {
//     rounds: ['Requirements Clarification', 'High-level Architecture', 'Component Deep Dive', 'Scalability Discussion', 'Trade-offs Q&A'],
//     tips: ['Always start with clarifying requirements', 'Draw diagrams while explaining', 'Discuss trade-offs (SQL vs NoSQL etc)', 'Common problems: URL Shortener Chat App Netflix', 'Important for SDE 2+ roles in product companies'],
//     difficulty: '⭐⭐⭐⭐ Hard',
//     package: 'SDE 2+ roles',
//     focus: 'Architecture + Scalability + Trade-offs',
//   },
//   'Behavioral Round Tips': {
//     rounds: ['Self Introduction', 'Past Experience Discussion', 'STAR-based Questions', 'Situational Questions', 'Questions for Interviewer'],
//     tips: ['Prepare 5-7 STAR stories covering all themes', 'Common themes: Leadership Failure Teamwork Conflict', 'Always end with positive outcome or learning', 'Research company values before interview', 'Prepare 3 smart questions to ask interviewer'],
//     difficulty: '⭐⭐⭐ Medium',
//     package: 'All roles',
//     focus: 'STAR Method + Company Values + Storytelling',
//   },
//   'Mock Interview Practice': {
//     rounds: ['Self Introduction Practice', 'Technical Mock Round', 'HR Mock Round', 'Group Discussion Practice', 'Full Mock Interview'],
//     tips: ['Record yourself and review body language', 'Practice with a friend or mentor', 'Use Pramp for free peer mock interviews', 'Time yourself — answers should be 1-3 minutes', 'Take mock tests weekly before placements'],
//     difficulty: '⭐ Practice Only',
//     package: 'Preparation Phase',
//     focus: 'Real Interview Simulation',
//   },
//   'TCS NQT Pattern': {
//     rounds: ['Numerical Ability (26 Qs / 40 min)', 'Verbal Ability (24 Qs / 30 min)', 'Reasoning Ability (30 Qs / 50 min)', 'Programming Logic (10 Qs / 15 min)', 'Hands-on Coding (1-2 Qs / 45 min)', 'Technical Interview', 'HR Interview'],
//     tips: ['Practice IndiaBix daily for aptitude', 'C output-based questions are very common', 'Prepare 2 coding problems in any language', 'Strong verbal skills improve overall score', 'NQT score is valid for 2 years'],
//     difficulty: '⭐⭐⭐ Medium',
//     package: '₹3.36L - ₹7L',
//     focus: 'Aptitude + Verbal + Basic Coding',
//   },
//   'Infosys InfyTQ': {
//     rounds: ['InfyTQ Foundation Certification', 'InfyTQ Professional Certification', 'Hackathon (Optional)', 'HR Interview'],
//     tips: ['Get InfyTQ certified before applying', 'Python and DSA are primary focus', 'Participate in hackathon for bonus points', 'Communication and English skills evaluated', 'Core Python programs must be practiced'],
//     difficulty: '⭐⭐⭐ Medium',
//     package: '₹3.6L - ₹8L',
//     focus: 'InfyTQ Certification + Python + DSA',
//   },
//   'Wipro NLTH Pattern': {
//     rounds: ['Online Aptitude Test', 'Written Communication Test', 'Technical Interview', 'HR Interview'],
//     tips: ['NLTH = National Level Talent Hunt', 'Focus on aptitude speed and accuracy', 'Written communication test is unique to Wipro', 'Basic programming knowledge is sufficient', 'Verbal ability and grammar are important'],
//     difficulty: '⭐⭐ Easy-Medium',
//     package: '₹3.5L - ₹6.5L',
//     focus: 'Aptitude + Communication + Basic Tech',
//   },
//   'Cognizant GenC Pattern': {
//     rounds: ['GenC: Aptitude + Logical + Verbal', 'GenC Next: Adds Coding Round', 'GenC Elevate: Advanced Coding', 'Technical Interview', 'HR Interview'],
//     tips: ['3 tiers: GenC / GenC Next / GenC Elevate', 'GenC Elevate has highest package', 'Java and SQL are primary tech topics', 'Practice coding on HackerRank', 'Soft skills evaluated throughout'],
//     difficulty: '⭐⭐⭐ Medium',
//     package: '₹4L - ₹10L',
//     focus: 'Aptitude + Java + SQL + Coding',
//   },
//   'HCL Mock Test': {
//     rounds: ['Aptitude Test (Quant + Logical + Verbal)', 'Technical Test (CS Fundamentals)', 'Coding Round (2 problems)', 'Technical Interview', 'HR Interview'],
//     tips: ['Focus on data structures basics', 'SQL queries are commonly asked', 'Projects discussed in technical interview', 'GD may be included in some drives', 'HCL TechBee is separate program for freshers'],
//     difficulty: '⭐⭐ Easy-Medium',
//     package: '₹3.5L - ₹7L',
//     focus: 'Aptitude + CS Fundamentals + Basic Coding',
//   },
//   'Accenture Test Pattern': {
//     rounds: ['Cognitive and Technical Assessment (90 min)', 'Coding Test (45 min)', 'Communication Assessment', 'HR Interview'],
//     tips: ['Cognitive test has abstract reasoning questions', 'Coding test has 2 medium-difficulty problems', 'Communication skills are heavily evaluated', 'No negative marking in aptitude section', 'Practice pseudocode questions'],
//     difficulty: '⭐⭐ Easy-Medium',
//     package: '₹4.5L - ₹8L',
//     focus: 'Cognitive + Coding + Communication',
//   },
//   'Capgemini Aptitude Focus': {
//     rounds: ['Pseudo Code Test (22 Qs)', 'Game-based Assessment', 'Technical Written Test', 'Technical Interview', 'HR Interview'],
//     tips: ['Pseudo code section is unique — practice flowcharts', 'Game-based assessment tests logical thinking', 'Core Java and Python in tech round', 'No full coding round in most drives', 'Essay writing may be included'],
//     difficulty: '⭐⭐ Easy-Medium',
//     package: '₹3.8L - ₹7L',
//     focus: 'Pseudo Code + Aptitude + Core Tech',
//   },
//   'Tech Mahindra Pattern': {
//     rounds: ['Aptitude Test (Quant + Logical)', 'Technical Test (Programming + Networking)', 'Group Discussion', 'Technical Interview', 'HR Interview'],
//     tips: ['Networking questions common — unlike other companies', 'Basic programming in C Java Python', 'GD topics are current affairs or technical', 'Communication skills highly valued', 'Practice verbal ability sections'],
//     difficulty: '⭐⭐ Easy-Medium',
//     package: '₹3.25L - ₹6L',
//     focus: 'Aptitude + Networking + Communication',
//   },
//   'GATE CS Preparation': {
//     rounds: ['GATE Exam (3 hrs / 65 Qs)', 'Score valid 3 years', 'PSU Technical Interview', 'M.Tech Admission Process'],
//     tips: ['NPTEL and GFG are best free resources', 'Previous year questions are very important', 'DS Algorithms OS DBMS are high-weightage', 'Attempt full mock tests from October onwards', 'Join a study group for accountability'],
//     difficulty: '⭐⭐⭐⭐ Hard',
//     package: '₹8L - ₹20L (PSUs)',
//     focus: 'All CS Fundamentals + Mathematics',
//   },
//   'PSU Exam Pattern': {
//     rounds: ['GATE Score Shortlisting', 'Technical Interview', 'HR Interview', 'Medical Test'],
//     tips: ['Good GATE score is the primary requirement', 'BHEL ONGC IOCL BSNL DRDO recruit via GATE', 'Technical interview covers all core CS subjects', 'GD may be part of selection process', 'Government job with excellent benefits'],
//     difficulty: '⭐⭐⭐⭐ Hard',
//     package: '₹8L - ₹25L + Benefits',
//     focus: 'GATE Score + Core CS',
//   },
//   'Startup Interview Culture': {
//     rounds: ['Recruiter Screening Call', 'Take-home Assignment', 'Technical Deep Dive', 'Culture Fit Round', 'Founder Round (sometimes)', 'Offer Discussion'],
//     tips: ['Startups value generalist skills — learn full stack', 'Show passion for the product domain', 'Research the startup thoroughly beforehand', 'Negotiate equity not just salary', 'Speed and ownership mindset is valued'],
//     difficulty: '⭐⭐⭐ Medium',
//     package: 'Varies + Equity',
//     focus: 'Full Stack + Product Thinking + Ownership',
//   },
//   'Full Stack Questions': {
//     rounds: ['Frontend Round (HTML CSS JS React)', 'Backend Round (APIs Database)', 'System Design (small scale)', 'Coding Round', 'HR Round'],
//     tips: ['Know React hooks deeply', 'REST API design is important', 'SQL and NoSQL basic knowledge required', 'Git and deployment knowledge valued', 'Build and showcase 2-3 real projects'],
//     difficulty: '⭐⭐⭐ Medium',
//     package: '₹6L - ₹20L',
//     focus: 'React + Node/Python + SQL + APIs',
//   },
// };

// // ── WAY 1: Specific Resources per Topic ──────────────────────
// const TOPIC_RESOURCES = {
//   'Google Interview Pattern':      [{ label: 'Google Interview Prep - GFG', url: 'https://www.geeksforgeeks.org/google-interview-preparation/', icon: '🟢' }, { label: 'LeetCode Google Problems', url: 'https://leetcode.com/company/google/', icon: '🟠' }, { label: 'Google Interview - YouTube', url: 'https://www.youtube.com/results?search_query=google+software+engineer+interview', icon: '🔴' }, { label: 'Glassdoor Google Q&A', url: 'https://www.glassdoor.com/Interview/Google-Interview-Questions-E9079.htm', icon: '🔵' }],
//   'Microsoft Interview Pattern':   [{ label: 'Microsoft Interview - GFG', url: 'https://www.geeksforgeeks.org/microsoft-interview-preparation/', icon: '🟢' }, { label: 'LeetCode Microsoft Problems', url: 'https://leetcode.com/company/microsoft/', icon: '🟠' }, { label: 'Microsoft Interview - YouTube', url: 'https://www.youtube.com/results?search_query=microsoft+interview+preparation+2024', icon: '🔴' }, { label: 'Glassdoor Microsoft Q&A', url: 'https://www.glassdoor.com/Interview/Microsoft-Interview-Questions-E1651.htm', icon: '🔵' }],
//   'Amazon Leadership Principles':  [{ label: 'Amazon Interview - GFG', url: 'https://www.geeksforgeeks.org/amazon-interview-preparation/', icon: '🟢' }, { label: 'LeetCode Amazon Problems', url: 'https://leetcode.com/company/amazon/', icon: '🟠' }, { label: '16 LPs Explained - YouTube', url: 'https://www.youtube.com/results?search_query=amazon+leadership+principles+interview', icon: '🔴' }, { label: 'Amazon Official Interview Page', url: 'https://www.amazon.jobs/en/landing_pages/interviewing-at-amazon', icon: '🔵' }],
//   'Meta Coding Focus':             [{ label: 'Meta Interview - GFG', url: 'https://www.geeksforgeeks.org/facebook-interview-preparation/', icon: '🟢' }, { label: 'LeetCode Meta Problems', url: 'https://leetcode.com/company/facebook/', icon: '🟠' }, { label: 'Meta Interview - YouTube', url: 'https://www.youtube.com/results?search_query=meta+facebook+software+engineer+interview', icon: '🔴' }, { label: 'Meta Careers Prep Guide', url: 'https://www.metacareers.com/swe-prep-onsite/', icon: '🔵' }],
//   'Apple Interview Style':         [{ label: 'Apple Interview - GFG', url: 'https://www.geeksforgeeks.org/apple-interview-preparation/', icon: '🟢' }, { label: 'LeetCode Apple Problems', url: 'https://leetcode.com/company/apple/', icon: '🟠' }, { label: 'Apple Interview - YouTube', url: 'https://www.youtube.com/results?search_query=apple+software+engineer+interview', icon: '🔴' }, { label: 'Glassdoor Apple Q&A', url: 'https://www.glassdoor.com/Interview/Apple-Interview-Questions-E1138.htm', icon: '🔵' }],
//   'System Design Basics':          [{ label: 'System Design Primer - GitHub', url: 'https://github.com/donnemartin/system-design-primer', icon: '⭐' }, { label: 'System Design - GFG', url: 'https://www.geeksforgeeks.org/system-design-tutorial/', icon: '🟢' }, { label: 'System Design - YouTube', url: 'https://www.youtube.com/results?search_query=system+design+interview+2024', icon: '🔴' }, { label: 'High Scalability Blog', url: 'http://highscalability.com/', icon: '🔵' }],
//   'System Design for Startups':    [{ label: 'System Design Primer - GitHub', url: 'https://github.com/donnemartin/system-design-primer', icon: '⭐' }, { label: 'System Design - GFG', url: 'https://www.geeksforgeeks.org/system-design-tutorial/', icon: '🟢' }, { label: 'Startup System Design - YouTube', url: 'https://www.youtube.com/results?search_query=system+design+for+startups', icon: '🔴' }, { label: 'Martin Fowler Architecture', url: 'https://martinfowler.com/architecture/', icon: '🔵' }],
//   'Behavioral Round Tips':         [{ label: 'HR Questions - GFG', url: 'https://www.geeksforgeeks.org/hr-interview-questions/', icon: '🟢' }, { label: 'STAR Method - YouTube', url: 'https://www.youtube.com/results?search_query=STAR+method+behavioral+interview', icon: '🔴' }, { label: 'Top 50 HR Questions - IndiaBix', url: 'https://www.indiabix.com/hr-interview/questions-and-answers/', icon: '🔵' }, { label: 'Big Interview Platform', url: 'https://biginterview.com/', icon: '⭐' }],
//   'Mock Interview Practice':       [{ label: 'Pramp - Free Mock Interviews', url: 'https://www.pramp.com/', icon: '⭐' }, { label: 'Interviewing.io', url: 'https://interviewing.io/', icon: '🔵' }, { label: 'LeetCode Mock Assessment', url: 'https://leetcode.com/assessment/', icon: '🟠' }, { label: 'GFG Mock Tests', url: 'https://www.geeksforgeeks.org/quiz-corner-gq/', icon: '🟢' }],
//   'TCS NQT Pattern':               [{ label: 'TCS NQT Guide - GFG', url: 'https://www.geeksforgeeks.org/tcs-nqt-national-qualifier-test/', icon: '🟢' }, { label: 'TCS NQT - PrepInsta', url: 'https://prepinsta.com/tcs-nqt/', icon: '🟣' }, { label: 'TCS NQT - YouTube', url: 'https://www.youtube.com/results?search_query=TCS+NQT+preparation+2024', icon: '🔴' }, { label: 'IndiaBix Aptitude Practice', url: 'https://www.indiabix.com/', icon: '🔵' }],
//   'Infosys InfyTQ':                [{ label: 'Infosys Interview - GFG', url: 'https://www.geeksforgeeks.org/infosys-interview-preparation/', icon: '🟢' }, { label: 'InfyTQ Official Platform', url: 'https://www.infytq.com/', icon: '🔵' }, { label: 'InfyTQ - PrepInsta', url: 'https://prepinsta.com/infosys/', icon: '🟣' }, { label: 'InfyTQ - YouTube', url: 'https://www.youtube.com/results?search_query=infosys+infytq+certification', icon: '🔴' }],
//   'Wipro NLTH Pattern':            [{ label: 'Wipro Interview - GFG', url: 'https://www.geeksforgeeks.org/wipro-interview-preparation/', icon: '🟢' }, { label: 'Wipro NLTH - PrepInsta', url: 'https://prepinsta.com/wipro/', icon: '🟣' }, { label: 'Wipro NLTH - YouTube', url: 'https://www.youtube.com/results?search_query=wipro+NLTH+preparation+2024', icon: '🔴' }, { label: 'IndiaBix Practice', url: 'https://www.indiabix.com/', icon: '🔵' }],
//   'Cognizant GenC Pattern':        [{ label: 'Cognizant Interview - GFG', url: 'https://www.geeksforgeeks.org/cognizant-interview-preparation/', icon: '🟢' }, { label: 'Cognizant GenC - PrepInsta', url: 'https://prepinsta.com/cognizant/', icon: '🟣' }, { label: 'Cognizant GenC - YouTube', url: 'https://www.youtube.com/results?search_query=cognizant+genc+preparation', icon: '🔴' }, { label: 'IndiaBix Practice', url: 'https://www.indiabix.com/', icon: '🔵' }],
//   'HCL Mock Test':                 [{ label: 'HCL Interview - GFG', url: 'https://www.geeksforgeeks.org/hcl-interview-preparation/', icon: '🟢' }, { label: 'HCL - PrepInsta', url: 'https://prepinsta.com/hcl/', icon: '🟣' }, { label: 'HCL Interview - YouTube', url: 'https://www.youtube.com/results?search_query=HCL+interview+preparation', icon: '🔴' }, { label: 'IndiaBix Mock Tests', url: 'https://www.indiabix.com/', icon: '🔵' }],
//   'Accenture Test Pattern':        [{ label: 'Accenture Interview - GFG', url: 'https://www.geeksforgeeks.org/accenture-interview-preparation/', icon: '🟢' }, { label: 'Accenture - PrepInsta', url: 'https://prepinsta.com/accenture/', icon: '🟣' }, { label: 'Accenture - YouTube', url: 'https://www.youtube.com/results?search_query=accenture+interview+preparation+2024', icon: '🔴' }, { label: 'IndiaBix Aptitude', url: 'https://www.indiabix.com/', icon: '🔵' }],
//   'Capgemini Aptitude Focus':      [{ label: 'Capgemini Interview - GFG', url: 'https://www.geeksforgeeks.org/capgemini-interview-preparation/', icon: '🟢' }, { label: 'Capgemini - PrepInsta', url: 'https://prepinsta.com/capgemini/', icon: '🟣' }, { label: 'Capgemini PseudoCode - YouTube', url: 'https://www.youtube.com/results?search_query=capgemini+pseudocode+preparation', icon: '🔴' }, { label: 'IndiaBix Practice', url: 'https://www.indiabix.com/', icon: '🔵' }],
//   'Tech Mahindra Pattern':         [{ label: 'Tech Mahindra - GFG', url: 'https://www.geeksforgeeks.org/tech-mahindra-interview-preparation/', icon: '🟢' }, { label: 'Tech Mahindra - PrepInsta', url: 'https://prepinsta.com/tech-mahindra/', icon: '🟣' }, { label: 'TechM - YouTube', url: 'https://www.youtube.com/results?search_query=tech+mahindra+interview+preparation', icon: '🔴' }, { label: 'IndiaBix Practice', url: 'https://www.indiabix.com/', icon: '🔵' }],
//   'GATE CS Preparation':           [{ label: 'GATE CS Notes - GFG', url: 'https://www.geeksforgeeks.org/gate-cs-notes-gq/', icon: '🟢' }, { label: 'GATE Previous Year Papers', url: 'https://www.geeksforgeeks.org/gate-previous-year-question-papers/', icon: '🔵' }, { label: 'GATE Prep - YouTube', url: 'https://www.youtube.com/results?search_query=GATE+CS+preparation+2025', icon: '🔴' }, { label: 'GATE Official Website', url: 'https://gate.iitk.ac.in/', icon: '⭐' }],
//   'PSU Exam Pattern':              [{ label: 'PSU via GATE - GFG', url: 'https://www.geeksforgeeks.org/gate-cs-notes-gq/', icon: '🟢' }, { label: 'BHEL Recruitment', url: 'https://www.bhel.com/career', icon: '🔵' }, { label: 'PSU Prep - YouTube', url: 'https://www.youtube.com/results?search_query=PSU+recruitment+through+GATE', icon: '🔴' }, { label: 'GATE Official', url: 'https://gate.iitk.ac.in/', icon: '⭐' }],
//   'Startup Interview Culture':     [{ label: 'Startup Interview - GFG', url: 'https://www.geeksforgeeks.org/how-to-prepare-for-startup-interviews/', icon: '🟢' }, { label: 'AngelList Jobs', url: 'https://angel.co/jobs', icon: '⭐' }, { label: 'Startup Interview - YouTube', url: 'https://www.youtube.com/results?search_query=startup+software+engineer+interview', icon: '🔴' }, { label: 'YC Startup Library', url: 'https://www.ycombinator.com/library', icon: '🔵' }],
//   'Full Stack Questions':          [{ label: 'Full Stack Interview - GFG', url: 'https://www.geeksforgeeks.org/full-stack-developer-interview-questions/', icon: '🟢' }, { label: 'Frontend Interview Questions', url: 'https://github.com/h5bp/Front-end-Developer-Interview-Questions', icon: '⭐' }, { label: 'Full Stack - YouTube', url: 'https://www.youtube.com/results?search_query=full+stack+developer+interview+questions', icon: '🔴' }, { label: 'React Interview Questions', url: 'https://www.interviewbit.com/react-interview-questions/', icon: '🔵' }],
// };

// // ── WAY 3: Topics linked to Assessment page ───────────────────
// const ASSESS_TOPICS = {
//   aptitude:   ['Percentages','Profit & Loss','Time & Work','Speed','Number Series','Blood Relations','Coding & Decoding','Synonyms','Ratio','Averages','HCF','Probability','Permutation','Ages','Geometry','Mixtures','Number System','Calendar','Pipes','Partnership','Boats','Trains'],
//   technical:  ['Python','Data Structures','Arrays','Linked','Trees','Graph','Dynamic','Sorting','Searching','SQL','Joins','Normalization','OSI','TCP','Classes','Inheritance','Recursion','Bit','Stack','Queue','REST','Authentication','Web Security','System Design'],
//   soft_skill: ['Active','Time Management','STAR','Leadership','Emotional','Communication','Teamwork','Problem','GD','Salary','Strengths','Tell Me','Stress','Work-Life'],
// };

// const getAssessmentType = (topic) => {
//   for (const [type, keywords] of Object.entries(ASSESS_TOPICS)) {
//     if (keywords.some(k => topic.toLowerCase().includes(k.toLowerCase()))) return type;
//   }
//   return null;
// };

// const getDefaultResources = (topic, catKey) => {
//   if (catKey === 'coding') return [
//     { label: `LeetCode - ${topic}`, url: `https://leetcode.com/problemset/?search=${encodeURIComponent(topic)}`, icon: '🟠' },
//     { label: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}`, icon: '🟢' },
//     { label: 'HackerRank Practice', url: 'https://www.hackerrank.com/domains/algorithms', icon: '🟩' },
//     { label: 'YouTube Tutorial', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' coding interview')}`, icon: '🔴' },
//   ];
//   if (catKey === 'aptitude') return [
//     { label: 'IndiaBix Practice', url: 'https://www.indiabix.com/', icon: '🔵' },
//     { label: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}`, icon: '🟢' },
//     { label: 'YouTube Tricks & Shortcuts', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' aptitude tricks shortcut')}`, icon: '🔴' },
//     { label: 'PrepInsta', url: 'https://prepinsta.com/', icon: '🟣' },
//   ];
//   if (catKey === 'soft_skill') return [
//     { label: 'HR Interview - GFG', url: 'https://www.geeksforgeeks.org/hr-interview-questions/', icon: '🟢' },
//     { label: 'IndiaBix HR Questions', url: 'https://www.indiabix.com/hr-interview/questions-and-answers/', icon: '🔵' },
//     { label: 'YouTube Guide', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' interview tips')}`, icon: '🔴' },
//     { label: 'Big Interview', url: 'https://biginterview.com/', icon: '⭐' },
//   ];
//   return [
//     { label: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}`, icon: '🟢' },
//     { label: 'PrepInsta', url: 'https://prepinsta.com/', icon: '🟣' },
//     { label: 'YouTube Tutorial', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`, icon: '🔴' },
//     { label: 'IndiaBix', url: 'https://www.indiabix.com/', icon: '🔵' },
//   ];
// };

// // ── Placement Categories ──────────────────────────────────────
// const PLACEMENT_DATA = [
//   {
//     key: 'aptitude', label: 'Aptitude', icon: '📊', color: '#6C63FF',
//     bg: 'linear-gradient(135deg,#6C63FF,#a78bfa)',
//     desc: 'Quantitative, Logical & Verbal — asked in every company',
//     sections: [
//       { name: '📐 Quantitative Aptitude', topics: ['Percentages','Profit & Loss','Time & Work','Speed, Distance & Time','Simple & Compound Interest','Ratio & Proportion','Averages','Mixtures & Alligation','Number System','HCF & LCM','Permutation & Combination','Probability','Geometry & Mensuration','Ages Problems','Calendar & Clocks','Pipes & Cisterns','Partnership','Boats & Streams','Trains','Algebra'] },
//       { name: '🧩 Logical Reasoning', topics: ['Number Series','Letter Series','Syllogisms','Blood Relations','Coding & Decoding','Direction Sense','Seating Arrangements','Puzzles','Input & Output','Statements & Conclusions','Analogies','Classification','Order & Ranking','Venn Diagrams'] },
//       { name: '📝 Verbal Ability', topics: ['Synonyms & Antonyms','Sentence Correction','Fill in the Blanks','Reading Comprehension','Idioms & Phrases','Para Jumbles','Error Detection','One Word Substitution','Active & Passive Voice','Vocabulary'] },
//     ]
//   },
//   {
//     key: 'technical', label: 'Technical', icon: '💻', color: '#FF6584',
//     bg: 'linear-gradient(135deg,#FF6584,#ff8fab)',
//     desc: 'Core CS subjects tested in every technical round',
//     sections: [
//       { name: '🐍 Programming Languages', topics: ['Python Basics','Python OOP','Python Data Structures','C Programming','C++ OOP','Java Basics','Java Collections','Java OOP'] },
//       { name: '🏗️ Data Structures & Algorithms', topics: ['Arrays & Strings','Linked Lists','Stacks & Queues','Trees & Binary Trees','Binary Search Tree','Heaps','Hashing','Graphs','Sorting Algorithms','Searching Algorithms','Dynamic Programming','Recursion','Backtracking','Bit Manipulation','Graph Algorithms'] },
//       { name: '🗄️ Database (DBMS)', topics: ['SQL Basics','Joins & Subqueries','Normalization','ACID Properties','Indexing','Transactions','Stored Procedures','Triggers','NoSQL Basics'] },
//       { name: '🌐 Networking & Operating Systems', topics: ['OSI Model','TCP/IP','HTTP & HTTPS','DNS & DHCP','Subnetting','Process Management','Memory Management','Deadlocks','CPU Scheduling','Virtual Memory','File Systems'] },
//       { name: '🔷 OOP & Web & Design', topics: ['Classes & Objects','Inheritance','Polymorphism','Encapsulation','Abstraction','Design Patterns','SOLID Principles','System Design Basics','REST API Design','Authentication & JWT','Web Security'] },
//     ]
//   },
//   {
//     key: 'coding', label: 'Coding Interview', icon: '🧑‍💻', color: '#F9A825',
//     bg: 'linear-gradient(135deg,#F9A825,#ffcc02)',
//     desc: 'LeetCode-style DSA for product companies',
//     sections: [
//       { name: '🔢 Arrays & Strings', topics: ['Two Sum Pattern','Sliding Window','Kadane\'s Algorithm','Merge Intervals','Matrix Rotation','Anagram Problems','Palindrome Check','String Compression','Dutch National Flag','Trapping Rainwater'] },
//       { name: '🔗 Linked List & Stack & Queue', topics: ['Reverse Linked List','Detect Cycle Floyd','Merge Sorted Lists','LRU Cache','Valid Parentheses','Next Greater Element','Min Stack','Largest Rectangle Histogram','Sliding Window Maximum'] },
//       { name: '🌳 Trees & Graphs', topics: ['Tree Traversals','Level Order BFS','Lowest Common Ancestor','Diameter of Tree','Topological Sort','Dijkstra Shortest Path','Number of Islands','Clone Graph','Max Path Sum Tree','Detect Cycle in Graph'] },
//       { name: '🧠 Dynamic Programming', topics: ['Fibonacci Memoization','0/1 Knapsack','Longest Common Subsequence','Longest Increasing Subsequence','Coin Change','Edit Distance','Matrix Chain Multiplication','Partition Equal Subset','DP on Trees'] },
//       { name: '🔍 Searching & Sorting Problems', topics: ['Binary Search Variants','Search in Rotated Array','Peak Element','Kth Largest Element','Count Inversions','Quick Select','Sort Colors'] },
//     ]
//   },
//   {
//     key: 'soft_skill', label: 'Soft Skills & HR', icon: '🤝', color: '#43E97B',
//     bg: 'linear-gradient(135deg,#43E97B,#38f9d7)',
//     desc: 'Communication, leadership & complete HR preparation',
//     sections: [
//       { name: '🗣️ Communication Skills', topics: ['Active Listening','Verbal Communication','Non-verbal Cues','Presentation Skills','Email Writing','Public Speaking','Assertiveness','Conflict Resolution'] },
//       { name: '👔 HR Interview', topics: ['Tell Me About Yourself','Strengths & Weaknesses','Why This Company','Where Do You See Yourself in 5 Years','Handling Pressure','Salary Negotiation','Notice Period Questions'] },
//       { name: '🧠 Behavioural — STAR Method', topics: ['STAR Framework','Conflict with Colleague','Failure & Learning','Tight Deadline Story','Leadership Story','Innovation Story','Disagreement with Manager'] },
//       { name: '🏆 Group Discussion', topics: ['GD Strategy','How to Initiate GD','How to Conclude GD','Current Affairs GD Topics','Abstract GD Topics','GD Do\'s and Don\'ts'] },
//       { name: '⏰ Productivity & EQ', topics: ['Time Management','Eisenhower Matrix','Leadership Styles','Team Motivation','Emotional Intelligence','Stress Management','Work-Life Balance'] },
//     ]
//   },
//   {
//     key: 'company', label: 'Company Specific', icon: '🏢', color: '#FF9F43',
//     bg: 'linear-gradient(135deg,#FF9F43,#ffbe76)',
//     desc: 'Tailored prep — rounds, tips & packages for every company',
//     sections: [
//       { name: '🔵 Product Companies (MAANG)', topics: ['Google Interview Pattern','Microsoft Interview Pattern','Amazon Leadership Principles','Meta Coding Focus','Apple Interview Style','System Design Basics','Behavioral Round Tips','Mock Interview Practice'] },
//       { name: '🟢 Service Companies', topics: ['TCS NQT Pattern','Infosys InfyTQ','Wipro NLTH Pattern','Cognizant GenC Pattern','HCL Mock Test','Accenture Test Pattern','Capgemini Aptitude Focus','Tech Mahindra Pattern'] },
//       { name: '🟡 Startups & Product', topics: ['Startup Interview Culture','Full Stack Questions','Problem Solving Focus','Product Thinking','System Design for Startups','Culture Fit Questions'] },
//       { name: '🏛️ Core / PSU / GATE', topics: ['PSU Exam Pattern','GATE CS Preparation','Core CS Fundamentals','Domain Specific Questions','Technical Documentation','Project Discussion Tips'] },
//     ]
//   },
// ];

// export default function Placement() {
//   const navigate = useNavigate();
//   const [activeCat,   setActiveCat]   = useState(null);
//   const [activeTopic, setActiveTopic] = useState(null);

//   const companyInfo = activeTopic ? COMPANY_TIPS[activeTopic] : null;
//   const resources   = activeTopic ? (TOPIC_RESOURCES[activeTopic] || getDefaultResources(activeTopic, activeCat?.key)) : [];
//   const assessType  = activeTopic ? getAssessmentType(activeTopic) : null;

//   // ── HOME ────────────────────────────────────────────────────
//   if (!activeCat) return (
//     <div>
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2D2D2D', marginBottom: 6 }}>💼 Placement Preparation Hub</h1>
//         <p style={{ color: '#7A7A9D', fontSize: 15 }}>Complete prep — Aptitude · Technical · Coding · HR · Company rounds & packages</p>
//       </div>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
//         {PLACEMENT_DATA.map(cat => (
//           <div key={cat.key} onClick={() => setActiveCat(cat)}
//             style={{ background: cat.bg, borderRadius: 20, padding: 26, cursor: 'pointer', color: '#fff', boxShadow: `0 8px 28px ${cat.color}33`, transition: 'all 0.25s' }}
//             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
//             onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
//             <div style={{ fontSize: 40, marginBottom: 10 }}>{cat.icon}</div>
//             <h2 style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>{cat.label}</h2>
//             <p style={{ opacity: 0.85, fontSize: 13, marginBottom: 14 }}>{cat.desc}</p>
//             <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
//               {cat.sections.length} sections • {cat.sections.reduce((a, s) => a + s.topics.length, 0)} topics
//             </div>
//             <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 14px', fontWeight: 800, fontSize: 13, textAlign: 'center' }}>
//               Explore {cat.label} →
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // ── CATEGORY + SIDE PANEL ───────────────────────────────────
//   return (
//     <div>
//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
//         <button onClick={() => { setActiveCat(null); setActiveTopic(null); }}
//           style={{ background: 'none', border: `2px solid ${activeCat.color}55`, borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 700, color: activeCat.color }}>
//           ← Back
//         </button>
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 900, color: '#2D2D2D', margin: 0 }}>{activeCat.icon} {activeCat.label} Preparation</h1>
//           <p style={{ color: '#7A7A9D', margin: '3px 0 0', fontSize: 13 }}>Click any topic → Resources · Rounds · Tips · Practice Test</p>
//         </div>
//       </div>

//       {/* Topic Sections */}
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
//         {activeCat.sections.map(section => (
//           <div key={section.name} className="card" style={{ padding: 22 }}>
//             <h2 style={{ fontWeight: 900, fontSize: 15, color: '#2D2D2D', marginBottom: 14 }}>{section.name}</h2>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//               {section.topics.map(topic => (
//                 <button key={topic} onClick={() => setActiveTopic(topic)}
//                   style={{
//                     padding: '9px 16px', borderRadius: 12,
//                     border: `2px solid ${activeTopic === topic ? activeCat.color : activeCat.color + '44'}`,
//                     background: activeTopic === topic ? activeCat.color : '#fff',
//                     color: activeTopic === topic ? '#fff' : '#2D2D2D',
//                     fontWeight: 700, fontSize: 13, cursor: 'pointer',
//                     fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s'
//                   }}
//                   onMouseEnter={e => { if (activeTopic !== topic) { e.currentTarget.style.background = activeCat.color + '15'; e.currentTarget.style.color = activeCat.color; }}}
//                   onMouseLeave={e => { if (activeTopic !== topic) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2D2D2D'; }}}>
//                   {topic}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Side Panel ── */}
//       {activeTopic && (
//         <>
//           <div style={{ position: 'fixed', top: 0, right: 0, width: 440, height: '100vh', background: '#fff', zIndex: 999, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

//             {/* Panel Header */}
//             <div style={{ background: activeCat.bg, padding: '22px 20px', color: '#fff', flexShrink: 0 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                 <div style={{ flex: 1 }}>
//                   <p style={{ opacity: 0.8, fontSize: 12, margin: '0 0 4px' }}>{activeCat.label}</p>
//                   <h2 style={{ fontWeight: 900, fontSize: 17, margin: '0 0 10px' }}>{activeTopic}</h2>
//                   {companyInfo && (
//                     <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
//                       <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{companyInfo.difficulty}</span>
//                       <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>💰 {companyInfo.package}</span>
//                     </div>
//                   )}
//                 </div>
//                 <button onClick={() => setActiveTopic(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>✕</button>
//               </div>
//             </div>

//             <div style={{ padding: 18, flex: 1 }}>

//               {/* WAY 2 — Interview Rounds */}
//               {companyInfo && (
//                 <>
//                   <div style={{ background: `${activeCat.color}10`, border: `2px solid ${activeCat.color}33`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
//                     <h3 style={{ fontWeight: 800, color: activeCat.color, marginBottom: 10, fontSize: 14 }}>📋 Interview Rounds</h3>
//                     {companyInfo.rounds.map((r, i) => (
//                       <div key={i} style={{ padding: '7px 12px', background: '#fff', borderRadius: 8, marginBottom: 6, fontWeight: 600, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
//                         <span style={{ background: activeCat.color, color: '#fff', borderRadius: 6, padding: '1px 8px', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
//                         {r}
//                       </div>
//                     ))}
//                   </div>

//                   <div style={{ background: '#F0FFF4', border: '2px solid #43E97B55', borderRadius: 14, padding: 14, marginBottom: 14 }}>
//                     <h3 style={{ fontWeight: 800, color: '#1a7a40', marginBottom: 10, fontSize: 14 }}>💡 Key Tips</h3>
//                     {companyInfo.tips.map((t, i) => (
//                       <div key={i} style={{ padding: '7px 12px', background: '#fff', borderRadius: 8, marginBottom: 6, fontWeight: 600, fontSize: 13 }}>✅ {t}</div>
//                     ))}
//                   </div>

//                   <div style={{ background: '#FFF8E1', border: '2px solid #F9A82555', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontWeight: 700, fontSize: 13, color: '#7B5800' }}>
//                     🎯 Focus: {companyInfo.focus}
//                   </div>
//                 </>
//               )}

//               {/* WAY 3 — Practice Test */}
//               {assessType && (
//                 <div style={{ background: `${activeCat.color}12`, border: `2px solid ${activeCat.color}44`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
//                   <h3 style={{ fontWeight: 800, color: activeCat.color, marginBottom: 6, fontSize: 14 }}>🎯 Practice Test Available!</h3>
//                   <p style={{ color: '#7A7A9D', fontSize: 13, marginBottom: 10 }}>Test yourself on {activeTopic} with real placement questions</p>
//                   <button onClick={() => navigate('/assessment')} style={{ width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: activeCat.bg, color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
//                     📝 Go to Assessment → Practice Now
//                   </button>
//                 </div>
//               )}

//               {/* Coding-specific LeetCode button */}
//               {activeCat.key === 'coding' && (
//                 <a href={`https://leetcode.com/problemset/?search=${encodeURIComponent(activeTopic)}`} target="_blank" rel="noreferrer"
//                   style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#F9A825,#ffcc02)', color: '#fff', fontWeight: 900, fontSize: 14, textDecoration: 'none', marginBottom: 14 }}>
//                   🟠 Solve on LeetCode →
//                 </a>
//               )}

//               {/* WAY 1 — Resources */}
//               <h3 style={{ fontWeight: 800, color: '#2D2D2D', marginBottom: 10, fontSize: 14 }}>📚 Free Learning Resources</h3>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
//                 {resources.map((res, i) => (
//                   <a key={i} href={res.url} target="_blank" rel="noreferrer"
//                     style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, border: '2px solid #E0E7FF', background: '#F8F9FF', textDecoration: 'none', color: '#2D2D2D', fontWeight: 700, fontSize: 13, transition: 'all 0.15s' }}
//                     onMouseEnter={e => e.currentTarget.style.borderColor = activeCat.color}
//                     onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E7FF'}>
//                     <span style={{ fontSize: 18 }}>{res.icon}</span>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontWeight: 800, fontSize: 13 }}>{res.label}</div>
//                       <div style={{ fontSize: 11, color: '#7A7A9D' }}>Opens in new tab ↗</div>
//                     </div>
//                   </a>
//                 ))}
//               </div>

//               {/* YouTube */}
//               <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeTopic + ' placement interview')}`} target="_blank" rel="noreferrer"
//                 style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, background: '#FF000012', border: '2px solid #FF000033', textDecoration: 'none', color: '#CC0000', fontWeight: 800, fontSize: 13, marginBottom: 14 }}>
//                 <span style={{ fontSize: 20 }}>▶️</span>
//                 <div>
//                   <div>Search "{activeTopic}" on YouTube</div>
//                   <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>Free video tutorials</div>
//                 </div>
//               </a>

//               {/* Generic Tips */}
//               {!companyInfo && (
//                 <div style={{ background: '#F0EEFF', borderRadius: 14, padding: 14 }}>
//                   <h3 style={{ fontWeight: 800, color: '#6C63FF', marginBottom: 8, fontSize: 13 }}>💡 Study Tips</h3>
//                   <ul style={{ margin: 0, paddingLeft: 18, color: '#555', fontSize: 13, lineHeight: 2 }}>
//                     <li>Study concept first then solve problems</li>
//                     <li>Practice minimum 20 questions per topic</li>
//                     <li>Review wrong answers carefully</li>
//                     <li>Time yourself — placement tests are speed-based</li>
//                     <li>Revise weak topics 2 days before interview</li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Overlay */}
//           <div onClick={() => setActiveTopic(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 998 }} />
//         </>
//       )}
//     </div>
//   );
// }



// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // // ── Complete Placement Data ────────────────────────────────────
// // const PLACEMENT_DATA = [
// //   {
// //     key: 'aptitude',
// //     label: 'Aptitude',
// //     icon: '📊',
// //     color: '#6C63FF',
// //     bg: 'linear-gradient(135deg,#6C63FF,#a78bfa)',
// //     desc: 'Quantitative, Logical & Verbal — asked in every company',
// //     sections: [
// //       {
// //         name: '📐 Quantitative Aptitude',
// //         topics: [
// //           'Percentages', 'Profit & Loss', 'Time & Work',
// //           'Speed, Distance & Time', 'Simple & Compound Interest',
// //           'Ratio & Proportion', 'Averages', 'Mixtures & Alligation',
// //           'Number System', 'HCF & LCM', 'Permutation & Combination',
// //           'Probability', 'Geometry & Mensuration', 'Algebra',
// //           'Ages Problems', 'Calendar & Clocks', 'Pipes & Cisterns',
// //           'Partnership', 'Boats & Streams', 'Trains'
// //         ]
// //       },
// //       {
// //         name: '🧩 Logical Reasoning',
// //         topics: [
// //           'Number Series', 'Letter Series', 'Syllogisms',
// //           'Blood Relations', 'Coding & Decoding', 'Direction Sense',
// //           'Seating Arrangements', 'Puzzles', 'Input & Output',
// //           'Statements & Conclusions', 'Analogies', 'Classification',
// //           'Order & Ranking', 'Data Sufficiency', 'Venn Diagrams'
// //         ]
// //       },
// //       {
// //         name: '📝 Verbal Ability',
// //         topics: [
// //           'Synonyms & Antonyms', 'Sentence Correction', 'Fill in the Blanks',
// //           'Reading Comprehension', 'Idioms & Phrases', 'Para Jumbles',
// //           'Error Detection', 'One Word Substitution', 'Active & Passive Voice',
// //           'Direct & Indirect Speech', 'Vocabulary', 'Spelling Correction'
// //         ]
// //       }
// //     ]
// //   },
// //   {
// //     key: 'technical',
// //     label: 'Technical',
// //     icon: '💻',
// //     color: '#FF6584',
// //     bg: 'linear-gradient(135deg,#FF6584,#ff8fab)',
// //     desc: 'Core CS subjects tested in technical rounds',
// //     sections: [
// //       {
// //         name: '🐍 Programming Languages',
// //         topics: [
// //           'Python Basics', 'Python OOP', 'Python Data Structures',
// //           'C Programming', 'C++ Basics', 'C++ OOP',
// //           'Java Basics', 'Java Collections', 'Java OOP'
// //         ]
// //       },
// //       {
// //         name: '🏗️ Data Structures',
// //         topics: [
// //           'Arrays & Strings', 'Linked Lists', 'Stacks & Queues',
// //           'Trees & Binary Trees', 'Binary Search Tree', 'Heaps',
// //           'Hashing', 'Graphs', 'Trie', 'Segment Tree'
// //         ]
// //       },
// //       {
// //         name: '⚙️ Algorithms',
// //         topics: [
// //           'Sorting Algorithms', 'Searching Algorithms', 'Recursion',
// //           'Dynamic Programming', 'Greedy Algorithms', 'Divide & Conquer',
// //           'Backtracking', 'Graph Algorithms', 'String Algorithms',
// //           'Bit Manipulation', 'Time & Space Complexity'
// //         ]
// //       },
// //       {
// //         name: '🗄️ Database (DBMS)',
// //         topics: [
// //           'SQL Basics', 'Joins & Subqueries', 'Normalization',
// //           'ACID Properties', 'Indexing', 'Transactions',
// //           'Stored Procedures', 'Triggers', 'NoSQL Basics'
// //         ]
// //       },
// //       {
// //         name: '🌐 Networking',
// //         topics: [
// //           'OSI Model', 'TCP/IP', 'HTTP & HTTPS',
// //           'DNS & DHCP', 'Subnetting', 'Routing Protocols',
// //           'Firewalls & Security', 'Socket Programming', 'REST vs GraphQL'
// //         ]
// //       },
// //       {
// //         name: '🖥️ Operating Systems',
// //         topics: [
// //           'Process Management', 'Threads & Concurrency', 'Memory Management',
// //           'File Systems', 'Deadlocks', 'CPU Scheduling',
// //           'Virtual Memory', 'Paging & Segmentation', 'Semaphores & Mutex'
// //         ]
// //       },
// //       {
// //         name: '🔷 OOP Concepts',
// //         topics: [
// //           'Classes & Objects', 'Inheritance', 'Polymorphism',
// //           'Encapsulation', 'Abstraction', 'Interfaces & Abstract Classes',
// //           'Design Patterns', 'SOLID Principles', 'Composition vs Inheritance'
// //         ]
// //       },
// //       {
// //         name: '🌍 Web Development',
// //         topics: [
// //           'HTML & CSS Basics', 'JavaScript Fundamentals', 'React Basics',
// //           'REST API Design', 'Authentication & JWT', 'HTTP Methods',
// //           'Web Security (XSS, CSRF)', 'Databases in Web', 'Deployment Basics'
// //         ]
// //       }
// //     ]
// //   },
// //   {
// //     key: 'coding',
// //     label: 'Coding Interview',
// //     icon: '🧑‍💻',
// //     color: '#F9A825',
// //     bg: 'linear-gradient(135deg,#F9A825,#ffcc02)',
// //     desc: 'LeetCode-style problems for product companies',
// //     sections: [
// //       {
// //         name: '🔢 Array & String Problems',
// //         topics: [
// //           'Two Sum Pattern', 'Sliding Window', 'Kadane\'s Algorithm',
// //           'Merge Intervals', 'Matrix Rotation', 'Anagram Problems',
// //           'Palindrome Check', 'String Compression', 'Longest Substring'
// //         ]
// //       },
// //       {
// //         name: '🔗 Linked List Problems',
// //         topics: [
// //           'Reverse Linked List', 'Detect Cycle', 'Merge Two Sorted Lists',
// //           'Find Middle Node', 'Remove Nth from End', 'LRU Cache'
// //         ]
// //       },
// //       {
// //         name: '🌳 Tree & Graph Problems',
// //         topics: [
// //           'Tree Traversals', 'Level Order BFS', 'DFS Problems',
// //           'Lowest Common Ancestor', 'Diameter of Tree', 'Topological Sort',
// //           'Shortest Path (Dijkstra)', 'Number of Islands', 'Clone Graph'
// //         ]
// //       },
// //       {
// //         name: '🧠 Dynamic Programming',
// //         topics: [
// //           'Fibonacci & Memoization', '0/1 Knapsack', 'Longest Common Subsequence',
// //           'Longest Increasing Subsequence', 'Coin Change', 'Matrix Chain',
// //           'Edit Distance', 'Partition Problems', 'DP on Trees'
// //         ]
// //       },
// //       {
// //         name: '🔍 Searching & Sorting',
// //         topics: [
// //           'Binary Search Variants', 'Quick Sort & Merge Sort',
// //           'Search in Rotated Array', 'Peak Element', 'Kth Largest Element',
// //           'Dutch National Flag', 'Count Inversions'
// //         ]
// //       },
// //       {
// //         name: '📚 Stack, Queue & Heap',
// //         topics: [
// //           'Valid Parentheses', 'Next Greater Element', 'Min Stack',
// //           'Top K Frequent Elements', 'Sliding Window Maximum',
// //           'Task Scheduler', 'Median from Data Stream'
// //         ]
// //       }
// //     ]
// //   },
// //   {
// //     key: 'soft_skill',
// //     label: 'Soft Skills & HR',
// //     icon: '🤝',
// //     color: '#43E97B',
// //     bg: 'linear-gradient(135deg,#43E97B,#38f9d7)',
// //     desc: 'Communication, leadership & HR interview preparation',
// //     sections: [
// //       {
// //         name: '🗣️ Communication Skills',
// //         topics: [
// //           'Active Listening', 'Verbal Communication', 'Non-verbal Cues',
// //           'Presentation Skills', 'Email Writing', 'Report Writing',
// //           'Public Speaking', 'Assertiveness', 'Conflict Resolution'
// //         ]
// //       },
// //       {
// //         name: '👔 HR Interview Topics',
// //         topics: [
// //           'Tell Me About Yourself', 'Strengths & Weaknesses',
// //           'Why This Company?', 'Where Do You See Yourself in 5 Years?',
// //           'Handling Pressure', 'Teamwork Examples', 'Leadership Experience',
// //           'Salary Negotiation', 'Notice Period Questions'
// //         ]
// //       },
// //       {
// //         name: '🧠 Behavioural (STAR Method)',
// //         topics: [
// //           'STAR Framework', 'Conflict with Colleague', 'Failure & Learning',
// //           'Tight Deadline Story', 'Leadership Story', 'Innovation Story',
// //           'Customer Handling', 'Disagreement with Manager', 'Multitasking'
// //         ]
// //       },
// //       {
// //         name: '🏆 Group Discussion',
// //         topics: [
// //           'GD Strategy', 'How to Initiate', 'How to Conclude',
// //           'Current Affairs Topics', 'Abstract GD Topics',
// //           'Case-based GD', 'Do\'s and Don\'ts in GD'
// //         ]
// //       },
// //       {
// //         name: '⏰ Time & Leadership',
// //         topics: [
// //           'Time Management', 'Eisenhower Matrix', 'Pomodoro Technique',
// //           'Leadership Styles', 'Team Motivation', 'Delegation Skills',
// //           'Emotional Intelligence', 'Stress Management', 'Work-Life Balance'
// //         ]
// //       }
// //     ]
// //   },
// //   {
// //     key: 'company',
// //     label: 'Company Specific',
// //     icon: '🏢',
// //     color: '#FF9F43',
// //     bg: 'linear-gradient(135deg,#FF9F43,#ffbe76)',
// //     desc: 'Preparation strategy for top companies',
// //     sections: [
// //       {
// //         name: '🔵 Product Companies (MAANG)',
// //         topics: [
// //           'Google Interview Pattern', 'Microsoft Interview Pattern',
// //           'Amazon Leadership Principles', 'Meta Coding Focus',
// //           'Apple Interview Style', 'System Design Basics',
// //           'Behavioral Round Tips', 'Mock Interview Practice'
// //         ]
// //       },
// //       {
// //         name: '🟢 Service Companies',
// //         topics: [
// //           'TCS NQT Pattern', 'Infosys InfyTQ', 'Wipro NLTH Pattern',
// //           'Cognizant GenC Pattern', 'HCL Mock Test', 'Accenture Test Pattern',
// //           'Capgemini Aptitude Focus', 'Tech Mahindra Pattern'
// //         ]
// //       },
// //       {
// //         name: '🟡 Startups & Mid-size',
// //         topics: [
// //           'Startup Interview Culture', 'Full Stack Questions',
// //           'Problem Solving Focus', 'Product Thinking',
// //           'System Design for Startups', 'Culture Fit Questions'
// //         ]
// //       },
// //       {
// //         name: '🏛️ Core Engineering',
// //         topics: [
// //           'PSU Exam Pattern', 'GATE CS Preparation',
// //           'Core CS Fundamentals', 'Domain Specific Questions',
// //           'Technical Documentation', 'Project Discussion Tips'
// //         ]
// //       }
// //     ]
// //   }
// // ];

// // // Resources for each topic
// // const getResources = (topic, categoryKey) => {
// //   const baseResources = [
// //     { label: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}`, icon: '🟢' },
// //     { label: 'IndiaBix', url: `https://www.indiabix.com/`, icon: '🔵' },
// //     { label: 'YouTube Tutorial', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`, icon: '🔴' },
// //     { label: 'W3Schools', url: `https://www.w3schools.com/`, icon: '🌐' },
// //   ];
// //   if (categoryKey === 'coding') {
// //     return [
// //       { label: 'LeetCode Problems', url: `https://leetcode.com/problemset/?search=${encodeURIComponent(topic)}`, icon: '🟠' },
// //       { label: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}`, icon: '🟢' },
// //       { label: 'HackerRank', url: `https://www.hackerrank.com/domains/algorithms`, icon: '🟩' },
// //       { label: 'YouTube Tutorial', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' coding interview')}`, icon: '🔴' },
// //     ];
// //   }
// //   if (categoryKey === 'aptitude') {
// //     return [
// //       { label: 'IndiaBix Practice', url: `https://www.indiabix.com/`, icon: '🔵' },
// //       { label: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic)}`, icon: '🟢' },
// //       { label: 'YouTube Tutorial', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' aptitude tricks')}`, icon: '🔴' },
// //       { label: 'PrepInsta', url: `https://prepinsta.com/`, icon: '🟣' },
// //     ];
// //   }
// //   return baseResources;
// // };

// // // Check if topic has assessment questions
// // const getAssessmentTopic = (topic, categoryKey) => {
// //   const aptitudeTopics = [
// //     'Percentages','Profit & Loss','Time & Work','Speed, Distance & Time',
// //     'Simple & Compound Interest','Number Series','Logical Reasoning',
// //     'Blood Relations','Coding & Decoding','Synonyms & Antonyms',
// //     'Sentence Correction','Fill in the Blanks'
// //   ];
// //   const technicalTopics = [
// //     'Python Basics','Python OOP','Data Structures','Arrays & Strings',
// //     'Sorting Algorithms','SQL Basics','Joins & Subqueries',
// //     'OSI Model','TCP/IP','HTTP & HTTPS','Classes & Objects',
// //     'Inheritance','HTML & CSS Basics'
// //   ];
// //   const softTopics = [
// //     'Active Listening','Time Management','STAR Framework',
// //     'Leadership Styles','Emotional Intelligence'
// //   ];

// //   if (categoryKey === 'aptitude' && aptitudeTopics.some(t => topic.includes(t.split(' ')[0])))
// //     return { type: 'aptitude', topic };
// //   if (categoryKey === 'technical' && technicalTopics.some(t => topic.includes(t.split(' ')[0])))
// //     return { type: 'technical', topic };
// //   if (categoryKey === 'soft_skill' && softTopics.some(t => topic.includes(t.split(' ')[0])))
// //     return { type: 'soft_skill', topic };
// //   return null;
// // };

// // export default function Placement() {
// //   const navigate = useNavigate();
// //   const [activeCategory, setActiveCategory] = useState(null);
// //   const [activeTopic,    setActiveTopic]    = useState(null);
// //   const [activeCategory2, setActiveCategory2] = useState(null);

// //   const openTopic = (topic, categoryKey) => {
// //     setActiveTopic(topic);
// //     setActiveCategory2(categoryKey);
// //   };

// //   const closeTopic = () => { setActiveTopic(null); setActiveCategory2(null); };

// //   const goToPractice = (type) => {
// //     navigate('/assessment');
// //   };

// //   // ── HOME ───────────────────────────────────────────────────
// //   if (!activeCategory) return (
// //     <div>
// //       <div style={{ marginBottom: 32 }}>
// //         <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2D2D2D', marginBottom: 6 }}>
// //           💼 Placement Preparation Hub
// //         </h1>
// //         <p style={{ color: '#7A7A9D', fontSize: 15 }}>
// //           Complete preparation for every round — Aptitude, Technical, Coding, HR & Company-specific
// //         </p>
// //       </div>

// //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
// //         {PLACEMENT_DATA.map(cat => (
// //           <div key={cat.key} onClick={() => setActiveCategory(cat)}
// //             style={{
// //               background: cat.bg, borderRadius: 20, padding: 24,
// //               cursor: 'pointer', color: '#fff',
// //               boxShadow: `0 8px 28px ${cat.color}33`,
// //               transition: 'all 0.25s'
// //             }}
// //             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
// //             onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
// //             <div style={{ fontSize: 40, marginBottom: 10 }}>{cat.icon}</div>
// //             <h2 style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>{cat.label}</h2>
// //             <p style={{ opacity: 0.85, fontSize: 13, marginBottom: 14 }}>{cat.desc}</p>
// //             <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
// //               {cat.sections.length} sections •{' '}
// //               {cat.sections.reduce((a, s) => a + s.topics.length, 0)} topics
// //             </div>
// //             <div style={{
// //               marginTop: 14, background: 'rgba(255,255,255,0.2)',
// //               borderRadius: 10, padding: '8px 14px',
// //               fontWeight: 800, fontSize: 13, textAlign: 'center'
// //             }}>
// //               Explore {cat.label} →
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );

// //   // ── CATEGORY PAGE ───────────────────────────────────────────
// //   return (
// //     <div>
// //       {/* Header */}
// //       <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
// //         <button onClick={() => { setActiveCategory(null); closeTopic(); }} style={{
// //           background: 'none', border: `2px solid ${activeCategory.color}44`,
// //           borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
// //           fontWeight: 700, color: activeCategory.color, fontSize: 14
// //         }}>← Back</button>
// //         <div>
// //           <h1 style={{ fontSize: 24, fontWeight: 900, color: '#2D2D2D', margin: 0 }}>
// //             {activeCategory.icon} {activeCategory.label} Preparation
// //           </h1>
// //           <p style={{ color: '#7A7A9D', margin: '3px 0 0', fontSize: 13 }}>
// //             Click any topic to see resources and practice tests
// //           </p>
// //         </div>
// //       </div>

// //       {/* Sections & Topics */}
// //       <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
// //         {activeCategory.sections.map(section => (
// //           <div key={section.name} className="card" style={{ padding: 24 }}>
// //             <h2 style={{ fontWeight: 900, fontSize: 16, color: '#2D2D2D', marginBottom: 16 }}>
// //               {section.name}
// //             </h2>
// //             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
// //               {section.topics.map(topic => (
// //                 <button key={topic} onClick={() => openTopic(topic, activeCategory.key)}
// //                   style={{
// //                     padding: '9px 16px', borderRadius: 12,
// //                     border: `2px solid ${activeCategory.color}44`,
// //                     background: activeTopic === topic ? activeCategory.color : '#fff',
// //                     color: activeTopic === topic ? '#fff' : '#2D2D2D',
// //                     fontWeight: 700, fontSize: 13, cursor: 'pointer',
// //                     fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s'
// //                   }}
// //                   onMouseEnter={e => {
// //                     if (activeTopic !== topic) {
// //                       e.currentTarget.style.background = activeCategory.color + '18';
// //                       e.currentTarget.style.color = activeCategory.color;
// //                     }
// //                   }}
// //                   onMouseLeave={e => {
// //                     if (activeTopic !== topic) {
// //                       e.currentTarget.style.background = '#fff';
// //                       e.currentTarget.style.color = '#2D2D2D';
// //                     }
// //                   }}>
// //                   {topic}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Topic Detail Panel */}
// //       {activeTopic && (
// //         <div style={{
// //           position: 'fixed', top: 0, right: 0, width: 420,
// //           height: '100vh', background: '#fff', zIndex: 999,
// //           boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
// //           display: 'flex', flexDirection: 'column', overflowY: 'auto'
// //         }}>
// //           {/* Panel header */}
// //           <div style={{
// //             background: activeCategory.bg, padding: '24px 20px',
// //             color: '#fff', flexShrink: 0
// //           }}>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
// //               <div>
// //                 <p style={{ opacity: 0.8, fontSize: 12, margin: '0 0 4px' }}>
// //                   {activeCategory.label}
// //                 </p>
// //                 <h2 style={{ fontWeight: 900, fontSize: 18, margin: 0 }}>
// //                   {activeTopic}
// //                 </h2>
// //               </div>
// //               <button onClick={closeTopic} style={{
// //                 background: 'rgba(255,255,255,0.2)', border: 'none',
// //                 color: '#fff', borderRadius: 8, padding: '6px 10px',
// //                 cursor: 'pointer', fontWeight: 900, fontSize: 16
// //               }}>✕</button>
// //             </div>
// //           </div>

// //           <div style={{ padding: 20, flex: 1 }}>

// //             {/* Practice Test Button */}
// //             {(activeCategory2 === 'aptitude' || activeCategory2 === 'technical' || activeCategory2 === 'soft_skill') && (
// //               <div style={{
// //                 background: `${activeCategory.color}12`,
// //                 border: `2px solid ${activeCategory.color}44`,
// //                 borderRadius: 14, padding: 16, marginBottom: 20
// //               }}>
// //                 <h3 style={{ fontWeight: 800, color: activeCategory.color, marginBottom: 6, fontSize: 15 }}>
// //                   🎯 Take Practice Test
// //                 </h3>
// //                 <p style={{ color: '#7A7A9D', fontSize: 13, marginBottom: 12 }}>
// //                   Test your knowledge on {activeTopic} with real placement questions
// //                 </p>
// //                 <button onClick={() => goToPractice(activeCategory2)} style={{
// //                   width: '100%', padding: '12px', borderRadius: 10,
// //                   border: 'none', background: activeCategory.bg,
// //                   color: '#fff', fontWeight: 900, fontSize: 14,
// //                   cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
// //                 }}>
// //                   📝 Go to Assessment → Practice Now
// //                 </button>
// //               </div>
// //             )}

// //             {activeCategory2 === 'coding' && (
// //               <div style={{
// //                 background: '#FFF8E1', border: '2px solid #F9A82544',
// //                 borderRadius: 14, padding: 16, marginBottom: 20
// //               }}>
// //                 <h3 style={{ fontWeight: 800, color: '#F9A825', marginBottom: 6, fontSize: 15 }}>
// //                   💻 Coding Practice
// //                 </h3>
// //                 <p style={{ color: '#7A7A9D', fontSize: 13, marginBottom: 12 }}>
// //                   Solve problems related to {activeTopic} on coding platforms
// //                 </p>
// //                 <a href={`https://leetcode.com/problemset/?search=${encodeURIComponent(activeTopic)}`}
// //                   target="_blank" rel="noreferrer" style={{
// //                     display: 'block', width: '100%', padding: '12px',
// //                     borderRadius: 10, border: 'none',
// //                     background: 'linear-gradient(135deg,#F9A825,#ffcc02)',
// //                     color: '#fff', fontWeight: 900, fontSize: 14,
// //                     cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
// //                     boxSizing: 'border-box'
// //                   }}>
// //                   🟠 Solve on LeetCode →
// //                 </a>
// //               </div>
// //             )}

// //             {/* Resources */}
// //             <h3 style={{ fontWeight: 800, color: '#2D2D2D', marginBottom: 12, fontSize: 15 }}>
// //               📚 Free Learning Resources
// //             </h3>
// //             <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
// //               {getResources(activeTopic, activeCategory2).map((res, i) => (
// //                 <a key={i} href={res.url} target="_blank" rel="noreferrer"
// //                   style={{
// //                     display: 'flex', alignItems: 'center', gap: 12,
// //                     padding: '12px 14px', borderRadius: 12,
// //                     border: '2px solid #E0E7FF', background: '#F8F9FF',
// //                     textDecoration: 'none', color: '#2D2D2D',
// //                     fontWeight: 700, fontSize: 14, transition: 'all 0.15s'
// //                   }}
// //                   onMouseEnter={e => e.currentTarget.style.borderColor = activeCategory.color}
// //                   onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E7FF'}>
// //                   <span style={{ fontSize: 20 }}>{res.icon}</span>
// //                   <div style={{ flex: 1 }}>
// //                     <div style={{ fontWeight: 800 }}>{res.label}</div>
// //                     <div style={{ fontSize: 12, color: '#7A7A9D' }}>Click to open →</div>
// //                   </div>
// //                   <span style={{ color: '#7A7A9D' }}>↗</span>
// //                 </a>
// //               ))}
// //             </div>

// //             {/* YouTube search */}
// //             <h3 style={{ fontWeight: 800, color: '#2D2D2D', marginBottom: 12, fontSize: 15 }}>
// //               🎥 Video Lectures
// //             </h3>
// //             <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeTopic + ' placement preparation')}`}
// //               target="_blank" rel="noreferrer"
// //               style={{
// //                 display: 'flex', alignItems: 'center', gap: 12,
// //                 padding: '14px', borderRadius: 12,
// //                 background: '#FF000015', border: '2px solid #FF000033',
// //                 textDecoration: 'none', color: '#CC0000',
// //                 fontWeight: 800, fontSize: 14, marginBottom: 20
// //               }}>
// //               <span style={{ fontSize: 24 }}>▶️</span>
// //               <div>
// //                 <div>Search "{activeTopic}" on YouTube</div>
// //                 <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>
// //                   Free video tutorials for placement prep
// //                 </div>
// //               </div>
// //             </a>

// //             {/* Tips */}
// //             <div style={{
// //               background: '#F0EEFF', borderRadius: 14, padding: 16
// //             }}>
// //               <h3 style={{ fontWeight: 800, color: '#6C63FF', marginBottom: 10, fontSize: 14 }}>
// //                 💡 Quick Tips
// //               </h3>
// //               <ul style={{ margin: 0, paddingLeft: 18, color: '#555', fontSize: 13, lineHeight: 1.8 }}>
// //                 <li>Study concepts first, then practice problems</li>
// //                 <li>Take the practice test to check your level</li>
// //                 <li>Review wrong answers carefully</li>
// //                 <li>Practice at least 20 questions per topic</li>
// //                 <li>Revise weak topics before interview</li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Overlay */}
// //       {activeTopic && (
// //         <div onClick={closeTopic} style={{
// //           position: 'fixed', top: 0, left: 0, width: '100vw',
// //           height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 998
// //         }} />
// //       )}
// //     </div>
// //   );
// // }


// // // import React, { useState, useEffect } from 'react';
// // // import API from '../api';

// // // export default function Placement() {
// // //   const [data, setData] = useState(null);
// // //   const [jobs, setJobs] = useState(null);
// // //   const [tab,  setTab]  = useState('aptitude');

// // //   useEffect(() => {
// // //     API.get('/placement/preparation').then(r => setData(r.data)).catch(() => {});
// // //     API.get('/placement/jobs').then(r => setJobs(r.data)).catch(() => {});
// // //   }, []);

// // //   const TABS = [
// // //     { key:'aptitude',  label:'📊 Aptitude',  color:'#6C63FF' },
// // //     { key:'coding',    label:'💻 Coding',    color:'#FF6584' },
// // //     { key:'interview', label:'🎤 Interview', color:'#43E97B' },
// // //     { key:'resources', label:'🔗 Resources', color:'#F9A825' },
// // //     { key:'jobs',      label:'💼 Jobs',      color:'#29B6F6' },
// // //   ];

// // //   return (
// // //     <div>
// // //       <h1 className="page-title">💼 Placement Preparation</h1>
// // //       <p className="page-sub">Everything you need to crack campus placements</p>

// // //       {/* Tabs */}
// // //       <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
// // //         {TABS.map(t => (
// // //           <button key={t.key} onClick={() => setTab(t.key)} className="btn"
// // //             style={{
// // //               background: tab===t.key ? t.color : '#fff',
// // //               color: tab===t.key ? '#fff' : t.color,
// // //               border: `2px solid ${t.color}`,
// // //               padding:'10px 18px', fontSize:14
// // //             }}>
// // //             {t.label}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* Aptitude Topics */}
// // //       {tab==='aptitude' && data?.aptitude_topics && (
// // //         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
// // //           {data.aptitude_topics.map(t => (
// // //             <div key={t.topic} className="card">
// // //               <h3 style={{ fontWeight:800, color:'#6C63FF', marginBottom:12 }}>📊 {t.topic}</h3>
// // //               {t.subtopics.map(s => (
// // //                 <div key={s} style={{ padding:'8px 12px', background:'#F0EEFF', borderRadius:8, marginBottom:6, fontSize:14, fontWeight:600 }}>
// // //                   → {s}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* Coding Topics */}
// // //       {tab==='coding' && data?.coding_topics && (
// // //         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
// // //           {data.coding_topics.map(t => (
// // //             <div key={t.topic} className="card">
// // //               <h3 style={{ fontWeight:800, color:'#FF6584', marginBottom:12 }}>💻 {t.topic}</h3>
// // //               {t.subtopics.map(s => (
// // //                 <div key={s} style={{ padding:'8px 12px', background:'#FFF0F3', borderRadius:8, marginBottom:6, fontSize:14, fontWeight:600 }}>
// // //                   → {s}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* Interview Topics */}
// // //       {tab==='interview' && data?.interview_topics && (
// // //         <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:600 }}>
// // //           {data.interview_topics.map((t, i) => (
// // //             <div key={t} className="card" style={{ display:'flex', gap:16, alignItems:'center', padding:'16px 20px' }}>
// // //               <div style={{ width:36, height:36, borderRadius:10, background:'#EFFFEF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#43E97B', fontSize:16 }}>
// // //                 {i+1}
// // //               </div>
// // //               <span style={{ fontWeight:700, fontSize:15 }}>{t}</span>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* Resources */}
// // //       {tab==='resources' && data?.resources && (
// // //         <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
// // //           {Object.entries(data.resources).map(([cat, links]) => (
// // //             <div key={cat}>
// // //               <h3 style={{ fontWeight:800, textTransform:'capitalize', marginBottom:12, color:'#F9A825' }}>📚 {cat}</h3>
// // //               <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
// // //                 {links.map(r => (
// // //                   <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
// // //                     style={{
// // //                       background:'#fff', border:'2px solid #F9A82544', borderRadius:12,
// // //                       padding:'12px 20px', textDecoration:'none', color:'#2D2D2D',
// // //                       fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:8,
// // //                       boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.2s'
// // //                     }}>
// // //                     🔗 {r.title}
// // //                   </a>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* Jobs */}
// // //       {tab==='jobs' && jobs && (
// // //         <div className="card" style={{ maxWidth:600 }}>
// // //           <h2 style={{ fontWeight:800, marginBottom:6 }}>💼 Recommended for: {jobs.career_domain}</h2>
// // //           <p style={{ color:'#7A7A9D', marginBottom:20, fontSize:14 }}>Entry-level roles matching your profile</p>
// // //           <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
// // //             {jobs.recommended_roles.map(r => (
// // //               <div key={r} style={{ display:'flex', gap:14, alignItems:'center', padding:'14px 16px', background:'#EAF8FF', borderRadius:12 }}>
// // //                 <span style={{ fontSize:20 }}>💼</span>
// // //                 <span style={{ fontWeight:700, fontSize:15, color:'#29B6F6' }}>{r}</span>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }
