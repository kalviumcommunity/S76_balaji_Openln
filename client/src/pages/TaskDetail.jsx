import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AiChat from '../components/AiChat';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Mock task data - in a real app, you would fetch this from your API
  const taskData = {
    1: {
      id: 1,
      type: "AI Module",
      title: "How to get your goal",
      description: "Learn effective goal-setting techniques using SMART criteria",
      content: `
        <h2>Understanding Goal Setting</h2>
        <p>Setting effective goals is crucial for personal and professional development. This module will guide you through creating SMART goals:</p>
        <ul>
          <li><strong>Specific:</strong> Clear, concise, and well-defined</li>
          <li><strong>Measurable:</strong> Include criteria for tracking progress</li>
          <li><strong>Achievable:</strong> Realistic and attainable</li>
          <li><strong>Relevant:</strong> Aligned with your broader objectives</li>
          <li><strong>Time-bound:</strong> Have a deadline or timeframe</li>
        </ul>
        <p>By following these principles, you can transform vague desires into concrete action plans.</p>
      `,
      quiz: [
        {
          question: "What does the 'M' in SMART goals stand for?",
          options: ["Meaningful", "Measurable", "Manageable", "Motivating"],
          answer: "Measurable"
        },
        {
          question: "Why is having a timeline important for goals?",
          options: [
            "It creates urgency",
            "It helps track progress",
            "It provides a deadline for completion", 
            "All of the above"
          ],
          answer: "All of the above"
        }
      ]
    },
    2: {
      id: 2,
      type: "LeetCode",
      title: "Longest Substring Without Repeating Characters",
      description: "Solve this common interview problem using sliding window technique",
      content: `
        <h2>Problem Description</h2>
        <p>Given a string s, find the length of the longest substring without repeating characters.</p>
        
        <h3>Examples:</h3>
        <pre>
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
        </pre>
        
        <h3>Approach: Sliding Window</h3>
        <p>The sliding window technique is perfect for this problem:</p>
        <ol>
          <li>Create a Set to store characters in current window</li>
          <li>Use two pointers to represent the window (left and right)</li>
          <li>Expand the right boundary until we find a duplicate</li>
          <li>Then contract the left boundary until we remove the duplicate</li>
        </ol>
      `,
      codeTemplate: `function lengthOfLongestSubstring(s) {
  // Your solution here
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log(lengthOfLongestSubstring("bbbbb"));    // Expected: 1
console.log(lengthOfLongestSubstring("pwwkew"));   // Expected: 3`,
      solution: `function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    // If the character is already in our set, remove from the left until it's gone
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    
    // Add current character to the set
    charSet.add(s[right]);
    
    // Update maximum length
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`
    },
    3: {
      id: 3,
      type: "Project Task",
      title: "Build a Simple Portfolio Website",
      description: "Create a responsive portfolio site using HTML, CSS, and JavaScript",
      content: `
        <h2>Portfolio Website Project</h2>
        <p>In this project, you'll build a simple but professional portfolio website with the following features:</p>
        
        <h3>Requirements:</h3>
        <ul>
          <li>Responsive design that works on mobile and desktop</li>
          <li>Hero section with your name and title</li>
          <li>About Me section</li>
          <li>Skills section with progress bars or tags</li>
          <li>Projects section with at least 3 projects</li>
          <li>Contact form</li>
        </ul>
        
        <h3>Steps:</h3>
        <ol>
          <li>Create the HTML structure</li>
          <li>Style it with CSS (use Flexbox or Grid)</li>
          <li>Add JavaScript for animations and interactivity</li>
          <li>Make sure it's responsive</li>
          <li>Test across browsers</li>
        </ol>
        
        <h3>Extra Credit:</h3>
        <ul>
          <li>Dark/light mode toggle</li>
          <li>Smooth scrolling between sections</li>
          <li>Project filtering by category</li>
        </ul>
      `,
      deliverables: [
        "HTML, CSS, and JavaScript files",
        "Screenshots of the website on different devices",
        "GitHub repository link"
      ]
    },
    4: {
      id: 4,
      type: "Reflection Prompt",
      title: "Write 3 things you learned today",
      description: "Reflect on and document your key learnings for the day",
      content: `
        <h2>Daily Reflection</h2>
        <p>Reflection is a powerful learning tool that helps cement knowledge and insights. Take a few minutes to think about what you've learned today.</p>
        
        <h3>Prompts to consider:</h3>
        <ul>
          <li>What new technical concept did you learn today?</li>
          <li>What challenge did you overcome and how?</li>
          <li>What surprised you in your learning process?</li>
          <li>How can you apply what you learned to future projects?</li>
          <li>What would you like to understand better tomorrow?</li>
        </ul>
        
        <p>Write at least 3 specific things you learned today, explaining each one briefly and why it matters to you.</p>
      `,
      journalTemplate: `## Today I learned:

1. 

2. 

3. 

## How I'll apply this knowledge:

`
    }
  };

  useEffect(() => {
    // Simulate API call to get task details
    setTimeout(() => {
      const taskDetails = taskData[id];
      if (taskDetails) {
        setTask(taskDetails);
      }
      setLoading(false);
    }, 500);
    
    // Check if task has been completed before
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    if (completedTasks.includes(Number(id))) {
      setCompleted(true);
    }
  }, [id]);

  const handleMarkComplete = () => {
    // Save completion status to localStorage
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    if (!completedTasks.includes(Number(id))) {
      completedTasks.push(Number(id));
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
    setCompleted(true);
    
    // In a real app, you would also send this to your API
    // updateTaskStatus(id, 'completed')
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
        <p className="mb-8">The task you are looking for does not exist.</p>
        <Link to="/dashboard" className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with logo and navigation */}
      <header className="p-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/logo1.png" alt="Open In" className="h-8" />
        </Link>
        <Link 
          to="/dashboard" 
          className="flex items-center text-white/80 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Task details section */}
        <div className="flex-1 px-6 md:px-12 py-8 max-w-4xl mx-auto w-full">
          {/* Task type badge */}
          <div className="mb-6 flex items-center justify-between">
            <span className="bg-[#A259FF]/30 text-[#A259FF] py-1 px-4 rounded-full text-sm font-medium">
              {task.type}
            </span>
            {completed ? (
              <span className="bg-green-500/30 text-green-400 py-1 px-4 rounded-full text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
              </span>
            ) : (
              <button 
                onClick={handleMarkComplete}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-1 px-4 rounded-full text-sm font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
              >
                Mark Complete
              </button>
            )}
          </div>
          
          {/* Task title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{task.title}</h1>
          <p className="text-lg text-white/70 mb-8">{task.description}</p>
          
          {/* Task content */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: task.content }} 
            />
          </div>
          
          {/* Task-specific components based on type */}
          {task.type === "AI Module" && task.quiz && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Quiz</h2>
              {task.quiz.map((q, index) => (
                <div key={index} className="mb-6">
                  <p className="font-medium mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, i) => (
                      <div key={i} className="flex items-center">
                        <input 
                          type="radio" 
                          id={`q${index}-opt${i}`} 
                          name={`question-${index}`} 
                          className="mr-3"
                        />
                        <label htmlFor={`q${index}-opt${i}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg"
              >
                Submit Answers
              </button>
            </div>
          )}
          
          {task.type === "LeetCode" && task.codeTemplate && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Your Solution</h2>
              <div className="rounded-lg overflow-hidden">
                <textarea 
                  className="w-full h-64 bg-gray-900 text-white p-4 font-mono text-sm" 
                  defaultValue={task.codeTemplate}
                ></textarea>
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg"
                >
                  Run Code
                </button>
                <button 
                  className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-2 rounded-lg"
                >
                  View Solution
                </button>
              </div>
            </div>
          )}
          
          {task.type === "Project Task" && task.deliverables && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Deliverables</h2>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                {task.deliverables.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div className="mt-6">
                <p className="mb-2">Submit your project:</p>
                <div className="flex items-center gap-4">
                  <input 
                    type="text" 
                    className="flex-grow bg-white/20 rounded-lg px-4 py-2" 
                    placeholder="GitHub repository URL"
                  />
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg whitespace-nowrap"
                  >
                    Submit Project
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {task.type === "Reflection Prompt" && task.journalTemplate && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Journal Entry</h2>
              <textarea 
                className="w-full h-64 bg-gray-900/60 text-white p-4 rounded-lg" 
                defaultValue={task.journalTemplate}
              ></textarea>
              <button 
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg"
              >
                Save Reflection
              </button>
            </div>
          )}
          
          {/* AI Chat assistance button */}
          <div className="flex justify-center mt-6 mb-12">
            <button 
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              {showChat ? "Hide AI Assistant" : "Get AI Help with This Task"}
            </button>
          </div>
        </div>
        
        {/* AI Chat Panel (conditionally rendered) */}
        {showChat && (
          <div className="w-full md:w-[400px] bg-white/5 border-l border-white/10 p-6">
            <div className="h-[600px]">
              <AiChat 
                onClose={() => setShowChat(false)} 
                taskType={task.type}
                taskTitle={task.title}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;