import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth } from '../utils/firebase'; 

const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email & password only for  UTRGV students
  const signup = (email, password) => {
   
    if (!email.endsWith('@utrgv.edu')) {
      return Promise.reject(new Error('Only UTRGV school emails are allowed!'));
    }

    return createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        sendEmailVerification(userCredential.user);
        return userCredential;
      });
  };

 
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

 
  const logout = () => signOut(auth);


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
