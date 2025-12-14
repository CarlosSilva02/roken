import React from 'react';
import CreateListing from "./pages/CreateListing";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Login from './pages/login';
import Register from './pages/Register';
import MyListings from './pages/MyListings';
import MessagesPage from './pages/MessagesPage';
import ConversationPage from './pages/ConversationPage';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/mylistings" element={<MyListings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/conversation/:id" element={<ConversationPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
