import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const learningStyles = [
	{
		name: "Visual",
		description:
			"You learn best through images, diagrams, and spatial understanding",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 md:h-8 md:w-8"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
				<path
					fillRule="evenodd"
					d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: "Auditory",
		description:
			"You learn best by listening to lectures, discussions, and explanations",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 md:h-8 md:w-8"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: "Reading/Writing",
		description: "You learn best through reading text and writing notes",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 md:h-8 md:w-8"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
			</svg>
		),
	},
	{
		name: "Kinesthetic",
		description: "You learn best through hands-on activities and practice",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 md:h-8 md:w-8"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: "Mixed/Flexible",
		description: "You adapt your learning style based on the subject matter",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 md:h-8 md:w-8"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
		),
	},
];

const OnboardingLearningStyle = () => {
	const [selectedStyle, setSelectedStyle] = useState(null);
	const navigate = useNavigate();

	const saveToBackend = async (style) => {
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
					learningStyle: style,
				}),
				credentials: "include",
			});
		} catch (error) {
			console.error("Error saving learning style:", error);
		}
	};

	const handleStyleSelect = (style) => {
		// Save the selected learning style
		localStorage.setItem("learningStyle", style);
		saveToBackend(style);

		// Navigate to the quiz page (which will be skipable)
		navigate("/onboarding/quiz");
	};

	return (
		<div className="min-h-screen w-full flex flex-col md:flex-row bg-black">
			{/* Left: Progress & Title - Now top section on mobile */}
			<div className="flex flex-col justify-center items-center py-8 md:py-0 md:flex-1 bg-black relative">
				<h1 className="text-white text-4xl md:text-[70px] font-bold mb-2 md:mb-4 md:mt-[-80px] leading-none text-center">
					Onboarding
				</h1>
				<div className="text-purple-600 text-7xl md:text-[140px] font-bold mb-1 md:mb-2 leading-none">
					3
				</div>
				<div className="text-white text-2xl md:text-[42px] mb-8 md:mb-16 font-light text-center">
					Learning Style
				</div>
				<div className="w-[80%] md:w-[370px] h-3 bg-gray-300 rounded-full overflow-hidden md:absolute md:bottom-16">
					<div
						className="h-full bg-purple-600 rounded-full"
						style={{ width: "75%" }}
					/>
				</div>
			</div>

			{/* Right: Learning Style Options - Now bottom section on mobile */}
			<div className="flex-1 bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] relative pb-10 md:pb-0">
				<div className="w-full h-full flex flex-col justify-start md:justify-center items-center px-4 md:px-6 pt-8 md:pt-0">
					<div className="w-full max-w-md">
						<div className="mb-4 md:mb-6 text-center">
							<h2 className="text-white text-xl md:text-2xl font-medium mb-2">
								Choose Your Learning Style
							</h2>
							<p className="text-gray-300 text-sm md:text-base">
								Selecting your preferred learning style helps us tailor your
								experience.
							</p>
						</div>

						<div className="flex flex-col gap-3 md:gap-4">
							{learningStyles.map((style) => (
								<button
									key={style.name}
									className="flex items-center gap-3 md:gap-4 bg-[#4a295a] bg-opacity-60 hover:bg-purple-700 text-white p-3 md:p-4 rounded-2xl text-base md:text-lg transition-colors duration-300"
									onClick={() => handleStyleSelect(style.name)}
								>
									<div className="flex-shrink-0 bg-purple-800/50 p-2 md:p-3 rounded-xl">
										{style.icon}
									</div>
									<div className="text-left">
										<h3 className="font-medium text-base md:text-lg">
											{style.name}
										</h3>
										<p className="text-xs md:text-sm text-gray-300">
											{style.description}
										</p>
									</div>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingLearningStyle;