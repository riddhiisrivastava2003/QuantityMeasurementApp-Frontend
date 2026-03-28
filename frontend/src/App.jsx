import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    return savedTheme;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Apply initial theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const loginUser = () => {
    // Just for navigation, no state tracking
  };

  return (
    <BrowserRouter>
      <div className="app">
        
        {/* HEADER */}
        <header className="topbar">
          <div className="navbar-brand">
            <h2>Quantity Measurement</h2>
          </div>

          <nav className="navbar-menu">
            <Link to="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              Home
            </Link>
            <Link to="/login" className="nav-link">
              <span className="nav-icon">🔐</span>
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              <span className="nav-icon">✍️</span>
              Signup
            </Link>
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
            <button onClick={toggleTheme} className="theme-toggle">
              <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
          </nav>
        </header>



        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={loginUser} />} />
          <Route path="/signup" element={<Signup onLogin={loginUser} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;