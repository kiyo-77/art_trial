import React from 'react';

function OfferPage({
  selectedArtwork,
  offerEmail,
  questions,
  setOfferEmail,
  setQuestions,
  handleOfferSubmit,
}) {
  if (!selectedArtwork) {
    // If selectedArtwork is not defined, you can handle it accordingly
    return <p>No artwork selected.</p>;
  }

  return (
    <div className="offer-page">
      <h2>Make an Offer</h2>
      <img src={selectedArtwork.url} alt="Selected Artwork" className="img-fluid" />
      <p>Work Name: {selectedArtwork.metadata.customMetadata.workName || "untitled"}</p>
      <p>Artist Name: {selectedArtwork.metadata.customMetadata.username || "unknown"}</p>
      <p>Genre: {selectedArtwork.metadata && selectedArtwork.metadata.customMetadata.genre}</p>
      <p>Price: {selectedArtwork.metadata && selectedArtwork.metadata.customMetadata.price}</p>

      <label>Email:</label>
      <input type="email" value={offerEmail} onChange={(e) => setOfferEmail(e.target.value)} />
      <label>Questions:</label>
      <textarea value={questions} onChange={(e) => setQuestions(e.target.value)} />
      <button onClick={handleOfferSubmit}>Submit Offer</button>
    </div>
  );
}

export default OfferPage;
