//Browse.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('datePosted', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setListings(data);
      setLoading(false);
    });

    return unsubscribe; // cleanup listener
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading listings...</p>;
  if (!listings.length) return <p style={{ textAlign: 'center' }}>No listings found.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px' }}>
      {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
    </div>
  );
}
