import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>

        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;