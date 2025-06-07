import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBackendUrl } from '../utils/api';

const TodaysTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculate progress based on completed tasks
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(task => task.status === 'completed').length;
    return Math.floor((completedCount / tasks.length) * 100);
  };
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          return;
        }
        
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/tasks/today`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white/15 backdrop-blur-md rounded-[20px] p-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">Loading Today's Tasks...</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white/15 backdrop-blur-md rounded-[20px] p-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">Oops!</h2>
        <p className="text-center text-white mb-4">There was an error loading your tasks.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mx-auto block bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white/15 backdrop-blur-md rounded-[20px] p-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">No Tasks Yet</h2>
        <p className="text-center text-white mb-6">You don't have any tasks for today.</p>
        <button 
          onClick={async () => {
            try {
              setLoading(true);
              const token = localStorage.getItem('token');
              const backendUrl = getBackendUrl();
              
              const response = await fetch(`${backendUrl}/api/tasks/generate`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                credentials: 'include'
              });
              
              if (!response.ok) {
                throw new Error('Failed to generate tasks');
              }
              
              const data = await response.json();
              setTasks(data.tasks || []);
            } catch (error) {
              console.error('Error generating tasks:', error);
              setError(error.message);
            } finally {
              setLoading(false);
            }
          }}
          className="mx-auto block bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
        >
          Generate Today's Tasks
        </button>
      </div>
    );
  }
  
  const progress = calculateProgress();
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/15 backdrop-blur-md rounded-[20px] p-6 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">Today's Tasks</h2>
      
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
            key={task._id}
            to={`/task/${task._id}`}
            className="block bg-white/15 rounded-xl p-4 transition-transform hover:translate-x-1 hover:bg-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{task.title}</p>
                <p className="text-gray-300 text-sm">{task.type}</p>
              </div>
              {task.status === 'completed' ? (
                <span className="bg-green-500/30 text-green-300 text-sm px-3 py-1 rounded-full">
                  Completed
                </span>
              ) : (
                <span className="bg-yellow-500/30 text-yellow-300 text-sm px-3 py-1 rounded-full">
                  In Progress
                </span>
              )}
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex gap-1">
                {task.skillRewards?.slice(0, 2).map((skill, index) => (
                  <span key={index} className="bg-white/10 rounded-full px-2 py-1 text-xs">
                    {skill.skill} +{skill.points}
                  </span>
                ))}
              </div>
              <div className="text-xs font-medium text-purple-300">
                +{task.experienceReward} XP
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TodaysTask;