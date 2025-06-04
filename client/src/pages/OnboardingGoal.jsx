import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AiChat from "../components/AiChat";

const suggestedGoals = [
	"Getting 12+ lpa job",
	"Starting an Startup",
	"Full stack Dev",
	"Crack GSOC",
];

const OnboardingGoal = () => {
	const [userGoal, setUserGoal] = useState("");
	const [showAiChat, setShowAiChat] = useState(false);
	const navigate = useNavigate();

	// Add this function to save the goal to the backend
	const saveGoalToBackend = async (goal) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/login");
				return;
			}

			await fetch("http://localhost:5000/api/auth/profile", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					goal: goal,
				}),
				credentials: "include",
			});
		} catch (error) {
			console.error("Error saving goal:", error);
		}
	};

	const handleGoalSelect = (goal) => {
		// Save the selected goal to localStorage
		localStorage.setItem("userGoal", goal);
		// Also save to backend
		saveGoalToBackend(goal);
		// Navigate to the next onboarding step
		navigate("/onboarding/time-commitment");
	};

	const handleInputChange = (e) => {
		setUserGoal(e.target.value);
	};

	const handleInputSubmit = (e) => {
		e.preventDefault();
		if (userGoal.trim()) {
			// Save the custom goal
			localStorage.setItem("userGoal", userGoal);
			// Also save to backend
			saveGoalToBackend(userGoal);
			// Navigate to the next onboarding step
			navigate("/onboarding/time-commitment");
		}
	};

	const toggleAiChat = () => {
		setShowAiChat(!showAiChat);
	};

	return (
		<div className="min-h-screen w-full flex flex-col md:flex-row bg-black">
			{/* Left: Progress & Title - Now top section on mobile */}
			<div className="flex flex-col justify-center items-center py-8 md:py-0 md:flex-1 bg-black relative">
				<h1 className="text-white text-4xl md:text-[70px] font-bold mb-2 md:mb-4 md:mt-[-80px] leading-none text-center">
					Onboarding
				</h1>
				<div className="text-purple-600 text-7xl md:text-[140px] font-bold mb-1 md:mb-2 leading-none">
					1
				</div>
				<div className="text-white text-2xl md:text-[42px] mb-8 md:mb-16 font-light text-center">
					Pick Your goal
				</div>
				<div className="w-[80%] md:w-[370px] h-3 bg-gray-300 rounded-full overflow-hidden md:absolute md:bottom-16">
					<div
						className="h-full bg-purple-600 rounded-full"
						style={{ width: "5%" }}
					/>
				</div>
			</div>

			{/* Right: Goal Selection or AI Chat - Now bottom section on mobile */}
			<div className="flex-1 bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] relative pb-10 md:pb-0">
				<div className="w-full h-full flex flex-col justify-start md:justify-center items-center px-4 md:px-6 pt-8 md:pt-0">
					<div className="w-full max-w-md">
						{!showAiChat ? (
							<>
								<div className="flex flex-col items-center gap-3 md:gap-4 mb-6 md:mb-8">
									{suggestedGoals.map((goal) => (
										<button
											key={goal}
											className="w-full py-3 px-4 rounded-2xl text-white text-base md:text-lg font-medium bg-[#4a295a] bg-opacity-60 hover:bg-purple-700 transition-colors duration-300"
											onClick={() => handleGoalSelect(goal)}
										>
											{goal}
										</button>
									))}
								</div>

								<div className="text-gray-400 text-center mb-4 md:mb-6 text-sm md:text-base">
									Select one or type your own
								</div>

								<form onSubmit={handleInputSubmit} className="w-full">
									<div className="relative">
										<input
											type="text"
											className="w-full bg-[#4a295a] bg-opacity-60 rounded-2xl py-3 px-4 text-white placeholder-gray-300 focus:outline-none text-sm md:text-base"
											placeholder="Type your own goal..."
											value={userGoal}
											onChange={handleInputChange}
										/>
										<button
											type="submit"
											disabled={!userGoal.trim()}
											className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 md:px-4 py-1.5 rounded-xl transition-colors text-sm md:text-base"
										>
											Next
										</button>
									</div>
								</form>

								<div className="text-center mt-6 md:mt-8">
									<button
										onClick={toggleAiChat}
										className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 mx-auto text-xs md:text-sm"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 md:h-5 md:w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
												clipRule="evenodd"
											/>
										</svg>
										Not sure what to choose? Chat with Cosa AI
									</button>
								</div>
							</>
						) : (
							<div className="h-[400px] md:h-[500px] flex flex-col">
								<AiChat
									onClose={toggleAiChat}
									onSelectGoal={handleGoalSelect}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingGoal;