import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { imageDb } from '../firebase/config';
import { ref, getDownloadURL, getMetadata } from 'firebase/storage';

function OfferPage() {
  const { workName } = useParams();

  const [offerEmail, setOfferEmail] = useState('');
  const [questions, setQuestions] = useState('');
  const [artworkUrl, setArtworkUrl] = useState('');
  const [artworkMetadata, setArtworkMetadata] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      const storageRef = ref(imageDb, workName);

      try {
        const url = await getDownloadURL(storageRef);
        const metadata = await getMetadata(storageRef);

       
        if (metadata && metadata.customMetadata && metadata.customMetadata.workName === workName) {
          setArtworkUrl(url);
          setArtworkMetadata(metadata);
        } else {
          console.error(`WorkName mismatch for ${workName}`);
        }
      } catch (error) {
        console.error('Error fetching artwork:', error.message);
      }
    };

    fetchArtwork();
  }, [workName]);

  const handleOfferSubmit = async () => {
  
    if (artworkMetadata && artworkMetadata.customMetadata && artworkMetadata.customMetadata.workName === workName) {
      try {
      
        console.log('Offer submitted successfully!');
      } catch (error) {
        console.error('Error submitting offer:', error.message);
      }
    } else {
      console.error('WorkName mismatch during offer submission.');
    }
  };

  return (
    <div>
      <h2>Make an Offer for {workName}</h2>
      {artworkUrl && <img src={artworkUrl} alt={`Artwork ${workName}`} className="img-fluid" />}
      <form onSubmit={handleOfferSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={offerEmail}
            onChange={(e) => setOfferEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Questions or Comments:
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit Offer</button>
      </form>
    </div>
  );
}

export default OfferPage;
