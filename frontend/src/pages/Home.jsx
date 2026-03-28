import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Professional Unit Converter</h1>
            
            <p>Accurate measurement conversions for engineering, science, and everyday use. Convert between length, weight, temperature, volume, and area units with precision and ease.</p>

            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">precision_manufacturing</span>
                <span>High Precision</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">calculate</span>
                <span>Advanced Calculator</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">dark_mode</span>
                <span>Dark Mode</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">devices</span>
                <span>Responsive Design</span>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              <span className="btn-icon">calculate</span>
              Start Converting
            </Link>
            <Link to="/login" className="btn-secondary">
              <span className="btn-icon">login</span>
              Sign In
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="calculator-preview">
            <div className="preview-header">
              <span className="preview-title">Unit Converter</span>
            </div>
            <div className="preview-content">
              <div className="preview-input">
                <span className="input-label">Length</span>
                <div className="input-row">
                  <input type="number" placeholder="100" readOnly />
                  <select disabled>
                    <option>Meter</option>
                  </select>
                  <span className="arrow">→</span>
                  <input type="number" placeholder="328.08" readOnly />
                  <select disabled>
                    <option>Feet</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;