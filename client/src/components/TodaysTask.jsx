import React from 'react';

const TodaysTask = () => {
  // You can replace this with real progress data later
  const progress = 30;
  
  // Task items in an array
  const tasks = [
    {
      type: "AI Module",
      description: "How to get your goal."
    },
    {
      type: "LeetCode",
      description: "Longest Substring Without Repeating Characters"
    },
    {
      type: "Project Task",
      description: "Build a Simple Portfolio Website"
    },
    {
      type: "Reflection Prompt",
      description: "Write 3 things you learned today"
    }
  ];
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/15 backdrop-blur-md rounded-[20px] p-6 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">Today's Task</h2>
      
      {/* Progress bar */}
      <div className="bg-white/20 h-4 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Task items */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className=" bg-white/15 rounded-xl p-4 transition-transform hover:translate-x-1"
          >
            <p className="text-white font-medium">
              {task.type}: "{task.description}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysTask;