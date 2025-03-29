import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BookList from "./components/BookList";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const [user, setUser] = useState(null); // Track logged-in user

  // Load user data from sessionStorage when the app starts
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("auth");
    const storedUsername = sessionStorage.getItem("username");

    if (storedAuth && storedUsername) {
      setUser({ username: storedUsername, auth: storedAuth });
    }
  }, []);

  const handleLogin = (userData) => {
    sessionStorage.setItem("auth", userData.auth);
    sessionStorage.setItem("username", userData.username);
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("username");
    setUser(null);
  };

  return (
    <Router>
      <div>
        <h1>BookLY</h1>
        
        {user ? (
          <>
            <h2>Welcome, {user.username}!</h2>
            <button onClick={handleLogout}>Logout</button>
            <Routes>
              <Route path="/books" element={<BookList auth={user.auth} />} />
              <Route path="*" element={<Navigate to="/books" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
