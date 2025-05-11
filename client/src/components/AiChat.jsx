import React, { useState, useRef, useEffect } from "react";

const AiChat = ({ onClose, onSelectGoal }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "Hi there! I'm Cosa AI. I can help you choose a goal that fits your interests and career aspirations. What are you most interested in?" }
  ]);
  const messagesEndRef = useRef(null);
  
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
    
    // Simulate AI response based on keywords
    setTimeout(() => {
      let response;
      const lowerMsg = message.toLowerCase();
      
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
      
      setChatHistory(prev => [...prev, { sender: "ai", text: response }]);
      
      // Suggest goals after AI response
      if (lowerMsg.includes("yes") || lowerMsg.includes("sure") || lowerMsg.includes("ok") || lowerMsg.includes("select")) {
        setTimeout(() => {
          setChatHistory(prev => [...prev, { 
            sender: "ai", 
            text: "Great! Here are some suggested goals. Click one to select it:",
            suggestions: true 
          }]);
        }, 1000);
      }
    }, 1000);
  };

  const handleSelectGoal = (goal) => {
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
            placeholder="Ask Cosa AI about your goals..."
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