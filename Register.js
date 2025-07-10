import React, { useState } from "react";
import axios from "axios";
import './AuthForms.css';

function Register({ onRegister, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5050/register", { username: username.trim() });
      localStorage.setItem("userId", res.data.userId);
      onRegister(res.data.userId);
    } catch (err) {
      setError("Username already exists or an error occurred.");
    }
  };

  return (
    <div className="auth-container"> 
      <div className="auth-form"> 
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter unique username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        {error && <p className="error-message">{error}</p>} 
        <p className="switch-link"> 
          Already have an account?{" "}
          <button onClick={switchToLogin}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;