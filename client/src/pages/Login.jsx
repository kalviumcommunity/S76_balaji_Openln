import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("https://s76-balaji-openln.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
        credentials: "include"
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
      // Redirect to dashboard
      navigate("/dashboard");
      
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-sm">
        <img src="/logo1.png" alt="Open In" className="h-16 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-300 mb-8">Sign in to continue to Open ln</p>
        
        {error && (
          <div className="w-full bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form className="w-full flex flex-col gap-4 mb-6" onSubmit={handleSubmit}>
          <input
            type="email"
            className="rounded-lg px-4 py-2 bg-white/80 text-black placeholder-gray-500 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            className="rounded-lg px-4 py-2 bg-white/80 text-black placeholder-gray-500 focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex items-center w-full mb-6">
          <div className="flex-grow border-t border-white/30"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-white/30"></div>
        </div>
        <button
          disabled={true} // Disable Google login for now
          className="flex items-center gap-3 bg-gray-400/40 text-gray-300 font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 w-full justify-center cursor-not-allowed"
        >
          <svg className="h-6 w-6" viewBox="0 0 48 48">
            <g>
              <path d="M44.5 20H24v8.5h11.7C34.2 33.9 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.5 29.6 2 24 2 12.9 2 4 10.9 4 22s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z" fill="#FFC107"/>
              <path d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.5 29.6 2 24 2 15.3 2 7.9 7.8 6.3 14.7z" fill="#FF3D00"/>
              <path d="M24 44c5.5 0 10.4-1.8 14.2-4.9l-6.6-5.4C29.6 37 24 37 24 37c-5.6 0-10.2-3.1-12.7-7.6l-6.5 5C7.9 40.2 15.3 44 24 44z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 6.5-11.7 6.5-5.6 0-10.2-3.1-12.7-7.6l-6.5 5C7.9 40.2 15.3 44 24 44c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z" fill="#1976D2"/>
            </g>
          </svg>
          Google Sign In (Coming Soon)
        </button>
        <p className="mt-6 text-gray-300 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;