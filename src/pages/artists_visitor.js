import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { imageDb, db } from '../firebase/config';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Artists_Visitor() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistWorks, setArtistWorks] = useState([]);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);

        const artistList = [];
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData && userData.username) {
            artistList.push(userData.username);
          }
        });

        setArtists(artistList);
      } catch (error) {
        console.error('Error fetching artists:', error.message);
      }
    };

    fetchArtists();
  }, []);

  const fetchArtistWorks = async (artistName) => {
    try {
      const storageRef = ref(imageDb);
      const allImages = await listAll(storageRef);

      const artistWorksData = await Promise.all(
        allImages.items.map(async (item) => {
          const metadata = await getMetadata(item);

          if (metadata.customMetadata && metadata.customMetadata.username === artistName) {
            const url = await getDownloadURL(item);
            return { url, metadata };
          } else {
            return null;
          }
        })
      );

      setArtistWorks(artistWorksData.filter(Boolean));
    } catch (error) {
      console.error('Error fetching artist works:', error.message);
    }
  };

  const handleArtistClick = (artistName) => {
    setSelectedArtist(artistName);

    // Navigate to a different page with the selected artist's name as a route parameter
    navigate(`/artist/${artistName}`);
  };

  return (
    <div>
      <h1>Artists Page</h1>
      <div>
        <h2>Artists</h2>
        <ul>
          {artists.map((artist, index) => (
            <li key={index} onClick={() => handleArtistClick(artist)}>
              {artist}
            </li>
          ))}
        </ul>
      </div>
      {selectedArtist && (
        <div>
          <h2>Works by {selectedArtist}</h2>
          <div>
            {artistWorks.map((work, index) => (
              <div key={index}>
                <img src={work.url} alt={`Work ${index}`} />
                <p>Genre: {work.metadata.customMetadata.genre}</p>
                <p>Price: {work.metadata.customMetadata.price}</p>
                {/* Add other metadata fields as needed */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Artists_Visitor;

