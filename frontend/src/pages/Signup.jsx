import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit" className="btn-primary">
            Signup
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;