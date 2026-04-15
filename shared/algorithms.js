const numberArray = (rawInput) =>
  rawInput
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));

const normalizeSearchInput = (input = {}) => {
  const array = numberArray(input.array ?? "4,8,15,16,23,42").sort((a, b) => a - b);
  const target = Number(input.target ?? array[Math.floor(array.length / 2)] ?? 0);
  return { array, target };
};

const normalizeLinearSearchInput = (input = {}) => {
  const array = numberArray(input.array ?? "4,8,15,16,23,42");
  const target = Number(input.target ?? array[Math.floor(array.length / 2)] ?? 0);
  return { array, target };
};

const normalizeSequenceInput = (input = {}) => ({
  values: numberArray(input.array ?? "5,1,4,2,8")
});

const cloneArray = (array) => array.map((value) => value);

const pushStep = (steps, patch) => {
  const previous = steps[steps.length - 1] ?? {};
  steps.push({ ...previous, ...patch });
};

const simulateBinarySearch = (input) => {
  const { array, target } = normalizeSearchInput(input);
  const steps = [];
  let low = 0;
  let high = array.length - 1;

  pushStep(steps, {
    title: "Initialization",
    description: `Search for ${target} inside the sorted array.`,
    array: cloneArray(array),
    pointers: { low, high, mid: null, currentIndex: null },
    found: false
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    pushStep(steps, {
      title: "Choose midpoint",
      description: `Check middle index ${mid}.`,
      array: cloneArray(array),
      pointers: { low, high, mid, currentIndex: mid },
      found: false
    });

    if (array[mid] === target) {
      pushStep(steps, {
        title: "Target found",
        description: `${target} is at index ${mid}.`,
        array: cloneArray(array),
        pointers: { low, high, mid, currentIndex: mid },
        found: true
      });
      return steps;
    }

    if (array[mid] < target) {
      low = mid + 1;
      pushStep(steps, {
        title: "Discard left half",
        description: `${array[mid]} is smaller than ${target}, so move low to ${low}.`,
        array: cloneArray(array),
        pointers: { low, high, mid, currentIndex: mid },
        found: false
      });
    } else {
      high = mid - 1;
      pushStep(steps, {
        title: "Discard right half",
        description: `${array[mid]} is larger than ${target}, so move high to ${high}.`,
        array: cloneArray(array),
        pointers: { low, high, mid, currentIndex: mid },
        found: false
      });
    }
  }

  pushStep(steps, {
    title: "Not found",
    description: `${target} does not exist in the array.`,
    array: cloneArray(array),
    pointers: { low, high, mid: null, currentIndex: null },
    found: false
  });

  return steps;
};

const simulateLinearSearch = (input) => {
  const { array, target } = normalizeLinearSearchInput(input);
  const steps = [];

  pushStep(steps, {
    title: "Initialization",
    description: `Scan each element until ${target} is found.`,
    array: cloneArray(array),
    pointers: { low: null, high: null, mid: null, currentIndex: null },
    found: false
  });

  for (let index = 0; index < array.length; index += 1) {
    pushStep(steps, {
      title: "Inspect element",
      description: `Compare index ${index} with target ${target}.`,
      array: cloneArray(array),
      pointers: { low: null, high: null, mid: null, currentIndex: index },
      found: false
    });

    if (array[index] === target) {
      pushStep(steps, {
        title: "Target found",
        description: `${target} is at index ${index}.`,
        array: cloneArray(array),
        pointers: { low: null, high: null, mid: null, currentIndex: index },
        found: true
      });
      return steps;
    }
  }

  pushStep(steps, {
    title: "Not found",
    description: `${target} was not found after checking every element.`,
    array: cloneArray(array),
    pointers: { low: null, high: null, mid: null, currentIndex: null },
    found: false
  });

  return steps;
};

const simulateBubbleSort = (input) => {
  const { values } = normalizeSequenceInput(input);
  const steps = [];
  const array = cloneArray(values);

  pushStep(steps, {
    title: "Initialization",
    description: "Bubble sort compares adjacent elements and swaps when needed.",
    array: cloneArray(array),
    pointers: { currentIndex: null },
    highlights: []
  });

  for (let i = 0; i < array.length; i += 1) {
    for (let j = 0; j < array.length - i - 1; j += 1) {
      pushStep(steps, {
        title: "Compare pair",
        description: `Compare ${array[j]} and ${array[j + 1]}.`,
        array: cloneArray(array),
        pointers: { currentIndex: j },
        highlights: [j, j + 1]
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        pushStep(steps, {
          title: "Swap",
          description: `Swap to move the larger element rightward.`,
          array: cloneArray(array),
          pointers: { currentIndex: j + 1 },
          highlights: [j, j + 1]
        });
      }
    }
  }

  pushStep(steps, {
    title: "Sorted",
    description: "The array is now sorted in ascending order.",
    array: cloneArray(array),
    pointers: { currentIndex: null },
    highlights: []
  });

  return steps;
};

const simulateMergeSort = (input) => {
  const { values } = normalizeSequenceInput(input);
  const steps = [];
  const array = cloneArray(values);

  pushStep(steps, {
    title: "Initialization",
    description: "Merge sort splits the array and merges sorted halves.",
    array: cloneArray(array),
    segments: [[0, array.length - 1]]
  });

  const mergeSort = (start, end) => {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    pushStep(steps, {
      title: "Divide",
      description: `Split the range ${start}-${end} at ${mid}.`,
      array: cloneArray(array),
      segments: [
        [start, mid],
        [mid + 1, end]
      ]
    });
    mergeSort(start, mid);
    mergeSort(mid + 1, end);

    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      array[k] = left[i] <= right[j] ? left[i++] : right[j++];
      pushStep(steps, {
        title: "Merge",
        description: `Write the next smallest value into index ${k}.`,
        array: cloneArray(array),
        pointers: { currentIndex: k },
        segments: [[start, end]]
      });
      k += 1;
    }

    while (i < left.length) {
      array[k] = left[i++];
      pushStep(steps, {
        title: "Merge remainder",
        description: `Copy remaining left value into index ${k}.`,
        array: cloneArray(array),
        pointers: { currentIndex: k },
        segments: [[start, end]]
      });
      k += 1;
    }

    while (j < right.length) {
      array[k] = right[j++];
      pushStep(steps, {
        title: "Merge remainder",
        description: `Copy remaining right value into index ${k}.`,
        array: cloneArray(array),
        pointers: { currentIndex: k },
        segments: [[start, end]]
      });
      k += 1;
    }
  };

  mergeSort(0, array.length - 1);

  pushStep(steps, {
    title: "Sorted",
    description: "All segments have been merged into one sorted array.",
    array: cloneArray(array),
    segments: [[0, array.length - 1]]
  });

  return steps;
};

const simulateQuickSort = (input) => {
  const { values } = normalizeSequenceInput(input);
  const steps = [];
  const array = cloneArray(values);

  pushStep(steps, {
    title: "Initialization",
    description: "Quick sort partitions around a pivot.",
    array: cloneArray(array),
    pointers: { currentIndex: null }
  });

  const quickSort = (low, high) => {
    if (low >= high) return;
    const pivot = array[high];
    let i = low;

    pushStep(steps, {
      title: "Choose pivot",
      description: `Use ${pivot} at index ${high} as the pivot.`,
      array: cloneArray(array),
      pointers: { low, high, mid: high, currentIndex: high },
      highlights: [high]
    });

    for (let j = low; j < high; j += 1) {
      pushStep(steps, {
        title: "Partition compare",
        description: `Compare ${array[j]} with pivot ${pivot}.`,
        array: cloneArray(array),
        pointers: { low, high, mid: high, currentIndex: j },
        highlights: [j, high]
      });
      if (array[j] <= pivot) {
        [array[i], array[j]] = [array[j], array[i]];
        pushStep(steps, {
          title: "Partition swap",
          description: `Move ${array[i]} into the left partition.`,
          array: cloneArray(array),
          pointers: { low, high, mid: high, currentIndex: i },
          highlights: [i, j, high]
        });
        i += 1;
      }
    }

    [array[i], array[high]] = [array[high], array[i]];
    pushStep(steps, {
      title: "Place pivot",
      description: `Place pivot at index ${i}.`,
      array: cloneArray(array),
      pointers: { low, high, mid: i, currentIndex: i },
      highlights: [i]
    });

    quickSort(low, i - 1);
    quickSort(i + 1, high);
  };

  quickSort(0, array.length - 1);

  pushStep(steps, {
    title: "Sorted",
    description: "The partitions are fully sorted.",
    array: cloneArray(array),
    pointers: { currentIndex: null }
  });

  return steps;
};

const sequenceToNodes = (values) =>
  values.map((value, index) => ({
    id: `${value}-${index}`,
    value,
    index
  }));

const simulateStack = (input = {}) => {
  const operations = (input.operations ?? "push 5,push 9,pop,push 3")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const stack = [];
  const steps = [
    {
      title: "Initialization",
      description: "An empty stack follows Last In, First Out.",
      nodes: []
    }
  ];

  operations.forEach((operation) => {
    const [action, rawValue] = operation.split(/\s+/);
    if (action === "push") {
      stack.push(Number(rawValue));
      pushStep(steps, {
        title: "Push",
        description: `Push ${rawValue} onto the stack.`,
        nodes: sequenceToNodes(stack)
      });
    }
    if (action === "pop") {
      if (!stack.length) {
        pushStep(steps, {
          title: "Invalid pop",
          description: "Error: Cannot pop from an empty stack. Please push an element first.",
          nodes: sequenceToNodes(stack),
          error: true
        });
      } else {
        const removed = stack.pop();
        pushStep(steps, {
          title: "Pop",
          description: `Remove ${removed} from the top of the stack.`,
          nodes: sequenceToNodes(stack)
        });
      }
    }
  });

  return steps;
};

const simulateQueue = (input = {}) => {
  const operations = (input.operations ?? "enqueue 4,enqueue 7,dequeue,enqueue 9")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const queue = [];
  const steps = [
    {
      title: "Initialization",
      description: "An empty queue follows First In, First Out.",
      nodes: []
    }
  ];

  operations.forEach((operation) => {
    const [action, rawValue] = operation.split(/\s+/);
    if (action === "enqueue") {
      queue.push(Number(rawValue));
      pushStep(steps, {
        title: "Enqueue",
        description: `Add ${rawValue} to the rear of the queue.`,
        nodes: sequenceToNodes(queue)
      });
    }
    if (action === "dequeue") {
      if (!queue.length) {
        pushStep(steps, {
          title: "Invalid dequeue",
          description: "Error: Cannot dequeue from an empty queue. Add an element first.",
          nodes: sequenceToNodes(queue),
          error: true
        });
      } else {
        const removed = queue.shift();
        pushStep(steps, {
          title: "Dequeue",
          description: `Remove ${removed} from the front of the queue.`,
          nodes: sequenceToNodes(queue)
        });
      }
    }
  });

  return steps;
};

const simulateLinkedList = (input = {}) => {
  const values = numberArray(input.array ?? "10,20,30,40");
  const steps = [
    {
      title: "Initialization",
      description: "A linked list stores data in connected nodes.",
      nodes: sequenceToNodes(values)
    }
  ];

  if (values.length > 1) {
    pushStep(steps, {
      title: "Traverse",
      description: "Visit each node by following the next reference.",
      nodes: sequenceToNodes(values).map((node, index) => ({
        ...node,
        active: index === 1
      }))
    });
  }

  pushStep(steps, {
    title: "Insert tail",
    description: "Append a new node at the end.",
    nodes: sequenceToNodes([...values, values.length ? values[values.length - 1] + 10 : 10])
  });

  return steps;
};

const buildTree = (values) =>
  values.map((value, index) => ({
    id: `${value}-${index}`,
    value,
    index,
    left: 2 * index + 1 < values.length ? `${values[2 * index + 1]}-${2 * index + 1}` : null,
    right: 2 * index + 2 < values.length ? `${values[2 * index + 2]}-${2 * index + 2}` : null
  }));

const simulateBinaryTree = (input = {}) => {
  const values = numberArray(input.array ?? "8,4,12,2,6,10,14");
  const nodes = buildTree(values);
  return [
    {
      title: "Initialization",
      description: "This binary tree is stored level by level.",
      tree: nodes
    },
    {
      title: "Visit root",
      description: "Traversal starts at the root node.",
      tree: nodes.map((node, index) => ({ ...node, active: index === 0 }))
    },
    {
      title: "Visit children",
      description: "Then move to the next level of children.",
      tree: nodes.map((node, index) => ({ ...node, active: index === 1 || index === 2 }))
    }
  ];
};

const graphFromInput = (input = {}) => {
  const raw = input.graph ?? "A:B,C;B:D,E;C:F";
  const adjacency = {};
  raw.split(";").forEach((entry) => {
    const [node, neighbors = ""] = entry.split(":");
    adjacency[node.trim()] = neighbors
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  });
  return adjacency;
};

const graphNodesEdges = (adjacency) => {
  const nodeSet = new Set(Object.keys(adjacency));
  Object.values(adjacency).forEach((neighbors) => neighbors.forEach((neighbor) => nodeSet.add(neighbor)));
  const nodes = [...nodeSet].map((id, index) => ({
    id,
    x: 120 + (index % 3) * 140,
    y: 100 + Math.floor(index / 3) * 140
  }));
  const edges = Object.entries(adjacency).flatMap(([source, targets]) =>
    targets.map((target) => ({ source, target }))
  );
  return { nodes, edges };
};

const simulateGraphTraversal = (input = {}, mode = "bfs") => {
  const adjacency = graphFromInput(input);
  const start = input.start ?? Object.keys(adjacency)[0] ?? "A";
  const { nodes, edges } = graphNodesEdges(adjacency);
  const visited = new Set();
  const structure = [start];
  const steps = [
    {
      title: "Initialization",
      description: `Start ${mode.toUpperCase()} from node ${start}.`,
      graph: { nodes, edges, active: [start] }
    }
  ];

  while (structure.length) {
    const current = mode === "bfs" ? structure.shift() : structure.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    pushStep(steps, {
      title: "Visit node",
      description: `Visit ${current}.`,
      graph: { nodes, edges, active: [current], visited: [...visited] }
    });
    const neighbors = adjacency[current] ?? [];
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        structure.push(neighbor);
        pushStep(steps, {
          title: "Queue neighbor",
          description: `Schedule ${neighbor} for exploration.`,
          graph: { nodes, edges, active: [current, neighbor], visited: [...visited] }
        });
      }
    });
  }

  return steps;
};

