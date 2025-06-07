import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBackendUrl } from '../utils/api';

// Rank colors for UI display
const rankColors = {
  'E': 'text-gray-400',
  'D': 'text-blue-400',
  'C': 'text-green-400',
  'B': 'text-yellow-400',
  'A': 'text-orange-400',
  'S': 'text-red-400'
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
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
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.message.includes('authentication') || error.message.includes('token')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p>Could not load your profile information.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { username, profileData } = user;
  const { rank, level, progress, goal, skills = [], achievements = [], streak = {} } = profileData;

  // Calculate skill category percentages
  const skillCategories = {
    'Technical': skills.filter(s => ['Technical Skills', 'Frontend', 'Backend', 'Database', 'DevOps', 'Coding'].some(term => s.name.includes(term))),
    'Business': skills.filter(s => ['Business Planning', 'Market Research', 'Pitching', 'Marketing'].some(term => s.name.includes(term))),
    'Problem Solving': skills.filter(s => ['Problem Solving', 'Algorithms', 'Data Structures'].some(term => s.name.includes(term))),
    'Communication': skills.filter(s => ['Interview Preparation', 'Documentation', 'Writing'].some(term => s.name.includes(term)))
  };

  // Calculate average proficiency for a category
  const getCategoryAverage = category => {
    if (category.length === 0) return 0;
    return Math.floor(category.reduce((sum, skill) => sum + skill.proficiency, 0) / category.length);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section with user stats */}
      <div className="bg-gradient-to-br from-purple-900 to-black py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar with rank */}
            <div className="relative">
              <div className="h-32 w-32 md:h-40 md:w-40 bg-gradient-to-br from-purple-500 to-purple-800 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-6xl font-bold">{username?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-black">
                <span className="text-black text-2xl font-bold">{rank}</span>
              </div>
            </div>
            
            {/* User info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{username}</h1>
              <p className="text-purple-300 mb-4">"{goal}"</p>
              
              {/* Level and progress */}
              <div className="mb-6">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-lg">Level {level}</span>
                  <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                  <span className="text-purple-300">{streak?.current || 0} Day Streak</span>
                </div>
                <div className="w-full md:max-w-md h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-8">
            <button
              className={`py-4 px-1 font-medium border-b-2 transition-colors ${
                activeTab === 'overview' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 font-medium border-b-2 transition-colors ${
                activeTab === 'skills' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('skills')}
            >
              Skills
            </button>
            <button
              className={`py-4 px-1 font-medium border-b-2 transition-colors ${
                activeTab === 'achievements' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Stats</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-400 text-sm">Rank</h3>
                  <p className={`text-3xl font-bold ${rankColors[rank]}`}>{rank}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Level</h3>
                  <p className="text-3xl font-bold">{level}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Streak</h3>
                  <p className="text-3xl font-bold text-orange-500">{streak?.current || 0} days</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Best Streak</h3>
                  <p className="text-3xl font-bold text-orange-300">{streak?.longest || 0} days</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-gray-400 text-sm mb-2">Goal</h3>
                <p className="text-lg font-medium bg-purple-900/30 rounded-lg px-4 py-2">{goal}</p>
              </div>
            </div>
            
            {/* Skills Overview Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Skill Categories</h2>
              
              <div className="space-y-6">
                {Object.entries(skillCategories).map(([category, categorySkills]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{category}</span>
                      <span className="text-gray-400">{getCategoryAverage(categorySkills)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${getCategoryAverage(categorySkills)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Achievements */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 md:col-span-2">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-semibold">Recent Achievements</h2>
                <button 
                  className="text-purple-400 text-sm hover:text-purple-300"
                  onClick={() => setActiveTab('achievements')}
                >
                  View all
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements?.slice(0, 6).map((achievement, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 flex gap-3">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-800/50 flex items-center justify-center">
                      {achievement.icon === 'level-up' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ) : achievement.icon === 'rank-up' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      ) : achievement.icon === 'streak' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                      ) : achievement.icon === 'skill-mastery' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-gray-400">{new Date(achievement.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                
                {(!achievements || achievements.length === 0) && (
                  <div className="col-span-3 py-6 text-center text-gray-400">
                    <p>Complete tasks to earn achievements!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Skills</h2>
            
            {skills.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-8 text-center">
                <p className="text-gray-400">Complete tasks to develop skills!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(skillCategories).filter(([_, skills]) => skills.length > 0).map(([category, categorySkills]) => (
                  <div key={category} className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">{category}</h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{skill.name}</span>
                            <span className="text-gray-400">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                skill.proficiency >= 80 ? 'bg-green-500' :
                                skill.proficiency >= 50 ? 'bg-blue-500' : 
                                'bg-purple-600'
                              }`}
                              style={{ width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Achievements</h2>
            
            {achievements?.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-8 text-center">
                <p className="text-gray-400">Complete tasks to earn achievements!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements?.map((achievement, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6">
                    <div className="mb-4 h-16 w-16 rounded-full bg-purple-800/50 flex items-center justify-center mx-auto">
                      {achievement.icon === 'level-up' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ) : achievement.icon === 'rank-up' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      ) : achievement.icon === 'streak' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                      ) : achievement.icon === 'skill-mastery' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-center text-lg font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-gray-400 text-center text-sm mb-3">{achievement.description}</p>
                    <p className="text-gray-500 text-center text-xs">{new Date(achievement.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;