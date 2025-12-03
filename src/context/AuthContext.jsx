import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { app } from '../utils/firebase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const auth = getAuth(app);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        sendEmailVerification(userCredential.user);
        return userCredential;
      });

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => auth.signOut();

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

