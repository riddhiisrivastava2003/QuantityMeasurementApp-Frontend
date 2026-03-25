import { Link } from 'react-router-dom'

function Login() {
  return (
    <section className="auth">
      <div className="auth-copy">
        <h2>Welcome back</h2>
        <p>
          Sign in to access your live measurement dashboard, approve material
          requests, and keep field teams aligned.
        </p>
        <div className="auth-highlights">
          <p>Role-based access</p>
          <p>Measurement history</p>
          <p>Export to Excel/PDF</p>
        </div>
      </div>

      <div className="auth-grid">
        <form className="auth-card">
          <h3>Login</h3>
          <label>
            Email
            <input type="email" placeholder="team@site.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>
          <div className="form-row">
            <label className="checkbox">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="button" className="primary full">
            Sign in
          </button>
          <p className="form-foot">
            Need access? <Link to="/signup">Create an account</Link>.
          </p>
        </form>
      </div>
    </section>
  )
}

export default Login
