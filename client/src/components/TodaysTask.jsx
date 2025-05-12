import React from 'react';
import { Link } from 'react-router-dom';

const TodaysTask = () => {
  // You can replace this with real progress data later
  const progress = 30;
  
  // Task items in an array
  const tasks = [
    {
      id: 1,
      type: "AI Module",
      description: "How to get your goal.",
      completed: false
    },
    {
      id: 2,
      type: "LeetCode",
      description: "Longest Substring Without Repeating Characters",
      completed: false
    },
    {
      id: 3,
      type: "Project Task",
      description: "Build a Simple Portfolio Website",
      completed: false
    },
    {
      id: 4,
      type: "Reflection Prompt",
      description: "Write 3 things you learned today",
      completed: false
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
        {tasks.map((task) => (
          <Link 
            key={task.id}
            to={`/task/${task.id}`}
            className="block bg-white/15 rounded-xl p-4 transition-transform hover:translate-x-1 hover:bg-white/20"
          >
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">
                {task.type}: "{task.description}"
              </p>
              {task.completed ? (
                <span className="bg-green-500/30 text-green-300 text-sm px-3 py-1 rounded-full">
                  Completed
                </span>
              ) : (
                <span className="bg-yellow-500/30 text-yellow-300 text-sm px-3 py-1 rounded-full">
                  In Progress
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TodaysTask;