// /Browse.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

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

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('datePosted', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListings(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

 
  const filteredListings = selectedCategory
    ? listings.filter(listing => listing.category === selectedCategory)
    : listings;

  if (loading) return <p style={{ textAlign: 'center' }}>Loading listings...</p>;

  return (
    <div>
      {}
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px',
            width: '320px',
            maxWidth: '90%',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">Search for Categories</option>

          {groupedCategories.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {}
      {filteredListings.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No listings found.</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            padding: '20px'
          }}
        >
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
