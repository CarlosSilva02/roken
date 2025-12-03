import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListingCard from './components/ListingCard';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import MyListings from './pages/MyListings';
import Login from './pages/login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/mylistings" element={<MyListings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
