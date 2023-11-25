import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, imageDb } from '../firebase/config';
import { ref, listAll, getMetadata } from 'firebase/storage';
import { auth } from '../firebase/config';
import SidebarArtist from './SidebarArtist';
import "./AdminDashboard.css";
const ArtistDashboard = () => {
  const [numArtworks, setNumArtworks] = useState(0);
  const [numOffers, setNumOffers] = useState(0);
  const [artistUsername, setArtistUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async (userId) => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData && userData.username) {
            setArtistUsername(userData.username);
          } else {
            console.error('Username property not found in user document.');
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchArtworks = async () => {
      try {
        const user = auth.currentUser;
        const userId = auth.currentUser.uid;
        await fetchUsername(userId);
    
        if (!user) {
         
          return;
        }
    
        const storageRef = ref(imageDb);
        const artworksSnapshot = await listAll(storageRef);
    
        const metadataPromises = artworksSnapshot.items.map(async (item) => {
          const metadata = await getMetadata(item);
          return { item, metadata };
        });
    
        const metadataArray = await Promise.all(metadataPromises);
    
        const userArtworks = metadataArray.filter(({ metadata }) => {
          return metadata.customMetadata.userId === userId;
        });
    
        setNumArtworks(userArtworks.length);
      } catch (error) {
        console.error('Error fetching artworks:', error.message);
      }
    };
    
    const fetchOffers = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          
          return;
        }

        const userId = user.uid;
        const userRef = collection(db, 'users');
        const userQuery = query(userRef, where('userId', '==', userId));
        const userSnapshot = await getDocs(userQuery);
        const artistUsername = userSnapshot.docs[0].data().username;

        const offersRef = collection(db, 'offers');
        const offersQuery = query(offersRef, where('artist', '==', artistUsername));
        const offersSnapshot = await getDocs(offersQuery);

        setNumOffers(offersSnapshot.size);
      } catch (error) {
        console.error('Error fetching offers:', error.message);
      }
    };

    fetchArtworks();
    fetchOffers();
  }, [artistUsername]); 

  return (
    <div>
      <SidebarArtist />

      <div className="counter-container">
        <div className="counter-box a-ar-count">
        <i className="material-icons icon">image</i>
          <span className="counter">{numArtworks}</span>
          <p className="counter-label">Artworks Uploaded</p>
        </div>
        <div className="counter-box a-of-count">
        <i className="material-icons icon">local_offer</i>
          <span className="counter">{numOffers}</span>
          <p className="counter-label">Offers Received</p>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;

