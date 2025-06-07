import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Task from "../models/task.js";
import User from "../models/user.js";

dotenv.config();

// Initialize Gemini AI
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCAbNEZsHxmKKRBmyEMRV8Qoie8j-_m_xQ";
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to get task difficulty based on user level
const getTaskDifficulty = (level) => {
  if (level <= 5) return 1;
  if (level <= 10) return 2;
  if (level <= 15) return 3;
  if (level <= 20) return 4;
  return 5;
};

// Helper function to get experience reward based on task difficulty
const getExperienceReward = (difficulty) => {
  const baseXP = 10;
  return baseXP * difficulty;
};

// Helper function to determine skills based on user goal
const determineSkillsForGoal = (goal) => {
  const skillMap = {
    "Getting 12+ lpa job": ["Technical Skills", "Interview Preparation", "Problem Solving", "Algorithms", "Data Structures"],
    "Starting an Startup": ["Business Planning", "Market Research", "Pitching", "Marketing", "Product Development"],
    "Full stack Dev": ["Frontend", "Backend", "Database", "DevOps", "API Design", "UI/UX"],
    "Crack GSOC": ["Open Source", "Git", "Algorithms", "Project Management", "Communication", "Documentation"]
  };
  
  return skillMap[goal] || ["Learning", "Problem Solving"];
};

// Determine task types based on user's goal and learning style
const determineTaskTypes = (goal, learningStyle) => {
  // Base task types that apply to all goals
  const baseTypes = ['AI Module', 'Quiz'];
  
  // Goal-specific task types
  const goalTaskMap = {
    "Getting 12+ lpa job": ['Coding', 'Practice'],
    "Starting an Startup": ['Project', 'Writing'],
    "Full stack Dev": ['Coding', 'Project'],
    "Crack GSOC": ['Coding', 'Reading']
  };
  
  // Learning style preferences
  const styleTaskMap = {
    "Visual": ['AI Module', 'Project'],
    "Auditory": ['AI Module', 'Practice'],
    "Reading/Writing": ['Reading', 'Writing'],
    "Kinesthetic": ['Coding', 'Project', 'Practice'],
    "Mixed/Flexible": ['Project', 'Practice', 'Reading']
  };
  
  // Combine base types with goal and learning style preferences
  let taskTypes = [...baseTypes];
  
  if (goalTaskMap[goal]) {
    taskTypes = [...taskTypes, ...goalTaskMap[goal]];
  }
  
  if (learningStyle && styleTaskMap[learningStyle]) {
    taskTypes = [...taskTypes, ...styleTaskMap[learningStyle]];
  }
  
  // Remove duplicates
  return [...new Set(taskTypes)];
};

// Generate AI task content based on user preferences
const generateTaskContent = async (user, taskType) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const userLevel = user.profileData.level;
    const userGoal = user.profileData.goal;
    const userLearningStyle = user.profileData.learningStyle;
    const userTimeCommitment = user.profileData.timeCommitment;
    
    let prompt = `Generate a learning task for a user with the following preferences:
    - Goal: ${userGoal}
    - Learning style preference: ${userLearningStyle || 'Mixed/Flexible'}
    - Time available: ${userTimeCommitment || 'Flexible'}
    - Current level: ${userLevel} (1 is beginner, 20+ is advanced)
    - Task type: ${taskType}
    
    Format the response as a JSON object with the following structure:
    {
      "title": "Task title",
      "description": "Brief description",
      "content": "Detailed content including steps, instructions, and explanation",
      "quiz": [
        {
          "question": "Question text",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Correct option"
        }
      ]
    }
    
    Make sure the content aligns with the user's learning style and can be completed within their available time.`;
    
    // Add a retry mechanism (3 attempts)
    let attempt = 0;
    let maxAttempts = 3;
    let response;
    let taskData;
    
    while (attempt < maxAttempts) {
      try {
        const result = await model.generateContent(prompt);
        response = result.response;
        taskData = JSON.parse(response.text());
        
        // If we got valid data, break out of the retry loop
        if (taskData && taskData.content) {
          break;
        }
      } catch (error) {
        console.error(`AI generation attempt ${attempt + 1} failed:`, error);
        attempt++;
        // Wait a short time before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // If we still don't have valid data after all attempts, use fallback content
    if (!taskData || !taskData.content) {
      return getFallbackTaskContent(taskType, userGoal);
    }
    
    return taskData;
  } catch (error) {
    console.error("Error generating task content:", error);
    return getFallbackTaskContent(taskType, userGoal);
  }
};

