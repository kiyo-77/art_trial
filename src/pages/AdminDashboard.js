
import React, { useEffect, useState } from 'react';
import { collection, getDocs,query,where } from 'firebase/firestore';
import { db, imageDb } from '../firebase/config';
import { ref, listAll } from 'firebase/storage';
import './AdminDashboard.css'; 
import SidebarAdmin from './SidebarAdmin';

// ... (your existing imports)

const Counter = () => {
  const [numArtists, setNumArtists] = useState(0);
  const [numArtworks, setNumArtworks] = useState(0);
  const [numOffers, setNumOffers] = useState(0); // New state for offers

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('role', '==', 'artist'));
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

    const fetchOffers = async () => {
      try {
        const offersCollection = collection(db, 'offers');
        const offerQuerySnapshot = await getDocs(offersCollection);
        animateCounter(setNumOffers, offerQuerySnapshot.size, 2000, 100);
      } catch (error) {
        console.error('Error fetching offers:', error.message);
      }
    };

    fetchArtists();
    fetchArtworks();
    fetchOffers();
  }, []); // Empty dependency array means this effect runs once on mount

  // ... (your existing animateCounter and return code)
  const animateCounter = (setter, targetValue, duration, interval) => {
    const increment = Math.ceil(targetValue / (duration / interval));
  
    let currentValue = 0;
  
    const updateCounter = () => {
      setter(currentValue);
  
      if (currentValue < targetValue) {
        currentValue += increment;
        setTimeout(updateCounter, interval);
      } else {
        setter(targetValue); 
      }
    };
  
    updateCounter();
  };
  
  
  return (
    <div>
      <SidebarAdmin />

      <div className="counter-container ms-5">
        <div className="counter-box artist-count">
        <p className="counter-label">Artists</p> 
        <i className="material-icons icon">brush</i>
          <span className="counter">{numArtists}</span>
         
        </div>
        <div className="counter-box artwork-count">
        <p className="counter-label">Artworks</p>
        <i className="material-icons icon">image</i>
          <span className="counter">{numArtworks}</span>
         
        </div>
        <div className="counter-box offer-count">
        <p className="counter-label">Offers</p>
          <i className="material-icons icon">local_offer</i>
          <span className="counter">{numOffers}</span>
          
        </div>
      </div>
    </div>
  );
};

export default Counter;
