import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.js';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - explicitly specify path to .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Debug: Log to check if environment variables are loaded
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Loaded' : 'Missing');
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Loaded' : 'Missing');

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production' 
        ? 'https://s76-balaji-openln.onrender.com/api/auth/google/callback'
        : 'http://localhost:5000/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        let isNewUser = false;
        
        if (user) {
          // User exists, return the user
          return done(null, user);
        }
        
        // Check if user exists with the same email
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Update existing user with Google ID
          user.googleId = profile.id;
          user.isGoogleUser = true;
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = await User.create({
          username: profile.displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 1000),
          email: profile.emails[0].value,
          password: Math.random().toString(36).slice(-8), // Random password
          googleId: profile.id,
          isGoogleUser: true,
          profileData: {
            // Initialize with empty profile data that will be filled during onboarding
            goal: "",
            timeCommitment: "",
            learningStyle: ""
          }
        });
        
        // Mark this as a new user that needs onboarding
        newUser.__isNewUser = true;
        isNewUser = true;
        
        return done(null, {...newUser._doc, __isNewUser: isNewUser});
      } catch (error) {
        console.error("Google auth error:", error);
        return done(error, false);
      }
    }
  )
);

// Serialize and deserialize user (required for session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

// JWT Secret for signing tokens
export const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB URI for database connection
export const MONGO_URI = process.env.MONGO_URI;

// Node environment (development or production)
export const NODE_ENV = process.env.NODE_ENV;

// Port number for the server
export const PORT = process.env.PORT;

// Google Client ID for OAuth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Google Client Secret for OAuth
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Client URL for redirecting after authentication
export const CLIENT_URL = process.env.CLIENT_URL;