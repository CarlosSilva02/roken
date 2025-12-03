import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOXqHx5kd-V5urjtb11aTm-Ob5F-wtfCg",
  authDomain: "roken-1f59b.firebaseapp.com",
  projectId: "roken-1f59b",
  storageBucket: "roken-1f59b.firebasestorage.app",
  messagingSenderId: "968879039628",
  appId: "1:968879039628:web:5aac815625b8eda332c7a9",
  measurementId: "G-QN4GHK83K9"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
