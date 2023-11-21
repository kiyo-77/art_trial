
import React, { useEffect, useState } from 'react';
import { collection, getDocs,query,where } from 'firebase/firestore';
import { db, imageDb } from '../firebase/config';
import { ref, listAll } from 'firebase/storage';
import './AdminDashboard.css'; // Import your CSS file
import SidebarAdmin from './SidebarAdmin';

const Counter = () => {
  const [numArtists, setNumArtists] = useState(0);
  const [numArtworks, setNumArtworks] = useState(0);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('role', '==', 'artist')); // create a query
        const querySnapshot = await getDocs(q);
        animateCounter(setNumArtists, querySnapshot.size, 2000, 100);
      } catch (error) {
        console.error('Error fetching artists:', error.message);
      }
    };
  
    const fetchArtworks = async () => {
      try {
        const storageRef = ref(imageDb);
        const allImages = await listAll(storageRef);
        animateCounter(setNumArtworks, allImages.items.length, 2000, 100);
      } catch (error) {
        console.error('Error fetching artworks:', error.message);
      }
    };
  
    fetchArtists();
    fetchArtworks();
  }, []); // Ensure that the dependency array is closed properly
  

  const animateCounter = (setter, targetValue, duration, interval) => {
    const increment = Math.ceil(targetValue / (duration / interval));
  
    let currentValue = 0;
  
    const updateCounter = () => {
      setter(currentValue);
  
      if (currentValue < targetValue) {
        currentValue += increment;
        setTimeout(updateCounter, interval);
      } else {
        setter(targetValue); // Ensure the final value is exact
      }
    };
  
    updateCounter();
  };
  
  
  return (
    <div>
    <SidebarAdmin/>
    
    <div className="counter-container">
      <div className="counter-box">
        <span className="counter">{numArtists}</span>
        <p className="counter-label">Artists</p>
      </div>
      <div className="counter-box">
        <span className="counter">{numArtworks}</span>
        <p className="counter-label">Artworks</p>
      </div>
    </div>
    </div>
  );
};

export default Counter;
