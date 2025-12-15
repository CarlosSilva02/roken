import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export default function CreateService() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...newFiles]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in.");

    setLoading(true);
    try {
      const imageUrls = [];
      for (const image of images) {
        const storageRef = ref(storage, `services/${currentUser.uid}/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      await addDoc(collection(db, 'listings'), {
        title,
        description,
        price,
        category,
        location,
        type: "service", // mark as service
        images: imageUrls, // optional
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email,
        datePosted: serverTimestamp(),
        isPublic: true
      });

      alert("Service created successfully!");
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setLocation('');
      setImages([]);
      navigate('/browse');
    } catch (error) {
      alert("Failed to create service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const serviceCategories = [
    "Tutoring",
    "Resume & Portfolio Help",
    "Interview Coaching",
    "Essay & Paper Review",
    "Car Wash"
  ];

  const locationOptions = ["University in Edinburg", "University in Brownsville"];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Create Service</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Service Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', color: '#333', fontSize: '14px' }}
        >
          <option value="" disabled>Select Category</option>
          {serviceCategories.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
        </select>

        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', color: '#333', fontSize: '14px' }}
        >
          <option value="" disabled>Select Location</option>
          {locationOptions.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
        </select>

        {/* Image Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageAdd}
          hidden
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          style={{ padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#f5f5f5', cursor: 'pointer' }}
        >
          + Add Image (optional)
        </button>

        <p>Images added: {images.length}</p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#FF6600', color: 'white', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? "Posting..." : "Post Service"}
        </button>
      </form>
    </div>
  );
}
