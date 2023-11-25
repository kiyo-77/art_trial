import React, { useEffect, useState } from "react";
import { imageDb } from '../firebase/config';
import { ref, listAll, getDownloadURL, getMetadata, updateMetadata } from "firebase/storage";
import './artwork.css'; 
import SidebarAdmin from "./SidebarAdmin";

function AdminDisplayArtwork() {
  const [artworks, setArtworks] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [modifiedArtwork, setModifiedArtwork] = useState(null);

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

  const deleteArtwork = async (item) => {
    try {
      await updateMetadata(item, { customMetadata: { selected: 'no' } });
      fetchArtworks();
    } catch (error) {
      console.error("Error deleting artwork:", error.message);
    }
  };

  const modifyMetadata = (artwork) => {
    setModifiedArtwork(artwork);
    setNewGenre(artwork.metadata.customMetadata.genre || "");
    setNewPrice(artwork.metadata.customMetadata.price || "");
  };

  const saveModifiedMetadata = async (item) => {
    try {
      if (!newGenre || !newPrice) {
        alert("Please enter values for both genre and price.");
        return;
      }

      await updateMetadata(item, {
        customMetadata: {
          ...modifiedArtwork.metadata.customMetadata,
          genre: newGenre,
          price: newPrice,
        },
      });

      setNewGenre("");
      setNewPrice("");
      setModifiedArtwork(null);

      fetchArtworks();
    } catch (error) {
      console.error("Error modifying artwork:", error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
       
      <div className="side col-md-4 col-lg-3 col-xl-2 fixed-sidebar px-0">
          <SidebarAdmin />
        </div>

       
        <div className="content-page col-md-10 mb-4">
         
            <h1 className="mt-5">Uploaded Artworks</h1>
            <div className="col-md-12">
              <div className="image-container d-flex flex-wrap">
            {artworks.map((artwork, index) => (
              <div key={index} className="image-box m-2 col-md-4">
                <img src={artwork.url} alt={`Artwork ${index}`} className="img-display" />
                <p className="font-weight-bold fs-3 mb-4 ml-6 fw-bold">{artwork.metadata.customMetadata.workName || "untitled"}</p>
                <p className="ms-5 fs-5 fw-bold mb-3">By {artwork.metadata.customMetadata.username || "unknown"}</p>
                <p className="fst-italic fs-5 mb-3 ml-4" >{modifiedArtwork === artwork ? (
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Enter Genre"
                  />
                ) : (
                  artwork.metadata && artwork.metadata.customMetadata.genre
                )}</p>
                <p className="fs-5 ml-4 fw-bold">Rs.{modifiedArtwork === artwork ? (
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Enter Price"
                  />
                ) : (
                  artwork.metadata && artwork.metadata.customMetadata.price
                )}</p>
                <button onClick={() => deleteArtwork(artwork.item)} className="delete">Delete</button>
                {modifiedArtwork === artwork ? (
                  <button onClick={() => saveModifiedMetadata(artwork.item)} className="submit">Save</button>
                ) : (
                  <button onClick={() => modifyMetadata(artwork)} className="modify">Modify</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default AdminDisplayArtwork;
