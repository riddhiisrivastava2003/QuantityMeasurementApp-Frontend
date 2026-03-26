import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <span className="material-icons">login</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form">
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
                placeholder="Enter your password"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>

          <button type="submit" className="btn-primary auth-submit">
            <span className="btn-icon">login</span>
            Sign In
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-social">
          <button className="btn-social google">
            <span className="social-icon">G</span>
            Continue with Google
          </button>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;