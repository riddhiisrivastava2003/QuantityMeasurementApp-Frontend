import { Link, useNavigate } from 'react-router-dom';

function Signup({ onLogin }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup - in real app, create account
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <span className="material-icons">person_add</span>
          </div>
          <h2>Create Account</h2>
          <p>Join us to start converting units professionally</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">person</span>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">email</span>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">lock</span>
              <input
                type="password"
                placeholder="Create a password"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">lock</span>
              <input
                type="password"
                placeholder="Confirm your password"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button type="submit" className="btn-primary auth-submit">
            <span className="btn-icon">person_add</span>
            Create Account
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-social">
          <button className="btn-social google">
            <span className="social-icon">G</span>
            Sign up with Google
          </button>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;