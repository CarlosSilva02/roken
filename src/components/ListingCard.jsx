import React from 'react';

export default function ListingCard({ listing }) {
  return (
    <div className="listing-card">
      <h3>{listing.title} - ${listing.price}</h3>
      <p><strong>Category:</strong> {listing.category}</p>
      <p>{listing.desc}</p>
      {listing.datePosted && <small>Posted: {new Date(listing.datePosted).toLocaleString()}</small>}
      {listing.imageUrl && <img src={listing.imageUrl} alt={listing.title} />}
    </div>
  );
}



