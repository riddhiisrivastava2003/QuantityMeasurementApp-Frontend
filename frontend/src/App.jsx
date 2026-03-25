import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">Q</span>
            <div>
              <p className="brand-name">QuantityMeasure</p>
              <p className="brand-tag">Precision for every project</p>
            </div>
          </div>
          <nav className="nav">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
          <Link className="cta" to="/signup">
            Start Measuring
          </Link>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Built for project teams who care about accuracy.</p>
          <div>
            <button className="ghost">Privacy</button>
            <button className="ghost">Support</button>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
