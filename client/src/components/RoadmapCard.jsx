import React from 'react';
import { Link } from 'react-router-dom';

const RoadmapCard = ({ milestone, isActive, onStart }) => {
  // Status indicator colors
  const statusIndicator = () => {
    switch(milestone.status) {
      case 'available':
        return 'bg-yellow-400';
      case 'in_progress':
        return 'bg-blue-400 animate-pulse';
      case 'completed':
        return 'bg-green-400';
      default:
        return 'bg-gray-600';
    }
  };
  
  // Type badge styles
  const typeBadge = () => {
    switch(milestone.type) {
      case 'knowledge':
        return 'bg-blue-900/60 text-blue-300';
      case 'project':
        return 'bg-orange-900/60 text-orange-300';
      case 'assessment':
        return 'bg-red-900/60 text-red-300';
      case 'skill_building':
        return 'bg-green-900/60 text-green-300';
      default:
        return 'bg-gray-900/60 text-gray-300';
    }
  };

  return (
    <div className={`relative transition-all duration-300 ${
      isActive ? 'scale-102 shadow-lg' : ''
    }`}>
      {/* Milestone indicator */}
      <div className={`absolute -left-10 top-5 w-4 h-4 rounded-full border-4 border-gray-900 ${statusIndicator()}`}></div>
      
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-5 
        ${isActive ? 'border border-purple-500/50' : 'border border-transparent'} 
        ${milestone.status === 'locked' ? 'opacity-60' : ''}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 text-xs rounded-full ${typeBadge()}`}>
            {milestone.type.replace('_', ' ')}
          </span>
          
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-2">
              {milestone.estimatedTime}
            </span>
            <span className="flex">
              {[...Array(milestone.difficulty)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-bold">{milestone.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{milestone.description}</p>
        
        {/* Rewards */}
        {milestone.rewards && (
          <div className="flex flex-wrap gap-2 mb-4">
            {milestone.rewards.experience && (
              <div className="bg-purple-900/30 rounded-lg px-2 py-1 text-xs">
                +{milestone.rewards.experience} XP
              </div>
            )}
            
            {milestone.rewards.skills && milestone.rewards.skills.map((skill, i) => (
              <div key={i} className="bg-indigo-900/30 rounded-lg px-2 py-1 text-xs">
                {skill.skill} +{skill.points}
              </div>
            ))}
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-4">
          {milestone.status === 'locked' && (
            <div className="flex items-center text-sm text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Complete previous milestones to unlock
            </div>
          )}
          
          {milestone.status === 'available' && (
            <button
              onClick={onStart}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Start Milestone
            </button>
          )}
          
          {milestone.status === 'in_progress' && (
            <Link
              to={`/roadmap/milestone/${milestone._id}`}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium text-center transition-colors"
            >
              Continue
            </Link>
          )}
          
          {milestone.status === 'completed' && (
            <Link
              to={`/roadmap/milestone/${milestone._id}`}
              className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium text-center transition-colors"
            >
              Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard;