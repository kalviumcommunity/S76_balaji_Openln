import React from "react";
import { useNavigate } from "react-router-dom";

const timeOptions = [
  "30 Min",
  "1 hour",
  "2 hrs +",
  "Flexible"
];

const OnboardingTimeCommitment = () => {
  const navigate = useNavigate();

  const handleTimeSelect = (time) => {
    // Save the selected time commitment
    localStorage.setItem("timeCommitment", time);
    // Navigate to the next onboarding step (learning style)
    navigate("/onboarding/learning-style");
  };

  return (
    <div className="min-h-screen w-full flex bg-black">
      {/* Left: Progress & Title */}
      <div className="flex flex-col justify-center items-center flex-1 bg-black relative">
        <h1 className="text-white text-[70px] font-bold mb-4 mt-[-80px] leading-none">Onboarding</h1>
        <div className="text-purple-600 text-[140px] font-bold mb-2 leading-none">2</div>
        <div className="text-white text-[42px] mb-16 font-light">Daily Time Commitment</div>
        <div className="w-[370px] h-3 bg-gray-300 rounded-full overflow-hidden absolute bottom-16">
          <div className="h-full bg-purple-600 rounded-full" style={{ width: "20%" }} />
        </div>
      </div>
      
      {/* Right: Time Selection */}
      <div className="flex-1 bg-gradient-to-br from-[#1a0026] via-[#2d0036] to-[#3a005c] relative">
        <div className="w-full h-full flex flex-col justify-center items-center px-6">
          <div className="w-full max-w-md grid grid-cols-2 gap-5">
            {timeOptions.map((time, index) => (
              <button
                key={time}
                className={`py-4 rounded-2xl text-white text-lg font-medium bg-[#4a295a] bg-opacity-60 hover:bg-purple-700 transition-colors duration-300 ${
                  index >= 2 ? 'col-span-1 sm:col-span-2' : ''
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTimeCommitment;