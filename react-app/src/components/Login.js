// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://radiusironic-historyharlem-3000.codio-box.uk/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`, 
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.token); 
        sessionStorage.setItem("username", username); 

        const booksResponse = await fetch(
          "https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books",
          {
            headers: {
              Authorization: `Bearer ${data.token}`, 
            },
          }
        );

        const booksData = await booksResponse.json();

        onLogin({ username, token: data.token, books: booksData.data });
        navigate("/books");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-light-border dark:border-light-card rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 bg-transparent text-blue-500 rounded-md font-medium"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-500 hover:underline font-medium"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;