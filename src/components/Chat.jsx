// src/components/Chat.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Chat({ listing, onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

 
  const conversationId = [listing.id, currentUser.uid, listing.userId].sort().join('_');

  const requestToBuy = async () => {
    const price = prompt('Enter the price you want to offer:');
    if (!price || isNaN(price)) return;

    const convRef = doc(db, 'conversations', conversationId);

    // Create conversation document if it doesn't exist
    await setDoc(
      convRef,
      {
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.images?.[0] || '',
        sellerId: listing.userId,
        buyerId: currentUser.uid,
        lastMessage: `💰 Purchase request: $${price}`,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    // Add purchase request message
    const msgRef = doc(collection(db, 'conversations', conversationId, 'messages'));
    await setDoc(msgRef, {
      text: `💰 Purchase request: $${price}`,
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: serverTimestamp(),
      isRequest: true,
      status: 'pending',
      requestedPrice: parseFloat(price)
    });

    navigate(`/conversation/${conversationId}`);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          width: '90%',
          maxWidth: '400px',
          borderRadius: '12px',
          padding: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Request to buy "{listing.title}"</h3>
        <button
          onClick={requestToBuy}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#00AAFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Request to Buy
        </button>
      </div>
    </div>
  );
}