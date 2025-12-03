import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

export default function MyListings() {
  const { currentUser } = useAuth();
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!currentUser) return;
      const snapshot = await getDocs(collection(db, 'listings'));
      const listings = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(l => l.owner === currentUser.email);
      setMyListings(listings);
    };
    fetchMyListings();
  }, [currentUser]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'listings', id));
    setMyListings(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="my-listings-page">
      <h2>My Listings</h2>
      {myListings.length === 0 && <p>You have no listings yet.</p>}
      <div className="listing-grid">
        {myListings.map(listing => (
          <div key={listing.id}>
            <ListingCard listing={listing} />
            <button onClick={() => handleDelete(listing.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
