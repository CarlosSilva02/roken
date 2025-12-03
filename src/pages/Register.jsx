import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signup } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signup(email, password);
      setMessage('Check your email to verify your account!');
      setEmail('');
      setPassword('');
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
          placeholder="Email"
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
