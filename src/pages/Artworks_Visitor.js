import React, { useEffect, useState } from "react";
import { imageDb, db } from '../firebase/config';
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { addDoc, collection } from 'firebase/firestore';
import './artwork.css';
import Header from "./Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

function ArtworksVisitor() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [offerEmail, setOfferEmail] = useState("");
  const [questions, setQuestions] = useState("");
  const [makingOffer, setMakingOffer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
    setShowModal(true);
  };

  const handleCloseForm = () => {
    setMakingOffer(false);
    setShowModal(false);
    setSelectedArtwork(null); 
  };

  const handleOfferSubmit = async () => {
    try {
     
      const offersCollection = collection(db, 'offers');
      await addDoc(offersCollection, {
        artworkId: selectedArtwork.metadata.customMetadata.workName,
        artist: selectedArtwork.metadata.customMetadata.username,
        userEmail: offerEmail,
        questions: questions,
      });

     
      setMakingOffer(false);
      setOfferEmail("");
      setQuestions("");

      alert('Offer submitted successfully!');
      setShowModal(false); 
    } catch (error) {
      console.error('Error submitting offer:', error.message);
    }
  };

  return (
    <div className="visitor-page">
      <Header />
      <div className="visitor-content">
        <div className="row row-cols-1 row-cols-md-3">
          {artworks.map((artwork, index) => (
            <div key={index} className="col mb-4">
              <div className="artwork-item">
                <div className="image-box" onClick={() => handleMakeOffer(artwork)}>
                  <img src={artwork.url} alt={`Artwork ${index}`} className="img-fluid img-display" />
                  <div className="artwork-details">
                    <p className="font-weight-bold fs-3 mb-2 ml-6 fw-bold">{artwork.metadata.customMetadata.workName || "untitled"}</p>
                    <p className="ms-5 fs-5 fw-bold mb-3">By {artwork.metadata.customMetadata.username || "unknown"}</p>
                    <p className="fst-italic fs-5 mb-3 ml-4" >{artwork.metadata && artwork.metadata.customMetadata.genre}</p>
                    <p className="fs-4 ml-4 fw-bold">Rs.{artwork.metadata && artwork.metadata.customMetadata.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedArtwork && (
        <Modal show={showModal} onHide={handleCloseForm} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedArtwork.metadata.customMetadata.workName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedArtwork.url} alt={selectedArtwork.metadata.customMetadata.workName} className="img-fluid img-disp" />
            {makingOffer && (
              <div className="offer-form">
                <form onSubmit={(e) => { e.preventDefault(); handleOfferSubmit(); }}>
                  <label className="quote fw-bold">
                    Quote your Offer
                    <textarea
                      value={questions}
                      onChange={(e) => setQuestions(e.target.value)}
                      required
                      className="quote-input"
                    />
                  </label>
                  <br />
                  <input
                    type="email"
                    value={offerEmail}
                    onChange={(e) => setOfferEmail(e.target.value)}
                    required
                    className="email-offer-input"
                    placeholder="Enter email id..."
                  />
                  <br />
                  <button type="submit" className="submit-offer">Submit Offer</button>
                </form>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default ArtworksVisitor;
