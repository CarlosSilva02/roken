import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">Roken</Link>
        <div className="nav-links">
          <Link to="/browse" className={isActive('/browse')}>🛒 Browse</Link>
          {currentUser && (
            <Link to="/mylistings" className={isActive('/mylistings')}>👤 My Listings</Link>
          )}
          {currentUser && (
            <Link to="/create-listing" className={isActive('/create-listing')}>➕ Sell</Link>
          )}
          {!currentUser && <Link to="/login" className={isActive('/login')}>Login</Link>}
          {!currentUser && <Link to="/register" className={isActive('/register')}>Register</Link>}
          {currentUser && (
            <button className="logout-btn" onClick={logout}>🚪 Logout</button>
          )}
        </div>
      </nav>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: #FF6600;
          font-family: sans-serif;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .nav-links a, .nav-links button {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border: none;
          background: none;
          color: white;
          font-weight: 500;
          text-decoration: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .nav-links a:hover, .nav-links button:hover {
          background-color: #f08137c9; /* lighter orange on hover */
        }
        .nav-links a.active {
          background-color: color: #FF6600; /* darker orange for active link */
        }
        .logout-btn {
          background-color: #FF6600; /* green button for logout */
          color: white;
        }
        .logout-btn:hover {
          background-color: #FF6600; /* slightly darker green */
        }
      `}</style>
    </>
  );
}
