import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Mail } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const result = await login(phone);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Failed to login');
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const result = await login('google_user@gmail.com');
    if (result.success) {
      navigate('/');
    } else {
      setError('Google Login Failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container page-container">
      <div className="login-header">
        <img src="/logo.png" alt="ViewCash Logo" className="logo-image" />
        <h2>Welcome to ViewCash</h2>
        <p>Login to start earning rewards</p>
      </div>

      <div className="login-card">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <Phone size={20} className="input-icon" />
            <input 
              type="tel" 
              placeholder="Enter Phone Number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending OTP...' : 'Login with OTP'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="btn-outline"
          disabled={isSubmitting}
        >
          <Mail size={20} />
          Continue with Google
        </button>
      </div>

      <div className="security-notice">
        <p>🔒 Secure Login</p>
        <small>One account per device policy is enforced to ensure fair rewards.</small>
      </div>
    </div>
  );
};

export default Login;
