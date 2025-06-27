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
	const [isAiMinimized, setIsAiMinimized] = useState(false);
	const navigate = useNavigate();

	// Save goal to backend function
	const saveGoalToBackend = async (goal) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/login");
				return;
			}

			// Use the appropriate URL based on environment
			const backendUrl =
				process.env.NODE_ENV === "production"
					? "https://s76-balaji-openln.onrender.com"
					: "http://localhost:5000";

			await fetch(`${backendUrl}/api/auth/profile`, {
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
		setIsAiMinimized(false);
	};

	const toggleAiMinimize = () => {
		setIsAiMinimized(!isAiMinimized);
	};

	return (
		<div className="min-h-screen w-full flex flex-col md:flex-row bg-black">
			{/* Left side - now top on mobile */}
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

			{/* Right side - now bottom on mobile */}
			<div className="flex-1 bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] relative pb-10 md:pb-0">
				<div className="w-full h-full flex flex-col justify-start md:justify-center items-center px-4 md:px-6 pt-8 md:pt-0">
					<div className="w-full max-w-md">
						{!showAiChat ? (
							<>
								<div className="flex flex-col items-center gap-3 md:gap-4 mb-6 md:mb-8">
									{suggestedGoals.map((goal) => (
										<button
											key={goal}
											className="w-full py-3 px-4 rounded-2xl text-white text-base md:text-lg font-medium bg-[#4a295a] bg-opacity-60 hover:bg-purple-700 hover:scale-105 transition-all duration-300"
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
											className="w-full bg-[#4a295a] bg-opacity-60 rounded-2xl py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
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

								<div className="text-center mt-8 md:mt-10">
									<button
										onClick={toggleAiChat}
										className="bg-[#4a295a] hover:bg-purple-700 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:scale-105 shadow-lg"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 md:h-6 md:w-6"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
											<path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
										</svg>
										Ask Cosa AI for Help
									</button>
									<p className="text-gray-300 text-xs md:text-sm mt-2">
										Not sure what goal to pick? Chat with our AI assistant!
									</p>
								</div>
							</>
						) : (
							<div className="relative h-[400px] md:h-[500px] flex flex-col">
								{isAiMinimized ? (
									<div
										className="fixed bottom-6 right-6 bg-purple-700 rounded-full p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform z-50"
										onClick={toggleAiMinimize}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="white"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
											/>
										</svg>
									</div>
								) : (
									<div className="relative w-full h-full rounded-xl shadow-xl overflow-hidden">
										<div className="absolute top-2 right-2 z-10 flex gap-2">
											<button
												onClick={toggleAiMinimize}
												className="bg-white/20 hover:bg-white/30 rounded-full p-1.5"
												title="Minimize"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="white"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M18 12H6"
													/>
												</svg>
											</button>
											<button
												onClick={toggleAiChat}
												className="bg-white/20 hover:bg-white/30 rounded-full p-1.5"
												title="Close"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="white"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
										<AiChat
											onClose={toggleAiChat}
											onSelectGoal={handleGoalSelect}
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* AI suggestion floating button (when not showing chat and not on mobile) */}
			{!showAiChat && (
				<div className="hidden md:block fixed bottom-6 right-6">
					<button
						onClick={toggleAiChat}
						className="bg-purple-700 hover:bg-purple-800 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
						title="Ask AI for help"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
};

export default OnboardingGoal;