// Add this helper function for fallback content
const getFallbackTaskContent = (taskType, goal) => {
  const fallbackContent = {
    title: `${taskType} Task`,
    description: `Complete this ${taskType.toLowerCase()} task related to ${goal}`,
    content: `<h2>Task Overview</h2>
    <p>This is a default task for your learning journey in ${goal}.</p>
    <p>Since we couldn't generate custom content at the moment, here are some general steps you can take:</p>
    <ol>
      <li>Research the fundamentals of ${taskType.toLowerCase()} as it relates to ${goal}</li>
      <li>Find learning resources online that match your learning style</li>
      <li>Practice by creating small projects or completing exercises</li>
      <li>Review your work and identify areas for improvement</li>
    </ol>
    <p>Once you've completed these steps, mark the task as done to earn experience points!</p>`,
    quiz: [
      {
        question: `What is one important aspect of ${taskType} for someone pursuing ${goal}?`,
        options: ["Regular practice", "Understanding core concepts", "Building a portfolio", "All of the above"],
        answer: "All of the above"
      }
    ]
  };
  
  return fallbackContent;
};

// Generate daily tasks for a user
export const generateDailyTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if tasks already exist for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingTasks = await Task.find({
      userId: user._id,
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    if (existingTasks.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Tasks already generated for today',
        tasks: existingTasks
      });
    }
    
    // Determine user's time commitment and generate appropriate number of tasks
    let tasksToGenerate = 1; // Default
    
    if (user.profileData.timeCommitment === '1 hour') {
      tasksToGenerate = 2;
    } else if (user.profileData.timeCommitment === '2 hrs +') {
      tasksToGenerate = 3;
    }
    
    // Determine task types based on user's goal and learning style
    const taskTypes = determineTaskTypes(user.profileData.goal, user.profileData.learningStyle);
    
    // Generate tasks
    const tasks = [];
    
    for (let i = 0; i < tasksToGenerate; i++) {
      const taskType = taskTypes[i % taskTypes.length];
      const difficulty = getTaskDifficulty(user.profileData.level);
      const experienceReward = getExperienceReward(difficulty);
      
      // Generate task content using AI
      const taskContent = await generateTaskContent(user, taskType);
      
      // Determine skills that this task will improve
      const relevantSkills = determineSkillsForGoal(user.profileData.goal);
      const skillRewards = relevantSkills.slice(0, 2).map(skill => ({
        skill,
        points: Math.floor(5 + (difficulty * 2))
      }));
      
      // Create the task
      const task = new Task({
        title: taskContent.title,
        description: taskContent.description,
        type: taskType,
        difficultyLevel: difficulty,
        experienceReward,
        skillRewards,
        content: taskContent.content,
        quiz: taskContent.quiz || [],
        userId: user._id,
        generatedBy: 'ai',
        deadline: tomorrow
      });
      
      await task.save();
      tasks.push(task);
    }
    
    res.status(201).json({
      success: true,
      message: 'Daily tasks generated successfully',
      tasks
    });
    
  } catch (error) {
    console.error('Error generating daily tasks:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating daily tasks'
    });
  }
};

// Get all tasks for the current user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching tasks'
    });
  }
};

