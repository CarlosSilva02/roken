import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
    console.log("Images selected:", Array.from(e.target.files).map(f => f.name));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to post a listing.");
      return;
    }

    setLoading(true);

    try {
      // Upload images to Firebase Storage
      const imageUrls = [];
      for (const image of images) {
        const storageRef = ref(storage, `listings/${currentUser.uid}/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytesResumable(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
        console.log("Uploaded image URL:", downloadURL);
      }

      // Add listing to Firestore
      const docRef = await addDoc(collection(db, 'listings'), {
        title,
        description,
        price,
        category,
        condition,
        location,
        images: imageUrls,
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email,
        datePosted: serverTimestamp(),
        isPublic: true
      });

      console.log("Listing created with ID:", docRef.id);
      alert("Listing created successfully!");
      navigate('/browse');
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Condition"
          value={condition}
          onChange={e => setCondition(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}
