import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch("https://radiusironic-historyharlem-3000.codio-box.uk/api/home/private", {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("auth", credentials);

      // Fetch only books that the user has added
      const booksResponse = await fetch(
        "https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books",
        { headers: { Authorization: `Basic ${credentials}` } }
      );

      const booksData = await booksResponse.json();

      onLogin({ username, auth: credentials, books: booksData.data });

      navigate("/books");
    } else {
      setError("Invalid username or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    setError("Something went wrong. Try again.");
  }
};

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <button onClick={() => navigate("/register")}>Register</button></p>
    </div>
  );
};

export default Login;
