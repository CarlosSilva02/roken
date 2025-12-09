import React from 'react';

export default function ListingCard({ listing }) {
  const formattedDate = (() => {
  const ts = listing.datePosted;

  if (!ts) return "Unknown date";

  
  if (ts.seconds !== undefined) {
    return new Date(ts.seconds * 1000).toLocaleDateString();
  }

  
  if (ts._seconds !== undefined) {
    return new Date(ts._seconds * 1000).toLocaleDateString();
  }


  if (ts.toDate && typeof ts.toDate === 'function') {
    return ts.toDate().toLocaleDateString();
  }

  return "Unknown date";
})();

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      width: '250px',
      margin: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Image Gallery */}
      {listing.images?.length > 0 ? (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '5px', marginBottom: '8px' }}>
          {listing.images.map((img, idx) => (
            <img key={idx} src={img} alt={`${listing.title} ${idx}`} 
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
          ))}
        </div>
      ) : (
        <div style={{ width: '100%', height: '150px', background: '#eee', borderRadius: '6px', marginBottom: '8px' }}>No Image</div>
      )}

      <h3>{listing.title || "No Title"}</h3>
      <p>Price: ${listing.price || "0"}</p>
      <p>Category: {listing.category || "N/A"}</p>
      <p>Condition: {listing.condition || "N/A"}</p>
      <p>Location: {listing.location || "N/A"}</p>
      <p>Posted on: {formattedDate}</p>
    </div>
  );
}