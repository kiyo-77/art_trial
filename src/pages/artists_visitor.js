
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, imageDb } from '../firebase/config';
import { ref, getDownloadURL, getMetadata, listAll } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Artist_Visitor.css';

function ArtistsList() {
  const [artists, setArtists] = useState([]);
  const [artistWorks, setArtistWorks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);

        const artistList = [];
        const worksMap = {};

        await Promise.all(usersSnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          if (userData && userData.username) {
            artistList.push(userData.username);

          
            const storageRef = ref(imageDb);
            const imagesList = await listAll(storageRef);

            const artistImage = imagesList.items.find(item => {
              const itemMetadata = item.metadata;
              return itemMetadata && itemMetadata.customMetadata && itemMetadata.customMetadata.username === userData.username;
            });

            if (artistImage) {
              const workUrl = await getDownloadURL(artistImage);
              const workMetadata = await getMetadata(artistImage);
              
              if (workMetadata && workMetadata.customMetadata) {
                worksMap[userData.username] = { url: workUrl, metadata: workMetadata };
              }
            }
          }
        }));

        setArtists(artistList);
        setArtistWorks(worksMap);
      } catch (error) {
        console.error('Error fetching artists:', error.message);
      }
    };

    fetchArtists();
  }, []);

  const handleArtistClick = (artistName) => {
    navigate(`/artist/${artistName}`);
  };

  return (
    <div>
      <Header />
      <div className='artist-list-content'>
        <h2 className='a-vis-hl'>Meet the Masters Behind the Canvas</h2>
        <div >
        <ul className="artist-list">
          {artists.map((artist, index) => (
            <li key={index} className="categoryWrapper" onClick={() => handleArtistClick(artist)}>
              
                <p className="artist-name">{artist}</p>
                {artistWorks[artist] && (
                  <img src={artistWorks[artist].url} alt={`${artist}'s Work`} className="artist-work" />
                )}
                 <button>
      <span>
        <span>
          <span data-attr-span="See Works">
            See Works
          </span>
        </span>
      </span>
    </button>
              
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}

export default ArtistsList;

