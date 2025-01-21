import React, { useState } from "react";
import axios from "axios";
import "./userlogin.css";
import { useNavigate } from "react-router-dom";
import { pinwheel } from "ldrs";

pinwheel.register();

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/users/login" : "/api/users/signup";
    const data = { email, password };

    try {
      setIsLoading(true);
      setMessage(""); // Clear previous messages
      const response = await axios.post(`http://localhost:5000${endpoint}`, data);

      if (isLogin && response.data.success) {
        // Save token in localStorage
        localStorage.setItem("token", response.data.token);
        console.log("DEBUG: Login API Response:", response.data); // ✅ Debug the response

        if (response.data.user && response.data.user._id && response.data.user.email) {
        
          localStorage.setItem("user", JSON.stringify({
              _id: response.data.user._id,
              email: response.data.user.email
          }));
      } else {
          console.error("Error: userId or email is missing in login response.");
          alert("Login failed. Please try again.");
          return;
      }
      
        setMessage("Login successful! Redirecting to user dashboard...");
        setTimeout(() => {
          setIsLoading(false);
          navigate("/userfp");
        }, 2000); // Simulate delay for UI feedback
      } else if (!response.data.success) {
        setMessage(response.data.message || "Login failed.");
        setIsLoading(false);
      } else {
        // For Signup
        setMessage(response.data.message || "Signup successful. Please verify your email.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="userlogin-container">
      <div className="userlogin-box">
        <h1 className="userlogin-header">{isLogin ? "Login" : "Signup"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="userlogin-input-container">
            <label className="userlogin-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="userlogin-input"
            />
          </div>
          <div className="userlogin-input-container">
            <label className="userlogin-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="userlogin-input"
            />
          </div>
          {message && (
            <p className="userlogin-message">
              {message}{" "}
              {isLoading && (
                <l-pinwheel size="20" stroke="2" speed="0.9" color="#5cb85c"></l-pinwheel>
              )}
            </p>
          )}
          <button type="submit" className="userlogin-button" disabled={isLoading}>
            {isLoading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p className="userlogin-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
