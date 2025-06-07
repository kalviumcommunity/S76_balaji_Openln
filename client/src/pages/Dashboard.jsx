import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TodaysTask from '../components/TodaysTask';
import { getBackendUrl } from '../utils/api';
import RoadmapCard from '../components/RoadmapCard';

// Rank colors
const rankColors = {
  'E': 'text-gray-400',
  'D': 'text-blue-400',
  'C': 'text-green-400',
  'B': 'text-yellow-400',
  'A': 'text-orange-400',
  'S': 'text-red-400'
};

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'USER',
    rank: 'E',
    level: 1,
    progress: 0,
  });
  const [dailyTasks, setDailyTasks] = useState([]);
  const [userGoal, setUserGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        
        // Check if user has completed onboarding
        if (!data.profileData.goal) {
          // If goal is not set, redirect to onboarding
          navigate('/onboarding/goal');
          return;
        }
        
        // Update user state with data from server
        setUser({
          name: data.username,
          rank: data.profileData.rank || 'E',
          level: data.profileData.level || 1,
          progress: data.profileData.progress || 0,
        });
        
        // Set user goal
        setUserGoal(data.profileData.goal || localStorage.getItem('userGoal') || 'Set your goal');
        
        // Set streak
        setStreak({
          current: data.profileData.streak?.current || 0,
          longest: data.profileData.streak?.longest || 0
        });
        
        // After fetching user, fetch today's tasks
        fetchTodaysTasks();
        
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle authentication errors
        if (error.message.includes('authentication') || error.message.includes('token')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);

  // Fetch today's tasks
  const fetchTodaysTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const backendUrl = getBackendUrl();
      // Use the correct endpoint
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
      
      if (data.tasks) {
        setDailyTasks(data.tasks);
      } else {
        // If no tasks property, set empty array
        setDailyTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Don't set dailyTasks to empty here to allow retry
    } finally {
      setLoading(false);
    }
  };

  // Generate tasks for today
  const handleGenerateTasks = async () => {
    setGeneratingTasks(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/tasks/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setDailyTasks(data.tasks);
      } else {
        console.error('Failed to generate tasks:', data.message);
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
    } finally {
      setGeneratingTasks(false);
    }
  };

  // Fetch roadmap data
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/roadmap`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch roadmap');
        }
        
        const data = await response.json();
        setRoadmap(data.roadmap);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setRoadmapLoading(false);
      }
    };
    
    fetchRoadmap();
  }, []);

  // Add this function near your other handler functions (before the return statement)
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
    
    // Optional: Call logout API to invalidate token on server
    const backendUrl = getBackendUrl();
    fetch(`${backendUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).catch(err => console.error('Logout error:', err));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Hero section with user stats */}
      <div className="bg-gradient-to-br from-purple-900 to-black py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* User info */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-5xl md:text-[90px] font-bold text-[#A259FF] leading-none text-center md:text-left">{user.name}</h3>
              <div className="flex items-center mt-2 justify-center md:justify-start">
                <span className={`text-2xl font-bold ${rankColors[user.rank]}`}>Rank {user.rank}</span>
                <span className="mx-2">•</span>
                <span className="text-xl">Level {user.level}</span>
                <span className="mx-2">•</span>
                <span className="text-xl text-orange-400">{streak.current} Day Streak</span>
              </div>
            </div>

            {/* Profile and Logout Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                to="/profile" 
                className="p-3 bg-purple-600/80 hover:bg-purple-700 rounded-full text-white transition-colors flex items-center justify-center"
                title="View Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-3 bg-gray-700/80 hover:bg-gray-600 rounded-full text-white transition-colors flex items-center justify-center"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress to Level {user.level + 1}</span>
              <span>{user.progress}%</span>
            </div>
            <div className="h-3 bg-gray-800/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${user.progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Goal display */}
          <div className="mt-6 bg-black/30 backdrop-blur-md rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-700 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-400">Current Goal</div>
                <div className="font-semibold">{userGoal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Roadmap Section - NEW */}
      <div className="max-w-5xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-bold mb-6">Your Learning Roadmap</h2>
        
        {roadmapLoading ? (
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 mx-auto border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-300">Loading your roadmap...</p>
          </div>
        ) : roadmap ? (
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">{roadmap.title}</h3>
                <p className="text-gray-300">{roadmap.description}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-sm text-gray-300 mb-1">Overall Progress</div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${roadmap.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-purple-300">{roadmap.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-700"></div>
              <div className="space-y-6 pl-10 relative">
                {roadmap.milestones.map((milestone, index) => (
                  <RoadmapCard 
                    key={milestone._id}
                    milestone={milestone}
                    isActive={index === roadmap.currentMilestone}
                    onStart={() => handleStartMilestone(milestone._id)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-gray-300">No roadmap available. Complete your profile setup to get started.</p>
          </div>
        )}
      </div>
      
      {/* Daily tasks section */}
      <div className="max-w-5xl mx-auto px-4 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Today's Tasks</h2>
          <button
            onClick={handleGenerateTasks}
            disabled={generatingTasks}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {generatingTasks ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : dailyTasks.length > 0 ? (
              "Tasks Generated"
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Generate Tasks
              </>
            )}
          </button>
        </div>
        
        {loading ? (
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 mx-auto border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-300">Loading tasks...</p>
          </div>
        ) : dailyTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {dailyTasks.map((task) => (
              <div key={task._id} className="bg-white/10 backdrop-blur-md rounded-xl p-5 transition-transform hover:translate-x-1">
                <Link to={`/task/${task._id}`} className="block">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Tasks Generated Yet</h3>
            <p className="text-gray-400 mb-6">Generate your daily tasks to start earning experience and leveling up.</p>
            <button
              onClick={handleGenerateTasks}
              disabled={generatingTasks}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              {generatingTasks ? 'Generating...' : 'Generate Tasks'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;