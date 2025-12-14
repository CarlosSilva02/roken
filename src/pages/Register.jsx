import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    // Restrict to school emails
    if (!email.endsWith('@utrgv.edu')) {
      setMessage('Only UTRGV school emails are allowed!');
      return;
    }

    try {
      await signup(email, password);
      setMessage('Check your email to verify your account!');
      setEmail('');
      setPassword('');
      // Redirect to login page
      navigate('/login');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
