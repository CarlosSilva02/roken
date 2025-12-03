import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

export default function Browse() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const snapshot = await getDocs(collection(db, 'listings'));
      const allListings = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(l => l.isPublic);
      setListings(allListings.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)));
    };
    fetchListings();
  }, []);

  return (
    <div className="browse-page">
      <h2>Browse Listings</h2>
      <div className="listing-grid">
        {listings.length === 0 ? <p>No public listings yet.</p> : listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
