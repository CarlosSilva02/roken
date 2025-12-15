import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listingType, setListingType] = useState('item'); // new field

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
    if (images.length === 0) return alert("Please add at least one image.");

    setLoading(true);
    try {
      const imageUrls = [];
      for (const image of images) {
        const storageRef = ref(storage, `listings/${currentUser.uid}/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      const listingData = {
        title,
        description,
        price,
        category,
        location,
        images: imageUrls,
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email,
        datePosted: serverTimestamp(),
        isPublic: true,
        type: listingType // save type
      };

      // Only include condition if listing is an item
      if (listingType === 'item') listingData.condition = condition;

      await addDoc(collection(db, 'listings'), listingData);

      alert("Listing created successfully!");
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setCondition('');
      setLocation('');
      setImages([]);
      setListingType('item');
      navigate('/browse');
    } catch (error) {
      alert("Failed to create listing: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const groupedCategories = [
    { label: "Academic Supplies", options: ["Textbooks (new & used)","Notebooks, binders, folders","Stationery (pens, pencils, markers)","Lab equipment / calculators","Art supplies"] },
    { label: "Electronics & Tech", options: ["Laptops / tablets / chargers","Headphones / earbuds","Smartwatches / fitness trackers","Software / apps licenses"] },
    { label: "Clothing & Apparel", options: ["Sportswear / team jerseys","Shoes / sneakers","Jackets / hoodies"] },
    { label: "Dorm & Room Essentials", options: ["Bedding / pillows / blankets","Desks / chairs / lamps","Storage organizers / shelves","Kitchen gadgets for dorms"] },
    { label: "Sports & Fitness", options: ["Balls, rackets, and other gear","Gym equipment / yoga mats","Bicycles / scooters / skateboards"] },
    { label: "Hobbies & Entertainment", options: ["Board games / puzzles","Musical instruments / sheet music","Books / comics / manga","Video games / consoles"] },
    { label: "Transportation", options: ["Bicycles / skateboards / scooters"] },
    { label: "Miscellaneous / Free Items", options: ["Freebies / giveaways","Lost & found","Swap/trade items","Other"] }
  ];

  const conditionOptions = ["New", "Like New", "Good", "Fair"];
  const locationOptions = ["University in Edinburg", "University in Brownsville"];

  return (
    <div className="create-listing-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit}>

        {/* Listing Type Selector */}
        <select value={listingType} onChange={e => setListingType(e.target.value)} required style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', color: '#333', fontSize: '14px' }}>
          <option value="item">Item</option>
          <option value="service">Service</option>
        </select>

        <input
          type="text"
          placeholder="Title"
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

        <select value={category} onChange={e => setCategory(e.target.value)} required style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', color: '#333', fontSize: '14px' }}>
          <option value="" disabled>Select Category</option>
          {groupedCategories.map((group, idx) => (
            <optgroup key={idx} label={group.label}>
              {group.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </optgroup>
          ))}
        </select>

        {/* Condition: Only show for items */}
        {listingType === 'item' && (
          <select value={condition} onChange={e => setCondition(e.target.value)} required style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', color: '#333', fontSize: '14px' }}>
            <option value="" disabled>Select Condition</option>
            {conditionOptions.map((cond, idx) => <option key={idx} value={cond}>{cond}</option>)}
          </select>
        )}

        <select value={location} onChange={e => setLocation(e.target.value)} required style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', color: '#333', fontSize: '14px' }}>
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
        <button type="button" onClick={() => fileInputRef.current.click()} style={{ padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
          + Add Image
        </button>

        <p>Images added: {images.length}</p>

        {/* Image Previews */}
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
              <button type="button" onClick={() => removeImage(idx)} style={{
                position: 'absolute', top: '2px', right: '2px',
                background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
                borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px'
              }}>×</button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#FF6600', color: 'white', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}
