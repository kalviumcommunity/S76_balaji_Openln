import User from '../models/user.js';
import Roadmap from '../models/roadmap.js';
import jwt from 'jsonwebtoken';

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: userExists.email === email 
          ? 'Email already in use' 
          : 'Username already taken' 
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileData: user.profileData
      }
    });

    // Generate user roadmap (default or based on user goal)
    const generateUserRoadmap = async (userId, goal, learningStyle) => {
      try {
        const user = await User.findById(userId);
        if (!user) return;
        
        // Generate roadmap based on user's goal
        const roadmapTitle = `Your path to ${goal}`;
        const roadmapDescription = `A personalized learning journey to help you ${goal.toLowerCase()}`;
        
        // Create basic milestone structure based on goal
        let milestones = [];
        
        if (goal === "Starting an Startup") {
          milestones = [
            {
              title: "Business Foundations",
              description: "Learn the fundamentals of business planning and market research",
              status: "available", // First milestone is available immediately
              order: 1,
              type: "knowledge",
              requiredSkills: [],
              unlockConditions: { minimumLevel: 1 },
              rewards: { 
                experience: 50,
                skills: [
                  { skill: "Business Planning", points: 15 },
                  { skill: "Market Research", points: 10 }
                ]
              },
              content: {
                overview: "In this milestone, you'll learn the basics of business planning and how to validate your startup idea.",
                steps: [
                  "Understand the business model canvas",
                  "Learn how to conduct market research",
                  "Identify your target customers",
                  "Create a value proposition"
                ],
                resources: [
                  { title: "Business Model Canvas Explained", type: "video" },
                  { title: "Market Research Fundamentals", type: "article" }
                ]
              },
              estimatedTime: "2-3 weeks",
              difficulty: 1
            },
            {
              title: "MVP Development",
              description: "Build your minimum viable product and get early feedback",
              status: "locked",
              order: 2,
              type: "project",
              unlockConditions: { 
                minimumLevel: 2
              },
              rewards: { 
                experience: 75,
                skills: [
                  { skill: "Product Development", points: 20 },
                  { skill: "User Testing", points: 15 }
                ]
              },
              content: {
                overview: "Create a minimal version of your product to test with real users.",
                steps: [
                  "Define your MVP features",
                  "Create a development timeline",
                  "Build a prototype",
                  "Test with early adopters"
                ]
              },
              estimatedTime: "4-6 weeks",
              difficulty: 2
            },
            // Additional milestones...
          ];
        } 
        else if (goal === "Full stack Dev") {
          milestones = [
            {
              title: "Frontend Fundamentals",
              description: "Learn HTML, CSS and JavaScript basics",
              status: "available",
              order: 1,
              type: "knowledge",
              rewards: { 
                experience: 50,
                skills: [
                  { skill: "HTML/CSS", points: 15 },
                  { skill: "JavaScript", points: 10 }
                ]
              },
              content: {
                overview: "Master the building blocks of web development.",
                steps: [
                  "Learn HTML structure and semantics",
                  "Style with CSS and responsive design",
                  "JavaScript fundamentals and DOM manipulation",
                  "Build your first interactive webpage"
                ]
              },
              estimatedTime: "3-4 weeks",
              difficulty: 1
            },
            // Additional milestones...
          ];
        }
        // Add more goal-specific roadmaps
        
        // Create the roadmap
        const roadmap = new Roadmap({
          userId,
          title: roadmapTitle,
          description: roadmapDescription,
          goal,
          milestones
        });
        
        await roadmap.save();
        
        // Link to user
        user.profileData.roadmapId = roadmap._id;
        await user.save();
        
        return roadmap;
      } catch (error) {
        console.error("Error generating roadmap:", error);
        return null;
      }
    };

    // Call this function at the end of the onboarding process
    // e.g., after user selects their goal and learning style

  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during signup'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Set HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileData: user.profileData
      }
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error getting user profile'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({ 
    success: true,
    message: 'Logged out successfully' 
  });
};

// @desc    Update user profile data
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { goal, timeCommitment, learningStyle } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update profile data
    if (goal) user.profileData.goal = goal;
    if (timeCommitment) user.profileData.timeCommitment = timeCommitment;
    if (learningStyle) user.profileData.learningStyle = learningStyle;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileData: user.profileData
      }
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile'
    });
  }
};

// Google OAuth callback
export const googleCallback = (req, res) => {
  try {
    // Check if this is a new user (created during this authentication)
    const isNewUser = req.user.__isNewUser || false;

    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Redirect to frontend with token and newUser flag if applicable
    const redirectUrl = isNewUser 
      ? `${process.env.CLIENT_URL}/login?token=${token}&newUser=true`
      : `${process.env.CLIENT_URL}/login?token=${token}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in Google auth callback:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=ServerError`);
  }
};