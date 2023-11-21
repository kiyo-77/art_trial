import React, { useEffect, useState } from "react";
import { imageDb, db } from '../firebase/config';
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { addDoc, collection } from 'firebase/firestore';
import './artwork.css';
import Header from "./Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ArtworkVisitor.css';
import OfferPage from "./OfferPage";

function ArtworksVisitor() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [makingOffer, setMakingOffer] = useState(false);
  const [offerEmail, setOfferEmail] = useState("");
  const [questions, setQuestions] = useState("");

  const fetchArtworks = async () => {
    try {
      const storageRef = ref(imageDb);
      const allImages = await listAll(storageRef);
      const artworksData = await Promise.all(allImages.items.map(async (item) => {
        const metadata = await getMetadata(item);

        if (metadata.customMetadata && metadata.customMetadata.selected === 'yes') {
          const url = await getDownloadURL(item);
          return { url, metadata, item };
        } else {
          return null;
        }
      }));

      setArtworks(artworksData.filter(Boolean));
    } catch (error) {
      console.error("Error fetching artworks:", error.message);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleMakeOffer = (artwork) => {
    setSelectedArtwork(artwork);
    setMakingOffer(true);
  };

  const handleOfferSubmit = async () => {
    try {
      // Save offer details to Firebase
      const offersCollection = collection(db, 'offers');
      await addDoc(offersCollection, {
        artworkId: selectedArtwork.metadata.customMetadata.workName,
        artist: selectedArtwork.metadata.customMetadata.username,
        userEmail: offerEmail,
        questions: questions,
      });

      // Reset state
      setMakingOffer(false);
      setOfferEmail("");
      setQuestions("");

      alert('Offer submitted successfully!');
    } catch (error) {
      console.error('Error submitting offer:', error.message);
    }
  };

  return (
    <div className="visitor-page">
      <Header />
      <div className="visitor-content">
        {makingOffer && selectedArtwork ? (
          <OfferPage
            selectedArtwork={selectedArtwork}
            offerEmail={offerEmail}
            questions={questions}
            setOfferEmail={setOfferEmail}
            setQuestions={setQuestions}
            handleOfferSubmit={handleOfferSubmit}
          />
        ) : (
          <div>
            <p>Explore the selected artworks:</p>
            <div className="row">
              {artworks.map((artwork, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="artwork-item">
                    <img src={artwork.url} alt={`Artwork ${index}`} className="img-fluid" />
                    <p>Work Name: {artwork.metadata.customMetadata.workName || "untitled"}</p>
                    <p>Artist Name: {artwork.metadata.customMetadata.username || "unknown"}</p>
                    <p>Genre: {artwork.metadata && artwork.metadata.customMetadata.genre}</p>
                    <p>Price: {artwork.metadata && artwork.metadata.customMetadata.price}</p>
                    <button onClick={() => handleMakeOffer(artwork)}>Make an Offer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtworksVisitor;
