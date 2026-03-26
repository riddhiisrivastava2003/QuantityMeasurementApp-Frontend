import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Quantity Measurement Suite</h1>
        <p>Track material usage and manage projects easily.</p>

        <div>
          <Link to="/dashboard" className="btn-primary">
            Create Project
          </Link>
          <Link to="/login" className="btn-secondary">
            View Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;