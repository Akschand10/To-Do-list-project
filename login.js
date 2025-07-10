import React, { useState } from "react";
import axios from "axios";
import './AuthForms.css'; 

function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5050/login", { username: username.trim() });
      localStorage.setItem("userId", res.data.userId);
      onLogin(res.data.userId);
    } catch (err) {
      setError("Invalid username or an error occurred.");
    }
  };

  return (
    <div className="auth-container"> 
      <div className="auth-form"> 
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>} 
        <p className="switch-link"> 
          Don't have an account?{" "}
          <button onClick={switchToRegister}>
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;