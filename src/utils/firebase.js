import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDOXqHx5kd-V5urjtb11aTm-Ob5F-wtfCg",
  authDomain: "roken-1f59b.firebaseapp.com",
  projectId: "roken-1f59b",
  storageBucket: "roken-1f59b.firebasestorage.app",
  messagingSenderId: "968879039628",
  appId: "1:968879039628:web:5aac815625b8eda332c7a9",
  measurementId: "G-QN4GHK83K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);