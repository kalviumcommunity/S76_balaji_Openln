import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI
// You should store this key in an environment variable in a real application
const API_KEY = "AIzaSyCAbNEZsHxmKKRBmyEMRV8Qoie8j-_m_xQ"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const AiChat = ({ onClose, onSelectGoal, taskType = null, taskTitle = null }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const modelRef = useRef(null);
  const chatRef = useRef(null);
  
  // Initialize Gemini model and chat
  useEffect(() => {
    const initializeGemini = async () => {
      try {
        // Get the generative model
        modelRef.current = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Start a chat
        chatRef.current = modelRef.current.startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        });
        
        // Set initial system prompt based on context
        let initialPrompt = "";
        if (taskType && taskTitle) {
          initialPrompt = `You are Cosa AI, an AI assistant for the Open ln learning platform. You're helping a user with their ${taskType} task: "${taskTitle}". Provide concise, helpful responses related to this task. Keep responses under 150 words. If asked about something unrelated to the task, gently redirect the conversation back to the task.`;
        } else {
          initialPrompt = `You are Cosa AI, an AI assistant for the Open ln learning platform. Your role is to help users select appropriate learning goals. Ask specific questions to understand the user's background, interests, career aspirations, and skill levels. Based on their responses, recommend one of these goals: "Getting 12+ lpa job", "Starting an Startup", "Full stack Dev", or "Crack GSOC".
          
          If the user is considering a high-paying job, recommend "Getting 12+ lpa job" and explain how the platform can help them achieve this.
          If they express interest in building a business, recommend "Starting an Startup".
          If they want to become a well-rounded developer, suggest "Full stack Dev".
          If they're interested in contributing to open source or applying for Google Summer of Code, suggest "Crack GSOC".
          
          Be conversational, enthusiastic, and supportive. Keep responses under 150 words.`;
        }
        
        // Send the system prompt
        await chatRef.current.sendMessage(initialPrompt);
        
        // Set initial message
        const initialMessage = taskType && taskTitle
          ? `I can help you with your ${taskType} task: "${taskTitle}". What would you like to know?`
          : "Hi there! I'm Cosa AI. I can help you choose a goal that fits your interests and career aspirations. What are you most interested in?";
        
        setChatHistory([{ sender: "ai", text: initialMessage }]);
      } catch (error) {
        console.error("Error initializing Gemini:", error);
        setChatHistory([{ 
          sender: "ai", 
          text: "I'm having trouble connecting. Please try again later." 
        }]);
      }
    };
    
    initializeGemini();
  }, [taskType, taskTitle]);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading || !chatRef.current) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: "user", text: message }]);
    
    // Clear input
    setMessage("");
    setIsLoading(true);
    
    try {
      const userMessage = message;
      const lowerMsg = userMessage.toLowerCase();
      
      // Check if user is trying to select a goal directly
      if (!taskType && (
        lowerMsg.includes("12+ lpa") || 
        lowerMsg.includes("startup") ||
        lowerMsg.includes("full stack") ||
        lowerMsg.includes("gsoc")
      )) {
        // If directly mentioning a goal and saying yes/select
        if (lowerMsg.includes("yes") || lowerMsg.includes("select") || lowerMsg.includes("choose")) {
          let goalToSelect = "";
          
          if (lowerMsg.includes("12+ lpa") || lowerMsg.includes("job")) {
            goalToSelect = "Getting 12+ lpa job";
          } else if (lowerMsg.includes("startup")) {
            goalToSelect = "Starting an Startup";
          } else if (lowerMsg.includes("full stack")) {
            goalToSelect = "Full stack Dev";
          } else if (lowerMsg.includes("gsoc")) {
            goalToSelect = "Crack GSOC";
          }
          
          if (goalToSelect && onSelectGoal) {
            setTimeout(() => {
              setChatHistory(prev => [...prev, { 
                sender: "ai", 
                text: `Excellent choice! "${goalToSelect}" is a great goal. I'll set this as your main goal.` 
              }]);
              
              setTimeout(() => onSelectGoal(goalToSelect), 1500);
            }, 800);
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Get response from Gemini
      const result = await chatRef.current.sendMessage(userMessage);
      const response = result.response;
      const text = response.text();
      
      // Check if user is expressing interest in selecting a goal
      if (!taskType && (
        lowerMsg.includes("yes") || lowerMsg.includes("sure") || 
        lowerMsg.includes("ok") || lowerMsg.includes("select")
      )) {
        // Add suggestions after the AI response
        setChatHistory(prev => [...prev, { sender: "ai", text: text }]);
        
        setTimeout(() => {
          setChatHistory(prev => [...prev, { 
            sender: "ai", 
            text: "Great! Here are some suggested goals. Click one to select it:",
            suggestions: true 
          }]);
        }, 1000);
      } else {
        // Regular response
        setChatHistory(prev => [...prev, { sender: "ai", text: text }]);
      }
    } catch (error) {
      console.error("Error getting response from Gemini:", error);
      setChatHistory(prev => [...prev, { 
        sender: "ai", 
        text: "I'm sorry, I encountered an error processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
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
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#4a295a] bg-opacity-60 rounded-xl py-2 px-4 text-white placeholder-gray-300 focus:outline-none"
            placeholder={taskType ? "Ask for help with this task..." : "Ask Cosa AI about your goals..."}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
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