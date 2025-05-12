import React, { useState, useRef, useEffect } from "react";

const AiChat = ({ onClose, onSelectGoal, taskType = null, taskTitle = null }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Initialize chat differently based on whether it's for a task or general goal selection
  useEffect(() => {
    if (taskType && taskTitle) {
      setChatHistory([
        { 
          sender: "ai", 
          text: `I can help you with your ${taskType} task: "${taskTitle}". What would you like to know?` 
        }
      ]);
    } else {
      setChatHistory([
        { 
          sender: "ai", 
          text: "Hi there! I'm Cosa AI. I can help you choose a goal that fits your interests and career aspirations. What are you most interested in?" 
        }
      ]);
    }
  }, [taskType, taskTitle]);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: "user", text: message }]);
    
    // Clear input
    setMessage("");
    
    // Generate response based on context
    setTimeout(() => {
      let response;
      const lowerMsg = message.toLowerCase();
      
      if (taskType) {
        // Task-specific responses
        switch(taskType) {
          case "AI Module":
            if (lowerMsg.includes("smart") || lowerMsg.includes("goal")) {
              response = "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound. For example, instead of 'learn coding,' a SMART goal would be 'complete a React.js course and build a portfolio project in 6 weeks.'";
            } else if (lowerMsg.includes("example") || lowerMsg.includes("instance")) {
              response = "Here's an example of a SMART goal: 'I will acquire 3 new JavaScript skills by completing 5 practice projects in the next 30 days, spending at least 1 hour daily on coding.'";
            } else {
              response = "This module teaches effective goal-setting using the SMART framework. Would you like help understanding a specific part of SMART goals, or would you like an example?";
            }
            break;
            
          case "LeetCode":
            if (lowerMsg.includes("hint") || lowerMsg.includes("help")) {
              response = "For this problem, try using a sliding window approach with a hash set. Start with two pointers (left and right) at the beginning, and move the right pointer while tracking characters in a set. When you find a duplicate, move the left pointer until the duplicate is removed.";
            } else if (lowerMsg.includes("solution") || lowerMsg.includes("answer")) {
              response = "I can provide the general approach: use a sliding window with two pointers, track characters in a hash set, and adjust the window when duplicates are found. Would you like more specific guidance on implementation?";
            } else {
              response = "This LeetCode problem asks you to find the length of the longest substring without repeating characters. Would you like a hint, or would you prefer to discuss your current approach?";
            }
            break;
            
          case "Project Task":
            if (lowerMsg.includes("structure") || lowerMsg.includes("html")) {
              response = "For your portfolio structure, consider these HTML sections: <header> with your name and navigation, <section> for About Me, <section> for Skills with <ul> lists, <section> for Projects with cards, and a <footer> with contact info and form.";
            } else if (lowerMsg.includes("css") || lowerMsg.includes("style")) {
              response = "For styling your portfolio, consider using CSS Grid or Flexbox for layout. For mobile responsiveness, use media queries. A clean color scheme with 2-3 colors usually works best.";
            } else if (lowerMsg.includes("responsive") || lowerMsg.includes("mobile")) {
              response = "Make your site responsive with: 1) Meta viewport tag, 2) Relative units (%, em, rem), 3) Media queries for breakpoints, 4) Flexbox/Grid for layouts, and 5) Testing on multiple screen sizes.";
            } else {
              response = "I can help with your portfolio website project. Do you need assistance with HTML structure, CSS styling, JavaScript functionality, or making it responsive?";
            }
            break;
            
          case "Reflection Prompt":
            if (lowerMsg.includes("example") || lowerMsg.includes("sample")) {
              response = "Here's a sample reflection entry:\n\n1. Today I learned about CSS Grid and how it simplifies complex layouts compared to using multiple nested divs.\n\n2. I discovered the importance of semantic HTML for accessibility and SEO.\n\n3. I learned that regular code refactoring saves time in the long run by reducing technical debt.";
            } else if (lowerMsg.includes("stuck") || lowerMsg.includes("what to write")) {
              response = "If you're feeling stuck, try asking yourself: What surprised you today? What was challenging? What concepts clicked for you? What would you explain differently to yourself a week ago?";
            } else {
              response = "Reflections help solidify your learning. Try to be specific about what you learned, how it changed your understanding, and how you might apply it in the future. Would you like an example reflection?";
            }
            break;
            
          default:
            response = "I'm here to help with your task. What specific aspect would you like assistance with?";
        }
      } else {
        // Goal selection responses (existing code)
        if (lowerMsg.includes("job") || lowerMsg.includes("career") || lowerMsg.includes("salary") || lowerMsg.includes("lpa")) {
          response = "Based on your interest in jobs and career growth, I'd recommend 'Getting 12+ lpa job' as your goal. Would you like to select this?";
        } else if (lowerMsg.includes("startup") || lowerMsg.includes("business") || lowerMsg.includes("entrepreneur")) {
          response = "Since you're interested in entrepreneurship, 'Starting a Startup' would be a great goal for you. Would you like to select this?";
        } else if (lowerMsg.includes("full stack") || lowerMsg.includes("development") || lowerMsg.includes("coding") || lowerMsg.includes("programming")) {
          response = "For someone interested in development, 'Full stack Dev' is a solid choice that covers both frontend and backend. Would you like to select this?";
        } else if (lowerMsg.includes("gsoc") || lowerMsg.includes("open source") || lowerMsg.includes("google")) {
          response = "If you're interested in open source contribution, 'Crack GSOC' is perfect for building your portfolio. Would you like to select this?";
        } else {
          response = "I see. Based on what you've shared, which of these interests you most: getting a high-paying job, starting your own business, becoming a full-stack developer, or contributing to open source?";
        }
        
        // Suggest goals after AI response for goal selection chat
        if (lowerMsg.includes("yes") || lowerMsg.includes("sure") || lowerMsg.includes("ok") || lowerMsg.includes("select")) {
          setTimeout(() => {
            setChatHistory(prev => [...prev, { 
              sender: "ai", 
              text: "Great! Here are some suggested goals. Click one to select it:",
              suggestions: true 
            }]);
          }, 1000);
        }
      }
      
      setChatHistory(prev => [...prev, { sender: "ai", text: response }]);
    }, 800);
  };

  const handleSelectGoal = (goal) => {
    if (!onSelectGoal) return;
    
    setChatHistory([
      ...chatHistory, 
      { sender: "user", text: `I'll choose: ${goal}` }
    ]);
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        sender: "ai", 
        text: `Excellent choice! "${goal}" is a great goal. I'll set this as your main goal.` 
      }]);
      
      // Let parent component know a goal was selected
      setTimeout(() => onSelectGoal(goal), 1500);
    }, 1000);
  };

  return (
    <div className="bg-black/30 rounded-2xl p-6 text-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-purple-600 text-2xl font-bold">Cosa AI Chat</div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index}>
            {msg.sender === "ai" ? (
              <div className="flex flex-col">
                <div className="self-start bg-[#4a295a] bg-opacity-60 text-white px-4 py-2 rounded-xl max-w-[80%] text-sm">
                  {msg.text}
                </div>
                
                {msg.suggestions && (
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {["Getting 12+ lpa job", "Starting an Startup", "Full stack Dev", "Crack GSOC"].map((goal) => (
                      <button
                        key={goal}
                        className="py-2 rounded-xl text-white text-sm font-medium bg-[#4a295a] bg-opacity-60 hover:bg-purple-700 transition-colors"
                        onClick={() => handleSelectGoal(goal)}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="self-end bg-purple-600 text-white px-4 py-2 rounded-xl max-w-[80%] text-sm">
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#4a295a] bg-opacity-60 rounded-xl py-2 px-4 text-white placeholder-gray-300 focus:outline-none"
            placeholder={taskType ? "Ask for help with this task..." : "Ask Cosa AI about your goals..."}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiChat;