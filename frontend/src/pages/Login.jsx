// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';


function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login - in real app, validate credentials
    onLogin();
    navigate('/dashboard');
  };

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

        <form className="auth-form" onSubmit={handleSubmit}>
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

        

       {/* ✅ GOOGLE LOGIN */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decoded = jwtDecode(credentialResponse.credential);

              console.log("User:", decoded);

              // optional: store user
              localStorage.setItem("user", JSON.stringify(decoded));

              onLogin();
              navigate('/dashboard');
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
// import { Link, useNavigate } from 'react-router-dom';

// function Login({ onLogin }) {
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onLogin();
//     navigate('/dashboard');
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
        
//         <div className="auth-header">
//           <h2>Welcome Back</h2>
//           <p>Sign in to your account to continue</p>
//         </div>

//         {/* NORMAL LOGIN */}
//         <form className="auth-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Email Address</label>
//             <input type="email" placeholder="Enter your email" required />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input type="password" placeholder="Enter your password" required />
//           </div>

//           <button type="submit">Sign In</button>
//         </form>

//         <div className="auth-divider">
//           <span>or</span>
//         </div>

//         {/* ✅ GOOGLE LOGIN */}
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <GoogleLogin
//             onSuccess={(credentialResponse) => {
//               const decoded = jwtDecode(credentialResponse.credential);

//               console.log("User:", decoded);

//               // optional: store user
//               localStorage.setItem("user", JSON.stringify(decoded));

//               onLogin();
//               navigate('/dashboard');
//             }}
//             onError={() => {
//               console.log('Login Failed');
//             }}
//           />
//         </div>

//         <div className="auth-footer">
//           <p>
//             Don't have an account?{" "}
//             <Link to="/signup">Create one</Link>
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;