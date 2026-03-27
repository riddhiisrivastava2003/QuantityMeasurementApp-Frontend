import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
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
          </nav>
        </header>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;