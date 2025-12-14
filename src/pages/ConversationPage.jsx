// src/pages/ConversationPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

export default function ConversationPage() {
  const { currentUser } = useAuth();
  const { id } = useParams(); // conversationId
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Load messages
  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = collection(db, 'conversations', id, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, [id, currentUser]);

  // Load conversation document
  useEffect(() => {
    if (!currentUser) return;

    const convRef = doc(db, 'conversations', id);
    const unsub = onSnapshot(convRef, snapshot => {
      setConversation(snapshot.data());
    });

    return unsub;
  }, [id, currentUser]);

  // Send normal chat message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const convRef = doc(db, 'conversations', id);
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) {
      await setDoc(convRef, { updatedAt: serverTimestamp() }, { merge: true });
    }

    await addDoc(collection(db, 'conversations', id, 'messages'), {
      text: newMessage,
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: serverTimestamp()
    });

    await setDoc(convRef, { lastMessage: newMessage, updatedAt: serverTimestamp() }, { merge: true });
    setNewMessage('');
  };

  // Request to buy (special message)
  const requestToBuy = async () => {
    if (!currentUser || !conversation) return;

    const price = prompt('Enter the price you want to offer:');
    if (!price || isNaN(price)) return;

    const convRef = doc(db, 'conversations', id);
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) {
      await setDoc(convRef, { updatedAt: serverTimestamp() }, { merge: true });
    }

    const messageText = `💰 Purchase request: $${price}`;

    // Save as a special message
    await addDoc(collection(db, 'conversations', id, 'messages'), {
      text: messageText,
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: serverTimestamp(),
      isRequest: true,
      status: 'pending',
      requestedPrice: parseFloat(price)
    });

    // Update last message
    await setDoc(convRef, { lastMessage: messageText, updatedAt: serverTimestamp() }, { merge: true });
  };

  // Seller accepts or declines a purchase request
  const handleRequestResponse = async (msgId, accept) => {
    await updateDoc(doc(db, 'conversations', id, 'messages', msgId), {
      status: accept ? 'accepted' : 'declined'
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div>
      <h2>Conversation: {conversation?.listingTitle}</h2>

      {/* Request to Buy button for buyers only */}
      {conversation && currentUser.uid !== conversation.sellerId && (
        <button
          onClick={requestToBuy}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00AAFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}
        >
          Request to Buy
        </button>
      )}

      {/* Messages */}
      <div style={{ maxHeight: '50vh', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', marginTop: '10px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ textAlign: msg.senderId === currentUser.uid ? 'right' : 'left', marginBottom: '8px' }}>
            <small>{msg.senderEmail}</small>
            <p style={{ fontWeight: msg.isRequest ? 'bold' : 'normal', color: msg.isRequest ? '#00AAFF' : '#000' }}>
              {msg.text}
            </p>

            {/* Seller: Accept/Decline buttons for pending request */}
            {msg.isRequest && msg.status === 'pending' && currentUser.uid === conversation.sellerId && (
              <div>
                <button onClick={() => handleRequestResponse(msg.id, true)} style={{ marginRight: '5px' }}>Accept</button>
                <button onClick={() => handleRequestResponse(msg.id, false)}>Decline</button>
              </div>
            )}

            {/* Show status */}
            {msg.isRequest && msg.status && msg.status !== 'pending' && (
              <small>Status: {msg.status}</small>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <form onSubmit={sendMessage} style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#FF6600', color: 'white', border: 'none', borderRadius: '5px' }}>Send</button>
      </form>
    </div>
  );
}
