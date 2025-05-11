const quizQuestions = [
  {
    id: 1,
    question: "Which of the following is NOT a JavaScript data type?",
    options: [
      "String",
      "Boolean",
      "Integer",
      "Object"
    ],
    correctAnswer: "Integer",
    explanation: "JavaScript has Number type for all numeric values, not separate Integer and Float types like some other languages."
  },
  {
    id: 2,
    question: "What is the time complexity of searching an element in a balanced binary search tree?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: "O(log n)",
    explanation: "Binary search trees divide the search space in half with each comparison, resulting in logarithmic time complexity."
  },
  {
    id: 3,
    question: "In React, which hook allows you to perform side effects in function components?",
    options: [
      "useState",
      "useReducer",
      "useEffect",
      "useMemo"
    ],
    correctAnswer: "useEffect",
    explanation: "useEffect hook is designed for performing side effects like data fetching, subscriptions, or manually changing the DOM."
  },
  {
    id: 4,
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Sequential Query Language",
      "Secure Query Language",
      "System Quality Language"
    ],
    correctAnswer: "Structured Query Language",
    explanation: "SQL (Structured Query Language) is a standard language for managing and manipulating relational databases."
  },
  {
    id: 5,
    question: "Which version control system is most widely used for open-source collaboration?",
    options: [
      "SVN",
      "Git",
      "Mercurial",
      "Perforce"
    ],
    correctAnswer: "Git",
    explanation: "Git is the most widely used version control system, especially for open-source projects like those in GSOC."
  }
];

export default quizQuestions;