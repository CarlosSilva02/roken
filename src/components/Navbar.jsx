import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Roken</Link>
      <div className="nav-links">
        <Link to="/browse">Browse</Link>
        {currentUser && <Link to="/mylistings">My Listings</Link>}
	{currentUser && <Link to="/create-listing">+ Sell</Link>}
        {!currentUser && <Link to="/login">Login</Link>}
        {!currentUser && <Link to="/register">Register</Link>}
        {currentUser && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}
