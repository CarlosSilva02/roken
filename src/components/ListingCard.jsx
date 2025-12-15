// src/components/ListingCard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const formattedDate = (() => {
    const ts = listing.datePosted;
    if (!ts) return "Unknown date";
    if (ts.seconds !== undefined) return new Date(ts.seconds * 1000).toLocaleDateString();
    if (ts._seconds !== undefined) return new Date(ts._seconds * 1000).toLocaleDateString();
    if (ts.toDate) return ts.toDate().toLocaleDateString();
    return "Unknown date";
  })();

  const handleRequestToBuy = async () => {
    if (!currentUser) {
      alert("Please log in to request a purchase.");
      return;
    }
    if (listing.sold) {
      alert("This listing is sold!");
      return;
    }

    const conversationId = [listing.id, currentUser.uid, listing.userId].sort().join('_');
    const conversationRef = doc(db, 'conversations', conversationId);

    await setDoc(
      conversationRef,
      {
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.images?.[0] || '',
        sellerId: listing.userId,
        buyerId: currentUser.uid,
        lastMessage: `💰 Purchase request sent!`,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    navigate(`/conversation/${conversationId}`);
  };

  const markAsSold = async () => {
    if (!currentUser || currentUser.uid !== listing.userId) return;
    const listingRef = doc(db, 'listings', listing.id);
    await setDoc(listingRef, { sold: true }, { merge: true });
    alert("Marked as SOLD!");
  };

  // New function to revert / unsell
  const revertSale = async () => {
    if (!currentUser || currentUser.uid !== listing.userId) return;
    const listingRef = doc(db, 'listings', listing.id);
    await setDoc(listingRef, { sold: false }, { merge: true });
    alert("Listing is now available again!");
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      width: '250px',
      margin: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
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
      <p style={{fontSize: '18px', fontWeight: 'bold', color: '#FF6600'}}>${listing.price || "0"}</p>
      <p>Category: {listing.category || "N/A"}</p>
      {listing.type !== "service" && <p>Condition: {listing.condition || "N/A"}</p>}
      <p>Location: {listing.location || "N/A"}</p>
      <p style={{fontSize: '12px', color: '#666'}}>Posted on: {formattedDate}</p>

      {/* Show SOLD badge if sold */}
      {listing.sold && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#FF4444',
          color: 'white',
          padding: '5px 8px',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>SOLD</div>
      )}

      {/* Request to Buy Button */}
      {currentUser && !listing.sold && listing.userId !== currentUser.uid && (
        <button
          onClick={handleRequestToBuy}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#00AAFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          Request to Buy
        </button>
      )}

      {}
      {currentUser && listing.userId === currentUser.uid && !listing.sold && (
        <button
          onClick={markAsSold}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#FF6600',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          Mark as Sold
        </button>
      )}

      {}
      {currentUser && listing.userId === currentUser.uid && listing.sold && (
        <button
          onClick={revertSale}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#FF3300',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          Revert / Unsell
        </button>
      )}
    </div>
  );
}
