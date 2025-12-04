// src/components/ListingCard.jsx
import React from 'react';

export default function ListingCard({ listing }) {
  return (
    <div className="listing-card">
      {listing.images && listing.images[0] && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="listing-image"
        />
      )}
      <div className="listing-info">
        <h3>{listing.title}</h3>
        <p className="price">${listing.price}</p>
        <p className="location">{listing.location}</p>
      </div>
    </div>
  );
}
