import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TodaysTask from '../components/TodaysTask';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'USER',
    rank: 'E',
    level: 2,
    progress: 22,
  });

  const [userGoal, setUserGoal] = useState('Full Stack developer');

  useEffect(() => {
    const goal = localStorage.getItem('userGoal');
    if (goal) setUserGoal(goal);
  }, []);

  return (
    <div className="min-h-screen  bg-black text-white flex flex-col">
      {/* Header with logo */}
      <header className="p-6 pb-0">
        <Link to="/" className="flex items-center">
          <img src="/logo1.png" alt="Open In" className="h-8" />
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex mb-40 mt-15 items-center justify-center relative">
        {/* Purple background ellipse */}
        <img
          src="/bg-ell.png"
          alt="background"
          className="absolute inset-0 w-[500px] opacity-40 h-[700px] blur-md object-cover md:ml-[57%] mt-8 pointer-events-none z-0"
        />

        {/* Card */}
        <div
          className="relative  z-10 backdrop-blur-md bg-white/15 rounded-[30px] flex flex-col md:flex-row items-center shadow-lg w-[92vw] h-auto md:h-[80vh]  md:p-0  overflow-y-auto"
          style={{
            maxWidth: 1300,
            minWidth: "auto",
            minHeight: 420,
            margin: "0 auto",
            padding: "0 4vw",
          }}
        >
          {/* Left: Welcome */}
          <div className="flex flex-col justify-center w-full md:w-auto" style={{ minWidth: "auto", md: { minWidth: 420 } }}>
            <h2 className="text-5xl md:text-[90px] font-light leading-none mb-4 md:mb-8 text-center md:text-left">Welcome</h2>
            <h3 className="text-5xl md:text-[90px] font-bold text-[#A259FF] leading-none text-center md:text-left">{user.name}</h3>
          </div>

          {/* Right: Stats */}
          <div className="flex flex-col gap-8 w-full md:w-[420px] mt-8 md:mt-0 md:ml-auto">
            {/* Rank & Level */}
            <div className="flex  gap-4 md:gap-8">
              <div className="flex-1 hover:scale-105 bg-white/15  rounded-2xl px-4 md:px-8 py-4 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-normal text-white">
                  Rank: <span className="font-bold text-[#FFD600]">{user.rank}</span>
                </span>
              </div>
              <div className="flex-1 hover:scale-105  bg-white/15 rounded-2xl px-4 md:px-8 py-4 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-normal text-white">
                  level: <span className="font-bold text-[#FFD600]">{user.level}</span>
                </span>
              </div>
            </div>
            {/* Progress */}
            <div className=" bg-white/15 hover:scale-105 rounded-2xl px-4 md:px-8 py-5 flex flex-col justify-center">
              <div className="flex justify-between text-lg font-medium mb-2">
                <span className="text-[#A259FF]">E</span>
                <span className="text-white/70">D</span>
              </div>
              <div className="w-full hover:bg-white/60 h-4 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A259FF] rounded-full"
                  style={{ width: `${user.progress}%` }}
                />
              </div>
            </div>
            {/* Goal */}
            <div className=" bg-white/15 rounded-2xl hover:scale-105 px-4 md:px-8 py-5 flex flex-col items-center">
              <span className="text-xl md:text-2xl font-normal text-white mb-2">Goal</span>
              <span className="text-lg md:text-xl font-medium text-[#FFD600] bg-white/10 rounded-xl px-4 py-2 w-full text-center">
                {userGoal}
              </span>
            </div>
          </div>
        </div>
      </div>
      <TodaysTask/>
    </div>
  );
};

export default Dashboard;