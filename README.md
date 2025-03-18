## Open ln

### An AI-Driven Language Learning Platform

#### Empower your speaking skills with real-time AI conversations!

This platform helps users improve their spoken language through interactive voice practice, real-time AI feedback, and progress tracking.
🚀 Features

✅ Real-Time AI Conversations:

    Engage in live voice chats with AI-powered responses.
    Seamless interaction using WebRTC for real-time voice communication.

✅ Instant AI Feedback:

    AI provides basic score-based or comment-based feedback after each conversation.
    Helps users identify areas of improvement.

✅ Voice Recording & Playback:

    Users can record and replay their practice sessions.
    Tracks speaking improvement over time.

✅ Scenario-Based Practice:

    Choose from basic conversation scenarios (greetings, ordering food, etc.).
    AI generates dynamic responses to simulate real-world conversations.

✅ User Authentication:

    Google OAuth for secure and seamless login.

✅ Progress Tracking:

    View past recordings and feedback.
    Monitor speaking improvement over multiple sessions.

🛠️ Tech Stack
🌟 Frontend

    React.js – User interface with dynamic components.
    Tailwind CSS – Modern styling with glassy, cyberpunk-inspired theme.

⚙️ Backend

    Node.js + Express.js – API server for handling voice data and interactions.
    WebRTC – Real-time voice communication.
    Gemini API (Google AI) – Generates AI conversations and feedback.

💾 Database

    MongoDB Atlas – Stores voice recordings and user progress data.

🔑 Authentication

    Google OAuth – User login and authentication.

🚀 Deployment

    Frontend: Netlify or similar.
    Backend: Render or similar.
    Database: MongoDB Atlas.

🔥 Getting Started
📦 Installation

    Clone the repository:

git clone <your-repo-url>
cd ai-language-learning

    Install dependencies:

npm install

    Start the development server:

npm run dev

⚙️ Environment Variables

Create a .env file in the root directory and add the following variables:

MONGO_URI=<Your MongoDB Atlas connection string>
GEMINI_API_KEY=<Your Gemini API key>
GOOGLE_CLIENT_ID=<Your Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<Your Google OAuth Client Secret>
JWT_SECRET=<Your JWT Secret>

🛠️ Usage

    Sign Up/Login:
        Users can log in using Google OAuth.
    Select a Scenario:
        Choose from basic conversation topics.
    Start Practicing:
        Speak into the mic and engage in a real-time conversation with AI.
    Get Feedback:
        Receive AI-powered feedback and listen to your recordings.
    Track Your Progress:
        View past sessions and monitor improvement.

🛡️ Future Enhancements

✅ Multi-Language Support: Add support for practicing in multiple languages.
✅ Advanced Feedback: Detailed pronunciation and grammar suggestions.
✅ Gamification: Add badges and points for motivation.
✅ Dark Mode: User-friendly interface with theme switching.
🤝 Contributing

Contributions are welcome!

    Fork the repo
    Create a new branch (git checkout -b feature-name)
    Commit your changes (git commit -m 'Add feature')
    Push the branch (git push origin feature-name)
    Open a Pull Request
