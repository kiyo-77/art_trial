

import React, { useEffect, useState } from "react";
import { imageDb } from '../firebase/config';
import { getDownloadURL, listAll, ref, uploadBytes, getMetadata, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import { auth, db } from '../firebase/config';
import { getDocs, collection, query, where } from 'firebase/firestore';
import SidebarArtist from './SidebarArtist'; 
import './ArtworkArtist.css'; // Your existing CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

function ArtworkArtist() {
  const [img, setImg] = useState(null);
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [workName, setWorkname] = useState('');
  const [imgUrl, setImgUrl] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const navigate = useNavigate();
 const GotoProfile=()=>{
navigate("/artist-profile");
 }
  const fetchUsername = async (userId) => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData && userData.username) {
          setUsername(userData.username);
        } else {
          console.error('Username property not found in user document.');
        }
      });
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleClick = async () => {
    if (img !== null && genre && price && workName) {
      const userId = auth.currentUser.uid;

      await fetchUsername(userId);

      const imgRef = ref(imageDb, `${v4()}`);
      const metadata = {
        customMetadata: {
          genre: genre,
          price: price,
          userId: userId,
          username: username,
          workName: workName,
          selected: 'no',
        },
      };

      uploadBytes(imgRef, img, metadata).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setImgUrl((data) => [...data, { url, metadata }]);
        });
      });
    }
  };

  const handleDelete = async (imageUrl) => {
    const userId = auth.currentUser.uid;

    const imgRef = ref(imageDb, imageUrl);
    deleteObject(imgRef)
      .then(() => {
        setImgUrl((prevImages) => prevImages.filter((img) => img.url !== imageUrl));
      })
      .catch((error) => {
        console.error('Error deleting image:', error.message);
      });
  };

  const handleModify = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleModifySubmit = () => {
    const modifiedImage = imgUrl.find((img) => img.url === selectedImageUrl);

    modifiedImage.metadata.customMetadata.genre = genre;
    modifiedImage.metadata.customMetadata.price = price;
    modifiedImage.metadata.customMetadata.workName = workName;

    setGenre('');
    setPrice('');
    setWorkname('');

    setSelectedImageUrl(null);
  };

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const fetchedImages = [];
  
    const fetchImages = async () => {
      const imgs = await listAll(ref(imageDb));
  
      await Promise.all(
        imgs.items.map(async (val) => {
          const url = await getDownloadURL(val);
          const metadata = await getMetadata(val);
  
          if (metadata && metadata.customMetadata && metadata.customMetadata.userId === userId) {
            fetchedImages.push({ url, metadata });
          }
        })
      );
  
      setImgUrl(fetchedImages);
    };
  
    fetchImages();
  }, [username]); 
  

  return (
    <div className="container-fluid">
  <div className="row">
   
    <div className="side col-md-4 col-lg-3 col-xl-2 fixed-sidebar px-0">
      <SidebarArtist />
    </div>
   
    <div className="col-md-8 col-lg-9 col-xl-10 mt-5">
      <div className="row">
        <div className=" content-page col-md-6 mb-4">
          <h1>Artworks</h1>
          <div className="upload-form box p-3 text-center offset-5">
            
            <input type="file" onChange={(e) => setImg(e.target.files[0])} className="mb-2 fs-4" />
            <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="mb-2 form-control fs-4" />
            <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 form-control fs-4" />
            <input type="text" placeholder="Name" value={workName} onChange={(e) => setWorkname(e.target.value)} className="mb-2 form-control fs-4" />
            <button type="button" className="mb-2 btn-circle upload fs-2" onClick={handleClick}>+</button>
          </div>
        </div>
        <div className="col-md-12">
          <div className="image-container d-flex flex-wrap">
            {imgUrl.map((dataVal, index) => (
              <div key={index} className="image-box m-2">
                <img src={dataVal.url} alt={`Uploaded ${index}`} className="img-upload" />
                <div className="metadata">
                  {selectedImageUrl === dataVal.url ? (
                    <>
                     <input type="text" placeholder="Name of the Artwork" value={workName} onChange={(e) => setWorkname(e.target.value)} className="mb-2 form-control fs-3" />
                      <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="mb-2 form-control fs-3" />
                      <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 form-control fs-3" />
                      
                      <button type="button" className="submit mb-2 form-control " onClick={handleModifySubmit}>Submit</button>
                    </>
                  ) : (
                    <>
                      <p className="font-weight-bold fs-1 mb-4 ml-6 fw-bold"> {dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.workName}</p>
                     
                      <p className="fst-italic fs-4 mb-3 ml-4" >{dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.genre} </p>
                      <p className="fs-3 ml-4 fw-bold">Rs. {dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.price}</p>
                      <button type="button" className="delete mb-2 form-control mt-3"  onClick={() => handleDelete(dataVal.url)}>Delete</button>
                      <button type="button" className="modify mb-2 form-control mt-3" onClick={() => handleModify(dataVal.url)}>Modify</button>
                    </>
                  )}
                </div>
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

export default ArtworkArtist;
