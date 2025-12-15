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
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = collection(db, 'conversations', id, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, [id, currentUser]);

  
  useEffect(() => {
    if (!currentUser) return;

    const convRef = doc(db, 'conversations', id);
    const unsub = onSnapshot(convRef, snapshot => {
      setConversation(snapshot.data());
    });

    return unsub;
  }, [id, currentUser]);

  
const sendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim() || !currentUser) return;

  const convRef = doc(db, 'conversations', id);
  const convSnap = await getDoc(convRef);

  if (!convSnap.exists()) {
    await setDoc(convRef, { updatedAt: serverTimestamp() }, { merge: true });
  }

  // 1️⃣ Add message to subcollection
  await addDoc(collection(db, 'conversations', id, 'messages'), {
    text: newMessage,
    senderId: currentUser.uid,
    senderEmail: currentUser.email,   // store email per message
    timestamp: serverTimestamp()
  });

  // 2️⃣ Update conversation doc with lastMessage info
  await setDoc(convRef, {
    lastMessage: newMessage,
    lastMessageEmail: currentUser.email,  // add this line
    updatedAt: serverTimestamp()
  }, { merge: true });

  setNewMessage('');
};


  
  const requestToBuy = async () => {
  if (!currentUser || !conversation) return;

  const price = prompt('Enter the price you want to offer:');
  if (!price || isNaN(price)) return;

  const convRef = doc(db, 'conversations', id);

  const messageText = `💰 Purchase request: $${price}`;

  await addDoc(collection(db, 'conversations', id, 'messages'), {
    text: messageText,
    senderId: currentUser.uid,
    senderEmail: currentUser.email,  // store email per message
    timestamp: serverTimestamp(),
    isRequest: true,
    status: 'pending',
    requestedPrice: parseFloat(price)
  });

  await setDoc(convRef, {
    lastMessage: messageText,
    lastMessageEmail: currentUser.email,  // add this line
    updatedAt: serverTimestamp()
  }, { merge: true });
};


  
  const handleRequestResponse = async (msgId, accept) => {
    await updateDoc(doc(db, 'conversations', id, 'messages', msgId), {
      status: accept ? 'accepted' : 'declined'
    });
  };

 
  const reportUser = async () => {
    if (!conversation || !currentUser) return;

    const confirmReport = window.confirm(
      "Report only if the user is using foul language, harassment, scams, or inappropriate behavior.\n\nFalse reports may result in account restrictions."
    );

    if (!confirmReport) return;

    const reason = prompt("Briefly explain the reason for reporting:");

    if (!reason || !reason.trim()) {
      alert("Report cancelled. A reason is required.");
      return;
    }

    await addDoc(collection(db, 'reports'), {
      conversationId: id,
      reportedBy: currentUser.uid,
      reportedByEmail: currentUser.email,
      sellerId: conversation.sellerId,
      buyerId: conversation.buyerId,
      listingId: conversation.listingId,
      reason,
      adminEmail: "roken.reports@gmail.com",
      createdAt: serverTimestamp()
    });

    alert("Report submitted. Our team will review it.");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div>
      <h2>Conversation: {conversation?.listingTitle}</h2>

      {}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {conversation && currentUser.uid !== conversation.sellerId && (
          <button
            onClick={requestToBuy}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00AAFF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Request to Buy
          </button>
        )}

        <button
          onClick={reportUser}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Report User
        </button>
      </div>

      {}
      <div style={{ maxHeight: '50vh', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderId === currentUser.uid ? 'right' : 'left',
              marginBottom: '10px'
            }}
          >
            <small>{msg.senderEmail}</small>
            <p style={{ fontWeight: msg.isRequest ? 'bold' : 'normal' }}>
              {msg.text}
            </p>

            {msg.isRequest && msg.status === 'pending' && currentUser.uid === conversation.sellerId && (
              <div>
                <button onClick={() => handleRequestResponse(msg.id, true)}>Accept</button>
                <button onClick={() => handleRequestResponse(msg.id, false)} style={{ marginLeft: '5px' }}>
                  Decline
                </button>
              </div>
            )}

            {msg.isRequest && msg.status && msg.status !== 'pending' && (
              <small>Status: {msg.status}</small>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {}
      <form onSubmit={sendMessage} style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Send</button>
      </form>
    </div>
  );
}
