import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTools, FaBolt } from 'react-icons/fa';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  // Colors
  const UTB_Navy = '#00274C';
  const UTPA_Green = '#2E7D32'; // darker green for better visibility

  useEffect(() => {
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
      fontSize: '18px',
    },
    smallText: {
      color: '#555',
      fontStyle: 'italic',
      marginBottom: '30px',
    },
    cardsContainer: {
      display: 'flex',
      gap: '25px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    card: {
      background: 'linear-gradient(135deg, #fff, #f0f0f0)',
      padding: '25px 20px',
      borderRadius: '15px',
      width: '240px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
      textAlign: 'center',
      transition: 'transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease',
      cursor: 'pointer',
      color: '#333',
      opacity: 0,
      transform: 'translateY(20px)',
    },
    cardLoaded: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    iconWrapper: {
      position: 'relative',
      display: 'inline-block',
      fontSize: '45px',
      marginBottom: '15px',
      animation: 'float 3s ease-in-out infinite',
    },
    iconOutline: {
      position: 'absolute',
      top: 0,
      left: 0,
      color: UTB_Navy,
      zIndex: 0,
    },
    iconFill: {
      position: 'relative',
      color: UTPA_Green,
      zIndex: 1,
    },
    cardTitle: {
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '18px',
      background: 'linear-gradient(90deg, #FF6600, #FFAA33)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    cardDescription: {
      color: '#555',
      fontSize: '14px',
    },
  };

  const features = [
    { icon: FaCheckCircle, title: 'Safe & Verified Users', description: 'All users are verified to ensure a secure environment for services.' },
    { icon: FaTools, title: 'Easy-to-Offer Services', description: 'Quickly post and browse school-related services.' },
    { icon: FaBolt, title: 'Quick Posting', description: 'Post your services in seconds with our streamlined interface.' },
  ];

  return (
    <div style={styles.homePage}>
      <h1 style={styles.h1}>Welcome to Roken</h1>
      <p style={styles.p}>Offer, find, and exchange services with verified students.</p>
      <p style={styles.smallText}>Log in and verify email to start using Roken marketplace.</p>

      <div style={styles.cardsContainer}>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              style={{
                ...styles.card,
                ...(loaded ? styles.cardLoaded : {}),
                transitionDelay: `${index * 0.2}s`,
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 25px rgba(0,0,0,0.25)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
              }}
            >
              <div style={styles.iconWrapper}>
                <IconComponent style={styles.iconOutline} />
                <IconComponent style={styles.iconFill} />
              </div>
              <div style={styles.cardTitle}>{feature.title}</div>
              <div style={styles.cardDescription}>{feature.description}</div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
