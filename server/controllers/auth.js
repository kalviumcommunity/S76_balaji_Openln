import User from '../models/user.js';
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
    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Error in Google auth callback:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=ServerError`);
  }
};