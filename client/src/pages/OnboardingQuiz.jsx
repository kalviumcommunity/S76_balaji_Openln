import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import quizQuestions from "../data/quizQuestions";

const OnboardingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);  // Add this state
  const navigate = useNavigate();

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option
    });
    
    // Auto advance to next question
    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 800);
    } else {
      // Last question answered
      setTimeout(() => {
        setCompleted(true);
      }, 800);
    }
  };

  const handleSkip = () => {
    // Mark quiz as skipped
    localStorage.setItem("quizCompleted", "skipped");
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleFinish = () => {
    // Save quiz answers to localStorage
    localStorage.setItem("quizAnswers", JSON.stringify(selectedAnswers));
    localStorage.setItem("quizCompleted", "true");
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const startQuiz = () => {
    setQuizStarted(true);  // This will bypass the start screen
  };

  // Start screen before quiz begins
  if (!quizStarted) {  // Changed condition to use new state variable
    return (
      <div className="min-h-screen w-full bg-black flex justify-center items-center">
        <div className="bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] w-full max-w-4xl p-12 rounded-3xl">
          <h2 className="text-white text-4xl font-bold text-center mb-8">
            Quick Knowledge Check
          </h2>
          
          <p className="text-gray-300 text-center text-lg mb-12">
            Let's assess your current knowledge level with a quick 5-question quiz.
            This helps us personalize your learning path.
          </p>
          
          <div className="flex flex-col gap-6 items-center">
            <button
              onClick={startQuiz}  // Use the new function
              className="bg-purple-600 hover:bg-purple-700 transition-colors w-64 py-4 rounded-2xl text-white text-lg font-medium"
            >
              Start Quiz
            </button>
            
            <button
              onClick={handleSkip}
              className="text-purple-400 hover:text-purple-300 text-lg"
            >
              Skip Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completion screen
  if (completed) {
    return (
      <div className="min-h-screen w-full bg-black flex justify-center items-center">
        <div className="bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] w-full max-w-4xl p-12 rounded-3xl">
          <h2 className="text-white text-4xl font-bold text-center mb-8">
            Quiz Completed!
          </h2>
          
          <p className="text-gray-300 text-center text-lg mb-12">
            Thanks for completing the quiz. We'll use your answers to customize your learning experience.
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={handleFinish}
              className="bg-purple-600 hover:bg-purple-700 transition-colors w-64 py-4 rounded-2xl text-white text-lg font-medium"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz question
  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen w-full bg-black flex justify-center items-center">
      <div className="bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] w-full max-w-4xl p-12 rounded-3xl">
        <div className="flex justify-between mb-8">
          <h2 className="text-white text-3xl font-bold">
            {question.question}
          </h2>
          <div className="text-white text-3xl font-bold">
            {currentQuestion + 1}/{quizQuestions.length}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`py-4 px-6 text-xl text-white text-center rounded-2xl transition-colors duration-300 ${
                selectedAnswers[currentQuestion] === option 
                  ? "bg-purple-700" 
                  : "bg-[#4a295a] bg-opacity-60 hover:bg-purple-700"
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswers[currentQuestion]}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;