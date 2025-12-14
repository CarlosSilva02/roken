import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Restrict to UTRGV emails
    if (!email.endsWith('@utrgv.edu')) {
      setError('Only UTRGV school emails are allowed!');
      return;
    }

    try {
      const userCredential = await login(email, password);

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }

      
      setError('');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="School Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
