import { Link } from 'react-router-dom'

function Signup() {
  return (
    <section className="auth">
      <div className="auth-copy">
        <h2>Create your account</h2>
        <p>
          Bring your team onboard in minutes. Start a new workspace and invite
          field crews to begin logging measurements right away.
        </p>
        <div className="auth-highlights">
          <p>Guided onboarding</p>
          <p>Unlimited projects</p>
          <p>Secure approvals</p>
        </div>
      </div>

      <div className="auth-grid">
        <form className="auth-card accent">
          <h3>Create account</h3>
          <label>
            Full name
            <input type="text" placeholder="Ayesha Khan" />
          </label>
          <label>
            Work email
            <input type="email" placeholder="ayesha@buildco.com" />
          </label>
          <label>
            Company
            <input type="text" placeholder="BuildCo Pvt Ltd" />
          </label>
          <button type="button" className="primary full dark">
            Get started
          </button>
          <p className="form-foot">
            Already have access? <Link to="/login">Sign in</Link>.
          </p>
        </form>
      </div>
    </section>
  )
}

export default Signup
