import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="968262434430-djf3e6m7m1d3hefugubiaa9pklspdgil.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);


