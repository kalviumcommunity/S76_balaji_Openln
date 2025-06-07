import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AiChat from '../components/AiChat';
import { getBackendUrl } from '../utils/api';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rewards, setRewards] = useState(null);
  const [showRewards, setShowRewards] = useState(false);
  // Add state for quiz answers
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizError, setQuizError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/tasks/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        
        const data = await response.json();
        setTask(data.task);
        setCompleted(data.task.status === 'completed');
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [id, navigate]);

  // Handle quiz answer selection
  const handleQuizAnswerSelect = (questionIndex, option) => {
    if (completed) return; // Don't allow changing answers if task is already completed
    
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: option
    });
    
    setQuizError(false);
  };

  // Check if all quiz questions are answered
  const isQuizComplete = () => {
    if (!task?.quiz || task.quiz.length === 0) return true;
    
    return task.quiz.every((_, index) => quizAnswers[index] !== undefined);
  };

  const handleMarkComplete = async () => {
    // Check if quiz is complete first (if task has a quiz)
    if (task?.quiz && task.quiz.length > 0) {
      if (!isQuizComplete()) {
        setQuizError(true);
        return;
      }
      
      // Check if answers are correct
      const allCorrect = task.quiz.every((question, index) => 
        quizAnswers[index] === question.answer
      );
      
      if (!allCorrect) {
        setQuizError(true);
        return;
      }
    }

    try {
      setSubmitting(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/tasks/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quizAnswers }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCompleted(true);
        setRewards(data.rewards);
        setShowRewards(true);
      } else {
        throw new Error(data.message || 'Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegenerateContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/tasks/${id}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to regenerate task content');
      }
      
      const data = await response.json();
      setTask(data.task);
    } catch (error) {
      console.error('Error regenerating task content:', error);
    } finally {
      setLoading(false);
    }
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
        <p>The requested task could not be found.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 to-black py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Link 
            to="/dashboard"
            className="flex items-center text-gray-300 hover:text-white mb-6 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  task.type === 'Coding' ? 'bg-blue-900/60 text-blue-300' :
                  task.type === 'AI Module' ? 'bg-purple-900/60 text-purple-300' :
                  task.type === 'Reading' ? 'bg-green-900/60 text-green-300' :
                  task.type === 'Project' ? 'bg-orange-900/60 text-orange-300' :
                  task.type === 'Quiz' ? 'bg-red-900/60 text-red-300' :
                  task.type === 'Writing' ? 'bg-indigo-900/60 text-indigo-300' :
                  task.type === 'Practice' ? 'bg-yellow-900/60 text-yellow-300' :
                  'bg-gray-900/60 text-gray-300'
                }`}>
                  {task.type}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300`}>
                  Difficulty: {task.difficultyLevel}/5
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-1">{task.title}</h1>
              <p className="text-gray-400">{task.description}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-center">
              <div className="text-center bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 min-w-[120px]">
                <div className="text-xl text-purple-300 font-bold">+{task.experienceReward} XP</div>
                {completed && (
                  <div className="text-green-400 text-sm mt-1 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </div>
                )}
              </div>
              {!completed && (
                <button 
                  onClick={handleMarkComplete}
                  disabled={submitting}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </div>
                  ) : "Mark Complete"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-6 pb-4 border-b border-gray-700">Task Content</h2>
              <div className="prose prose-invert max-w-none">
                {task?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: task.content.replace(/\n/g, '<br>') }} />
                ) : (
                  <div>
                    <p className="mb-4">Task content could not be generated. Please try again later.</p>
                    <button
                      onClick={handleRegenerateContent}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                    >
                      Regenerate Content
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quiz section if available */}
            {task?.quiz && task.quiz.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 pb-4 border-b border-gray-700">Quiz</h2>
                
                {/* Show quiz error if applicable */}
                {quizError && !completed && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-3 rounded-lg mb-6">
                    Please answer all quiz questions correctly to complete this task.
                  </div>
                )}
                
                <div className="space-y-8">
                  {task.quiz.map((quizItem, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-xl p-5">
                      <h3 className="text-lg font-medium mb-4">{index + 1}. {quizItem.question}</h3>
                      <div className="space-y-2">
                        {quizItem.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            onClick={() => handleQuizAnswerSelect(index, option)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              completed && option === quizItem.answer
                                ? 'bg-green-800/40 border border-green-500/50'
                                : completed
                                ? 'bg-gray-700/40'
                                : quizAnswers[index] === option
                                ? 'bg-purple-700/50 border border-purple-500/50'
                                : 'bg-gray-700/40 hover:bg-gray-700/60'
                            }`}
                          >
                            {option}
                            {completed && option === quizItem.answer && (
                              <span className="ml-2 text-green-400">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Skills */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
              <h2 className="font-semibold text-xl mb-4">Skills You'll Improve</h2>
              <div className="space-y-4">
                {task.skillRewards && task.skillRewards.map((skill, index) => (
                  <div key={index} className="bg-purple-900/30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-purple-300">+{skill.points} pts</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, skill.points)}%` }}></div>
                    </div>
                  </div>
                ))}
                {(!task.skillRewards || task.skillRewards.length === 0) && (
                  <p className="text-gray-400">No specific skills defined for this task.</p>
                )}
              </div>
            </div>
            
            {/* AI Chat Helper */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="font-semibold text-xl mb-4">Need Help?</h2>
              <p className="text-gray-300 mb-4">Stuck on this task? Chat with our AI assistant for personalized guidance.</p>
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Ask Cosa AI for Help
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative bg-gray-900 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold">Cosa AI Assistant</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-hidden">
              <AiChat 
                onClose={() => setShowChat(false)} 
                taskType={task.type} 
                taskTitle={task.title} 
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Rewards Modal */}
      {showRewards && rewards && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 to-gray-900 rounded-2xl w-full max-w-md p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/confetti.png')] opacity-20 animate-confetti"></div>
            </div>
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Task Completed!</h2>
            <p className="text-gray-300 mb-6">You've earned the following rewards:</p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-5">
              <div className="text-2xl text-purple-300 font-bold">+{rewards.experience} XP</div>
              
              {rewards.levelUp && (
                <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                  <div className="text-yellow-300 font-semibold">LEVEL UP!</div>
                  <div className="flex items-center justify-center space-x-3 mt-2">
                    <span className="text-gray-300">Level {rewards.levelUp.from}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-300 font-bold">Level {rewards.levelUp.to}</span>
                  </div>
                </div>
              )}
              
              {rewards.rankUp && (
                <div className="mt-3 p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  <div className="text-purple-300 font-semibold">RANK UP!</div>
                  <div className="flex items-center justify-center space-x-3 mt-2">
                    <span className="text-gray-300">Rank {rewards.rankUp.from}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-purple-300 font-bold">Rank {rewards.rankUp.to}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 mb-6">
              <h3 className="font-semibold text-lg mb-2">Skills Improved:</h3>
              <div className="grid grid-cols-2 gap-2">
                {rewards.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg py-2 px-3 text-sm">
                    <div className="font-medium">{skill.skill}</div>
                    <div className="text-green-400">+{skill.points} points</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setShowRewards(false);
                  navigate('/dashboard');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;