// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../utils/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user info from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const fetchUser = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setDisplayName(data.displayName || currentUser.displayName || '');
        setProfilePic(data.photoURL || '');
      }
    };
    fetchUser();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert("Failed to log out: " + error.message);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      let photoURL = profilePic;

      // Upload new profile picture if selected
      if (newProfilePic) {
        const storageRef = ref(storage, `profilePics/${currentUser.uid}/${Date.now()}-${newProfilePic.name}`);
        const snapshot = await uploadBytes(storageRef, newProfilePic);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // Update Firestore user doc
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName,
        photoURL,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert('Profile updated successfully!');
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
      setNewProfilePic(null);
    }
  };

  if (!currentUser) return <p>Please log in to see your profile.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Profile</h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={profilePic || '/default-profile.png'}
            alt="Profile"
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF6600' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#FF6600',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            title="Change Picture"
          >
            ✎
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleProfilePicChange}
          hidden
        />
      </div>

      <label style={{ fontWeight: 'bold' }}>Name</label>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Your name"
        style={{
          width: '100%',
          padding: '10px',
          margin: '8px 0',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />

      <label style={{ fontWeight: 'bold' }}>Email</label>
      <input
        type="text"
        value={currentUser.email}
        readOnly
        style={{
          width: '100%',
          padding: '10px',
          margin: '8px 0',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: '#f5f5f5'
        }}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '15px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#FF6600',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>

      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#FF4444',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}