// Complete a task and award XP and skill points
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    if (task.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Task already completed'
      });
    }

    // Check quiz answers if the task has a quiz
    if (task.quiz && task.quiz.length > 0) {
      const { quizAnswers } = req.body;
      
      // Make sure all questions are answered
      if (!quizAnswers || Object.keys(quizAnswers).length !== task.quiz.length) {
        return res.status(400).json({
          success: false,
          message: 'Please answer all quiz questions'
        });
      }
      
      // Check if answers are correct
      const allCorrect = task.quiz.every((question, index) => 
        quizAnswers[index] === question.answer
      );
      
      if (!allCorrect) {
        return res.status(400).json({
          success: false,
          message: 'Please provide correct answers to all quiz questions'
        });
      }
    }
    
    // Update task status
    task.status = 'completed';
    task.updatedAt = Date.now();
    await task.save();
    
    // Update user's experience, skills, and streak
    const user = await User.findById(req.user.id);
    
    // Add experience
    user.profileData.experience += task.experienceReward;
    
    // Update skills
    for (const skillReward of task.skillRewards) {
      const existingSkill = user.profileData.skills.find(s => s.name === skillReward.skill);
      
      if (existingSkill) {
        existingSkill.proficiency = Math.min(100, existingSkill.proficiency + skillReward.points);
        existingSkill.lastImproved = Date.now();
      } else {
        user.profileData.skills.push({
          name: skillReward.skill,
          proficiency: skillReward.points,
          lastImproved: Date.now()
        });
      }
    }
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.profileData.streak && user.profileData.streak.lastCompleted) {
      const lastCompletedDate = new Date(user.profileData.streak.lastCompleted);
      lastCompletedDate.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompletedDate.getTime() === yesterday.getTime()) {
        // User completed a task yesterday, increment streak
        user.profileData.streak.current += 1;
        
        // Add achievement if streak milestone reached
        if (user.profileData.streak.current >= 7 && 
            user.profileData.streak.current % 7 === 0) {
          user.profileData.achievements.push({
            title: `${user.profileData.streak.current} Day Streak!`,
            description: `You've maintained your learning streak for ${user.profileData.streak.current} days!`,
            icon: 'streak'
          });
        }
        
        if (user.profileData.streak.current > user.profileData.streak.longest) {
          user.profileData.streak.longest = user.profileData.streak.current;
        }
      } else if (lastCompletedDate.getTime() !== today.getTime()) {
        // User didn't complete a task yesterday and hasn't completed one today, reset streak
        user.profileData.streak.current = 1;
      }
    } else {
      // First completed task
      user.profileData.streak.current = 1;
    }
    
    user.profileData.streak.lastCompleted = today;
    
    // Add to completed tasks
    user.profileData.completedTasks.push(task._id);
    
    // Check for level up
    const previousLevel = user.profileData.level;
    const newLevel = calculateLevel(user.profileData.experience);
    
    if (newLevel > previousLevel) {
      user.profileData.level = newLevel;
      
      // Add achievement for level up
      user.profileData.achievements.push({
        title: `Reached Level ${newLevel}`,
        description: `You've advanced to level ${newLevel}!`,
        icon: 'level-up',
        date: new Date()
      });
      
      // Check for rank up
      const previousRank = user.profileData.rank;
      const newRank = calculateRank(newLevel);
      
      if (newRank !== previousRank) {
        user.profileData.rank = newRank;
        
        user.profileData.achievements.push({
          title: `Rank Up to ${newRank}`,
          description: `You've been promoted to rank ${newRank}!`,
          icon: 'rank-up',
          date: new Date()
        });
      }
    }
    
    // Update progress towards next level
    user.profileData.progress = calculateProgressToNextLevel(user.profileData.experience, user.profileData.level);
    
    // Check for skill mastery achievements
    const masteredSkills = user.profileData.skills.filter(skill => skill.proficiency >= 80);
    for (const skill of masteredSkills) {
      // Check if we already have an achievement for this skill
      const existingAchievement = user.profileData.achievements.find(
        a => a.title === `${skill.name} Mastery` && a.icon === 'skill-mastery'
      );
      
      if (!existingAchievement) {
        user.profileData.achievements.push({
          title: `${skill.name} Mastery`,
          description: `You've mastered ${skill.name} with a proficiency of ${skill.proficiency}%!`,
          icon: 'skill-mastery',
          date: new Date()
        });
      }
    }
    
    // Save user changes
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      task,
      rewards: {
        experience: task.experienceReward,
        skills: task.skillRewards,
        levelUp: newLevel > previousLevel ? {
          from: previousLevel,
          to: newLevel
        } : null,
        rankUp: newLevel > previousLevel && calculateRank(previousLevel) !== calculateRank(newLevel) ? {
          from: calculateRank(previousLevel),
          to: calculateRank(newLevel)
        } : null
      }
    });
    
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error completing task'
    });
  }
};

// Calculate user level based on experience
const calculateLevel = (experience) => {
  // Simplified level calculation: level = sqrt(experience / 10)
  return Math.floor(Math.sqrt(experience / 10)) + 1;
};

// Calculate rank based on level
const calculateRank = (level) => {
  if (level <= 5) return 'E';
  if (level <= 10) return 'D';
  if (level <= 15) return 'C';
  if (level <= 20) return 'B';
  if (level <= 25) return 'A';
  return 'S';
};

// Calculate progress percentage to next level
const calculateProgressToNextLevel = (experience, currentLevel) => {
  const nextLevelExp = Math.pow(currentLevel, 2) * 10;
  const currentLevelExp = Math.pow(currentLevel - 1, 2) * 10;
  const expForNextLevel = nextLevelExp - currentLevelExp;
  const expSinceLastLevel = experience - currentLevelExp;
  
  return Math.min(100, Math.floor((expSinceLastLevel / expForNextLevel) * 100));
};

// Get user's profile data including rank, level, skills
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('profileData.completedTasks');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      profileData: user.profileData,
      username: user.username,
      email: user.email
    });
    
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error getting user profile'
    });
  }
};

export {generateTaskContent };