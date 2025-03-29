// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BookList from "./components/BookList";
import Login from "./components/Login";
import Register from "./components/Register";
import './styles/tailwind.css';
import { Button } from "./components/ui/Button";
import { Switch } from "./components/ui/Switch";
import { Sun, Moon } from "lucide-react";

const App = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">BookLY</h1>
            <div className="flex items-center gap-3">
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="bg-light-card dark:bg-dark-card"
              />
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
          </div>

          {user ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Welcome, {user.username}!</h2>
                <Button
                  onClick={handleLogout}
                  className="border border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 bg-transparent text-red-500 px-4 py-2 rounded-md"
                >
                  Logout
                </Button>
              </div>
              <Routes>
                <Route path="/books" element={<BookList auth={user.auth} />} />
                <Route path="*" element={<Navigate to="/books" />} />
              </Routes>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
              <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;