// Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://radiusironic-historyharlem-3000.codio-box.uk/api/home/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! Please log in.");
        navigate("/login");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="w-full max-w-md bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 bg-transparent text-blue-500 rounded-md font-medium"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:underline font-medium"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;