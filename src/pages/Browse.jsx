import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'listings'), orderBy('datePosted', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched listings:", data); // check what is returned
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>Loading listings...</p>;
  if (!listings.length) return <p style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>No listings found.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px' }}>
      {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
    </div>
  );
}
