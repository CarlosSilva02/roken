// src/pages/MessagesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'conversations'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allConversations = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (conv) =>
            conv.buyerId === currentUser.uid || conv.sellerId === currentUser.uid
        );
      setConversations(allConversations);
    });

    return unsubscribe;
  }, [currentUser]);

  if (!currentUser) return <p>Please log in to see messages.</p>;

  return (
    <div>
      <h2>Messages</h2>
      {conversations.length === 0 && <p>No conversations yet.</p>}
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          to={`/conversation/${conv.id}`}
          style={{
            display: 'block',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '8px',
            textDecoration: 'none',
            color: 'black',
          }}
        >
          <strong>{conv.listingTitle}</strong>
          <p>{conv.lastMessage}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            From: {conv.lastMessageEmail || 'Unknown'} |{' '}
            {conv.lastMessageTime
              ? new Date(conv.lastMessageTime.seconds * 1000).toLocaleString()
              : ''}
          </p>
        </Link>
      ))}
    </div>
  );
}

