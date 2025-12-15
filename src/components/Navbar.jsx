import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaShoppingCart, 
  FaTools, 
  FaUser, 
  FaPlusCircle, 
  FaEnvelope, 
  FaSignInAlt, 
  FaUserPlus 
} from 'react-icons/fa';

export default function Navbar() {
  const { currentUser } = useAuth(); 
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">Roken</Link>
        <div className="nav-links">
          <Link to="/browse" className={isActive('/browse')}>
            <FaShoppingCart style={{ marginRight: '5px' }} /> Browse
          </Link>
          <Link to="/services" className={isActive('/services')}>
            <FaTools style={{ marginRight: '5px' }} /> Services
          </Link>
          {currentUser && (
            <Link to="/mylistings" className={isActive('/mylistings')}>
              <FaUser style={{ marginRight: '5px' }} /> My Listings
            </Link>
          )}
          {currentUser && (
            <Link to="/create-listing" className={isActive('/create-listing')}>
              <FaPlusCircle style={{ marginRight: '5px' }} /> Sell
            </Link>
          )}
          {currentUser && (
            <Link to="/messages" className={isActive('/messages')}>
              <FaEnvelope style={{ marginRight: '5px' }} /> Messages
            </Link>
          )}
          {!currentUser && (
            <Link to="/login" className={isActive('/login')}>
              <FaSignInAlt style={{ marginRight: '5px' }} /> Login
            </Link>
          )}
          {!currentUser && (
            <Link to="/register" className={isActive('/register')}>
              <FaUserPlus style={{ marginRight: '5px' }} /> Register
            </Link>
          )}
          {currentUser && (
            <Link to="/profile" className={isActive('/profile')}>
              <FaUser style={{ marginRight: '5px' }} /> Profile
            </Link>
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
          background-color: #f08137c9;
        }
        .nav-links a.active {
          background-color: #f08137c9;
        }
      `}</style>
    </>
  );
}
