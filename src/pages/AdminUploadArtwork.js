import React, { useEffect, useState } from "react";
import { imageDb ,auth} from '../firebase/config';
import { getDownloadURL, listAll, ref, uploadBytes, getMetadata,updateMetadata } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from "./SidebarAdmin";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminUploadArtwork() {
  const [img, setImg] = useState(null);
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [imgUrl, setImgUrl] = useState([]);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const GoToArtworksPage = () => {
    navigate('/artworks');
  };
  const GoToOffersPage = () => {
    navigate('/offers-admin');
  };
  const GoToArtistsPage = () => {
    navigate('/artists-list');
  };

  const handleClick = async () => {
    if (img && genre && price) {
      const imageId = v4();
      const imgRef = ref(imageDb, `${imageId}`);
      const metadata = {
        customMetadata: {
          genre: genre,
          price: price,
        }
      };

      try {
       
        const response = await fetch(img);
        const blob = await response.blob();

        
        await uploadBytes(imgRef, blob, metadata);

      
        const url = await getDownloadURL(imgRef);
        setImgUrl(data => [...data, { url, metadata }]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const handleAddToArtworks = async (selectedImgUrl, selectedMetadata) => {
    try {
     
      const updatedMetadata = {
        ...selectedMetadata,
        customMetadata: {
          ...selectedMetadata.customMetadata,
          selected: 'yes', 
        },
      };
  
      const artworkRef = ref(imageDb, selectedMetadata.fullPath);
  
      
      await updateMetadata(artworkRef, updatedMetadata);
      toast.success('Artwork uploaded successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log("Artwork added to 'artworks' page:", selectedImgUrl);
    } catch (error) {
      console.error("Error adding artwork to 'artworks' page:", error);
    }
  };
  useEffect(() => {
    listAll(ref(imageDb)).then(imgs => {
      imgs.items.forEach(val => {
        getDownloadURL(val).then(url => {
          getMetadata(val).then(metadata => {
            setImgUrl(data => [...data, { url, metadata }]);
          });
        });
      });
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        
        <div className="side col-md-4 col-lg-3 col-xl-2 fixed-sidebar px-0">
          <SidebarAdmin />
        </div>
        <div className="col-md-8 col-lg-9 col-xl-10 mt-5">
        <ToastContainer />
          <div className="row">
            <div className="content-page col-md-8 mb-4">
              <h1>Submitted Artworks</h1>
             
            </div>
            <div className="col-md-12">
              <div className="image-container d-flex flex-wrap">
                {imgUrl.map((dataVal, index) => (
                  <div key={index} className="image-box m-2 ">
                    <img src={dataVal.url} alt={`Uploaded ${index}`} className="img-upload"/>
                    <p className="font-weight-bold fs-1 mb-2 ml-6 fw-bold">{dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.workName}</p>
                    <p className="ms-5 fs-4 fw-bold mb-3">By {dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.username}</p>
                    <p className="fst-italic fs-4 mb-3 ml-4" >{dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.genre}</p>
                    <p className="fs-3 ml-4 fw-bold">Rs.{dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.price}</p>
                    <button onClick={() => handleAddToArtworks(dataVal.url, dataVal.metadata)}>Add to Artworks</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUploadArtwork;
