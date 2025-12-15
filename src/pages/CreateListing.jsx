import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in.");

    setLoading(true);

    try {
      const imageUrls = [];
      for (const image of images) {
        const storageRef = ref(storage, `listings/${currentUser.uid}/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytesResumable(storageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      await addDoc(collection(db, 'listings'), {
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

      alert("Listing created successfully!");
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setCondition('');
      setLocation('');
      setImages([]);
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
    { label: "Services", options: ["Tutoring","Study guides / notes"] },
    { label: "Miscellaneous / Free Items", options: ["Freebies / giveaways","Lost & found","Swap/trade items","Other"] }
  ];

  const conditionOptions = ["New", "Like New", "Good", "Fair"];
  const locationOptions = ["University in Edinburg", "University in Brownsville"];

  return (
    <div className="create-listing-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }} />

        <select value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="" disabled>Select Category</option>
          {groupedCategories.map((group, idx) => (
            <optgroup key={idx} label={group.label}>
              {group.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </optgroup>
          ))}
        </select>

        <select value={condition} onChange={e => setCondition(e.target.value)} required>
          <option value="" disabled>Select Condition</option>
          {conditionOptions.map((cond, idx) => <option key={idx} value={cond}>{cond}</option>)}
        </select>

        <select value={location} onChange={e => setLocation(e.target.value)} required>
          <option value="" disabled>Select Location</option>
          {locationOptions.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
        </select>

        <input type="file" multiple onChange={handleImageChange} required style={{ margin: '8px 0' }} />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#FF6600', color: 'white', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>

      <style>{`
        select {
          width: 100%;
          padding: 10px;
          margin: 8px 0;
          border-radius: 6px;
          border: 1px solid #ccc;
          background-color: white;
          color: #333;
          font-size: 14px;
        }
        select:focus {
          border-color: #FF6600;
          outline: none;
        }
      `}</style>
    </div>
  );
}
