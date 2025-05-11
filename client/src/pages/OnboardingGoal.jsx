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

	const handleGoalSelect = (goal) => {
		// Save the selected goal (you could use localStorage, context, or redux)
		localStorage.setItem("userGoal", goal);
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
			// Navigate to the next onboarding step
			navigate("/onboarding/time-commitment");
		}
	};

	const toggleAiChat = () => {
		setShowAiChat(!showAiChat);
	};

	return (
		<div className="min-h-screen w-full flex bg-black">
			{/* Left: Progress & Title */}
			<div className="flex flex-col justify-center items-center flex-1 bg-black relative">
				<h1 className="text-white text-[70px] font-bold mb-4 mt-[-80px] leading-none">
					Onboarding
				</h1>
				<div className="text-purple-600 text-[140px] font-bold mb-2 leading-none">
					1
				</div>
				<div className="text-white text-[42px] mb-16 font-light">
					Pick Your goal
				</div>
				<div className="w-[370px] h-3 bg-gray-300 rounded-full overflow-hidden absolute bottom-16">
					<div
						className="h-full bg-purple-600 rounded-full"
						style={{ width: "5%" }}
					/>
				</div>
			</div>

			{/* Right: Goal Selection or AI Chat */}
			<div className="flex-1 bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] relative">
				<div className="w-full h-full flex flex-col justify-center items-center px-6">
					<div className="w-full max-w-md">
						{!showAiChat ? (
							<>
								<div className="flex flex-col items-center gap-4 mb-8">
									{suggestedGoals.map((goal) => (
										<button
											key={goal}
											className="w-full py-3 rounded-2xl text-white text-lg font-medium bg-[#4a295a] bg-opacity-60 hover:bg-purple-700 transition-colors duration-300"
											onClick={() => handleGoalSelect(goal)}
										>
											{goal}
										</button>
									))}
								</div>

								<div className="text-gray-400 text-center mb-6">
									Select one or type your own
								</div>

								<form onSubmit={handleInputSubmit} className="w-full">
									<div className="relative">
										<input
											type="text"
											className="w-full bg-[#4a295a] bg-opacity-60 rounded-2xl py-3 px-4 text-white placeholder-gray-300 focus:outline-none"
											placeholder="Type your own goal..."
											value={userGoal}
											onChange={handleInputChange}
										/>
										<button
											type="submit"
											disabled={!userGoal.trim()}
											className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-xl transition-colors"
										>
											Next
										</button>
									</div>
								</form>

								<div className="text-center mt-8">
									<button
										onClick={toggleAiChat}
										className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 mx-auto"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
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
							<div className="h-[500px] flex flex-col">
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