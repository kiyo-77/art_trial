
import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { imageDb } from '../firebase/config';
import Header from "./Header";
import "./Artist_Visitor.css";


function Artist2Visitor() {
  const [artistWorks, setArtistWorks] = useState([]);
  const navigate = useNavigate();
  const { artistName } = useParams();

  useEffect(() => {
    const fetchArtistWorks = async () => {
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

    fetchArtistWorks();
  }, [artistName]);

  return (
    <div>
      <Header />
      <div>
        
        <div className='artist-works'>
        <h2 className='works-artist'>{artistName}</h2>
          {artistWorks.map((work, index) => (
            <div key={index} className="work-box">
              <img src={work.url} alt={`Work ${index}`} className="work-image" />
              <div className="work-metadata">
              <p className='fs-3'>{work.metadata.customMetadata.workName}</p>
                <p className='fst-italic fs-5'>{work.metadata.customMetadata.genre}</p>
                <p className='fw-bold fs-5'>Rs. {work.metadata.customMetadata.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Artist2Visitor;
