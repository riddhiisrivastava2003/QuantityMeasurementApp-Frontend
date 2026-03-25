import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="eyebrow">Quantity Measurement Suite</p>
        <h1>Track material usage, cut waste, and keep teams aligned.</h1>
        <p className="lead">
          Centralize measurements for sites, rooms, and product batches in one
          place. Capture dimensions, auto-calc quantities, and export ready
          reports in minutes.
        </p>
        <div className="hero-actions">
          <Link className="primary" to="/dashboard">
            Create Project
          </Link>
          <Link className="ghost" to="/login">
            View Demo
          </Link>
        </div>
        <div className="hero-metrics">
          <div>
            <p className="metric-value">4.8x</p>
            <p className="metric-label">Faster estimates</p>
          </div>
          <div>
            <p className="metric-value">32%</p>
            <p className="metric-label">Average waste cut</p>
          </div>
          <div>
            <p className="metric-value">12k+</p>
            <p className="metric-label">Measurements stored</p>
          </div>
        </div>
      </div>
      <div className="hero-panel">
        <div className="hero-card">
          <p className="card-title">Project: Riverside Tower</p>
          <div className="card-row">
            <span>Area Measured</span>
            <strong>18,420 sq.ft</strong>
          </div>
          <div className="card-row">
            <span>Concrete Required</span>
            <strong>214.6 m³</strong>
          </div>
          <div className="card-row">
            <span>Steel Bars</span>
            <strong>9.2 tons</strong>
          </div>
          <div className="card-highlight">
            <p>Next review</p>
            <strong>March 27, 2026 • 10:30 AM</strong>
          </div>
        </div>
        <div className="hero-card accent">
          <p className="card-title">Quick Measurement</p>
          <div className="pill-grid">
            <span>Length</span>
            <span>Width</span>
            <span>Height</span>
            <span>Units</span>
          </div>
          <div className="progress">
            <div className="progress-bar"></div>
          </div>
          <p className="card-foot">Auto-fill from mobile capture</p>
        </div>
      </div>
    </section>
  )
}

export default Home
