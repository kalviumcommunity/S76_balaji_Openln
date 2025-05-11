import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-sm">
        <img src="/logo1.png" alt="Open In" className="h-16 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Create your Account</h2>
        <p className="text-gray-300 mb-8">Sign up to start your journey</p>
        <form className="w-full flex flex-col gap-4 mb-6">
          <input
            type="text"
            className="rounded-lg px-4 py-2 bg-white/80 text-black placeholder-gray-500 focus:outline-none"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="email"
            className="rounded-lg px-4 py-2 bg-white/80 text-black placeholder-gray-500 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="rounded-lg px-4 py-2 bg-white/80 text-black placeholder-gray-500 focus:outline-none w-full pr-10"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? (
                // Eye open icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                // Eye closed icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L6 18m12-12l-1.636 1.636" />
                </svg>
              )}
            </button>
          </div>
          <div className="relative">
            <input
              type={showRePassword ? "text" : "password"}
              className="rounded-lg px-4 py-2 bg-white/80 text-black placeholder-gray-500 focus:outline-none w-full pr-10"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={e => setRePassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
              onClick={() => setShowRePassword((v) => !v)}
              tabIndex={-1}
            >
              {showRePassword ? (
                // Eye open icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                // Eye closed icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L6 18m12-12l-1.636 1.636" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center w-full mb-6">
          <div className="flex-grow border-t border-white/30"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-white/30"></div>
        </div>
        <button
          className="flex items-center gap-3 bg-white/80 hover:bg-white text-black font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 w-full justify-center"
        >
          <svg className="h-6 w-6" viewBox="0 0 48 48">
            <g>
              <path d="M44.5 20H24v8.5h11.7C34.2 33.9 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.5 29.6 2 24 2 12.9 2 4 10.9 4 22s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z" fill="#FFC107"/>
              <path d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.5 29.6 2 24 2 15.3 2 7.9 7.8 6.3 14.7z" fill="#FF3D00"/>
              <path d="M24 44c5.5 0 10.4-1.8 14.2-4.9l-6.6-5.4C29.6 37 24 37 24 37c-5.6 0-10.2-3.1-12.7-7.6l-6.5 5C7.9 40.2 15.3 44 24 44z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 6.5-11.7 6.5-5.6 0-10.2-3.1-12.7-7.6l-6.5 5C7.9 40.2 15.3 44 24 44c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z" fill="#1976D2"/>
            </g>
          </svg>
          Sign up with Google
        </button>
        <p className="mt-6 text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;