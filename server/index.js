import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router as routes } from './routes.js';
import connectDB from './config/db.js';
import passport from './config/passport.js'; // Import passport configuration

// Load environment variables - at the very top of the file
dotenv.config();
console.log("Server ENV loaded - Google Client ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set");

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
    origin: ["http://localhost:5173", "https://openln.netlify.app" ,"https://openln.pages.dev"], 
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));