export const algorithmCatalog = {
  binarySearch: {
    id: "binarySearch",
    name: "Binary Search",
    category: "Searching",
    complexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1)"
    },
    explanation:
      "Binary search repeatedly halves a sorted search space, which makes it efficient for ordered data.",
    inputSchema: ["array", "target"],
    code: {
      python: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        if arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
      cpp: `int binarySearch(vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      java: `int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`
    },
    simulate: simulateBinarySearch
  },
  linearSearch: {
    id: "linearSearch",
    name: "Linear Search",
    category: "Searching",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)"
    },
    explanation: "Linear search scans each element sequentially until it finds the target or reaches the end.",
    inputSchema: ["array", "target"],
    code: {
      python: `def linear_search(arr, target):\n    for index, value in enumerate(arr):\n        if value == target:\n            return index\n    return -1`,
      cpp: `int linearSearch(vector<int>& arr, int target) {\n    for (int i = 0; i < arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      java: `int linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`
    },
    simulate: simulateLinearSearch
  },
  bubbleSort: {
    id: "bubbleSort",
    name: "Bubble Sort",
    category: "Sorting",
    complexity: {
      best: "O(n)",
      average: "O(n^2)",
      worst: "O(n^2)",
      space: "O(1)"
    },
    explanation: "Bubble sort repeatedly swaps adjacent out-of-order elements until the array becomes sorted.",
    inputSchema: ["array"],
    code: {
      python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`,
      cpp: `void bubbleSort(vector<int>& arr) {\n    for (int i = 0; i < arr.size(); i++) {\n        for (int j = 0; j < arr.size() - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);\n        }\n    }\n}`,
      java: `void bubbleSort(int[] arr) {\n    for (int i = 0; i < arr.length; i++) {\n        for (int j = 0; j < arr.length - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}`
    },
    simulate: simulateBubbleSort
  },
  mergeSort: {
    id: "mergeSort",
    name: "Merge Sort",
    category: "Sorting",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)"
    },
    explanation: "Merge sort uses divide and conquer: split the array, sort each half, then merge them.",
    inputSchema: ["array"],
    code: {
      python: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)`,
      cpp: `void mergeSort(vector<int>& arr, int left, int right) {\n    if (left >= right) return;\n    int mid = left + (right - left) / 2;\n    mergeSort(arr, left, mid);\n    mergeSort(arr, mid + 1, right);\n    merge(arr, left, mid, right);\n}`,
      java: `void mergeSort(int[] arr, int left, int right) {\n    if (left >= right) return;\n    int mid = left + (right - left) / 2;\n    mergeSort(arr, left, mid);\n    mergeSort(arr, mid + 1, right);\n    merge(arr, left, mid, right);\n}`
    },
    simulate: simulateMergeSort
  },
  quickSort: {
    id: "quickSort",
    name: "Quick Sort",
    category: "Sorting",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n^2)",
      space: "O(log n)"
    },
    explanation: "Quick sort partitions elements around a pivot and recursively sorts the resulting subarrays.",
    inputSchema: ["array"],
    code: {
      python: `def quick_sort(arr, low, high):\n    if low < high:\n        pivot_index = partition(arr, low, high)\n        quick_sort(arr, low, pivot_index - 1)\n        quick_sort(arr, pivot_index + 1, high)`,
      cpp: `void quickSort(vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pivot = partition(arr, low, high);\n        quickSort(arr, low, pivot - 1);\n        quickSort(arr, pivot + 1, high);\n    }\n}`,
      java: `void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pivot = partition(arr, low, high);\n        quickSort(arr, low, pivot - 1);\n        quickSort(arr, pivot + 1, high);\n    }\n}`
    },
    simulate: simulateQuickSort
  },
  stack: {
    id: "stack",
    name: "Stack",
    category: "Data Structure",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(n)"
    },
    explanation: "A stack is a Last In, First Out structure where insertion and deletion happen at the top.",
    inputSchema: ["operations"],
    code: {
      python: `stack = []\nstack.append(5)\nstack.pop()`,
      cpp: `stack<int> st;\nst.push(5);\nst.pop();`,
      java: `Stack<Integer> stack = new Stack<>();\nstack.push(5);\nstack.pop();`
    },
    simulate: simulateStack
  },
  queue: {
    id: "queue",
    name: "Queue",
    category: "Data Structure",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(n)"
    },
    explanation: "A queue is a First In, First Out structure with insertion at the rear and deletion at the front.",
    inputSchema: ["operations"],
    code: {
      python: `from collections import deque\nqueue = deque()\nqueue.append(5)\nqueue.popleft()`,
      cpp: `queue<int> q;\nq.push(5);\nq.pop();`,
      java: `Queue<Integer> queue = new LinkedList<>();\nqueue.offer(5);\nqueue.poll();`
    },
    simulate: simulateQueue
  },
  linkedList: {
    id: "linkedList",
    name: "Linked List",
    category: "Data Structure",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n)"
    },
    explanation: "A linked list stores elements in nodes connected by references instead of contiguous memory.",
    inputSchema: ["array"],
    code: {
      python: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None`,
      cpp: `struct Node {\n    int value;\n    Node* next;\n};`,
      java: `class Node {\n    int value;\n    Node next;\n}`
    },
    simulate: simulateLinkedList
  },
  binaryTree: {
    id: "binaryTree",
    name: "Binary Tree",
    category: "Data Structure",
    complexity: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(n)",
      space: "O(n)"
    },
    explanation: "A binary tree allows each node to have up to two children, commonly called left and right.",
    inputSchema: ["array"],
    code: {
      python: `class TreeNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None`,
      cpp: `struct TreeNode {\n    int value;\n    TreeNode* left;\n    TreeNode* right;\n};`,
      java: `class TreeNode {\n    int value;\n    TreeNode left;\n    TreeNode right;\n}`
    },
    simulate: simulateBinaryTree
  },
  bfs: {
    id: "bfs",
    name: "Graph Traversal (BFS)",
    category: "Graph",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)"
    },
    explanation: "Breadth-first search visits nodes level by level using a queue.",
    inputSchema: ["graph", "start"],
    code: {
      python: `from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()`,
      cpp: `void bfs(unordered_map<char, vector<char>>& graph, char start) {\n    queue<char> q;\n    unordered_set<char> visited;\n    q.push(start);\n}`,
      java: `void bfs(Map<String, List<String>> graph, String start) {\n    Queue<String> queue = new LinkedList<>();\n    Set<String> visited = new HashSet<>();\n    queue.offer(start);\n}`
    },
    simulate: (input) => simulateGraphTraversal(input, "bfs")
  },
  dfs: {
    id: "dfs",
    name: "Graph Traversal (DFS)",
    category: "Graph",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)"
    },
    explanation: "Depth-first search goes as deep as possible before backtracking.",
    inputSchema: ["graph", "start"],
    code: {
      python: `def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)`,
      cpp: `void dfs(unordered_map<char, vector<char>>& graph, char node, unordered_set<char>& visited) {\n    visited.insert(node);\n    for (char neighbor : graph[node]) {\n        if (!visited.count(neighbor)) dfs(graph, neighbor, visited);\n    }\n}`,
      java: `void dfs(Map<String, List<String>> graph, String node, Set<String> visited) {\n    visited.add(node);\n    for (String neighbor : graph.get(node)) {\n        if (!visited.contains(neighbor)) dfs(graph, neighbor, visited);\n    }\n}`
    },
    simulate: (input) => simulateGraphTraversal(input, "dfs")
  }
};

export const algorithmList = Object.values(algorithmCatalog).map(({ simulate, ...rest }) => rest);

export const getSimulation = (algorithmId, input) => {
  const algorithm = algorithmCatalog[algorithmId] ?? algorithmCatalog.binarySearch;
  return algorithm.simulate(input);
};

export const getAlgorithm = (algorithmId) => algorithmCatalog[algorithmId] ?? algorithmCatalog.binarySearch;
