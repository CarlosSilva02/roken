import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase'; // import auth directly

// Create context
const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email & password
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        sendEmailVerification(userCredential.user);
        return userCredential;
      });

  // Login
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Logout
  const logout = () => signOut(auth);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

