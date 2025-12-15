// src/pages/MyListings.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

export default function MyListings() {
  const { currentUser } = useAuth();
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, 'listings'),
          where('userId', '==', currentUser.uid),
          orderBy('datePosted', 'desc')
        );

        const snapshot = await getDocs(q);
        const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyListings(listings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchMyListings();
  }, [currentUser]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'listings', id));
      setMyListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>My Listings</h2>
      {myListings.length === 0 && <p>You have no listings yet.</p>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {myListings.map(listing => (
          <div 
            key={listing.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              boxSizing: 'border-box',
              backgroundColor: '#f9f9f9',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <ListingCard listing={listing} />

            <button
              onClick={() => handleDelete(listing.id)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
