import React, { useEffect, useState } from 'react';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setLoaded(true);
  }, []);

  const styles = {
    homePage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px',
      backgroundColor: '#f8f8f8',
      color: '#333',
      minHeight: '100vh',
    },
    h1: {
      color: '#FF6600',
      marginBottom: '10px',
    },
    p: {
      color: '#333',
      marginBottom: '10px',
    },
    smallText: {
      color: '#555',
      fontStyle: 'italic',
      marginBottom: '30px',
    },
    cardsContainer: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      width: '220px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s, opacity 0.3s',
      cursor: 'pointer',
      color: '#333',
      opacity: 0,
      transform: 'translateY(20px)',
    },
    cardLoaded: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    icon: {
      fontSize: '40px',
      marginBottom: '15px',
      color: '#FF6600',
      animation: 'float 3s ease-in-out infinite alternate',
    },
    cardTitle: {
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    cardDescription: {
      color: '#555',
      fontSize: '14px',
    },
  };

  const features = [
    {
      icon: '✅',
      title: 'Safe & Verified Users',
      description: 'All users are verified to ensure a secure trading environment.',
    },
    {
      icon: '📚',
      title: 'Easy-to-Trade Items',
      description: 'Quickly post and browse school-related items.',
    },
    {
      icon: '⚡',
      title: 'Quick Posting',
      description: 'Post your items in seconds with our streamlined interface.',
    },
  ];

  return (
    <div style={styles.homePage}>
      <h1 style={styles.h1}>Welcome to Roken</h1>
      <p style={styles.p}>Buy, sell, and trade items with verified students.</p>
      <p style={styles.smallText}>
        Log in and verify email to start using Roken marketplace.
      </p>

      <div style={styles.cardsContainer}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              ...(loaded ? styles.cardLoaded : {}),
              transitionDelay: `${index * 0.2}s`, // stagger animation
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.icon}>{feature.icon}</div>
            <div style={styles.cardTitle}>{feature.title}</div>
            <div style={styles.cardDescription}>{feature.description}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

