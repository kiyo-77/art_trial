
import React, { useState, useEffect } from "react";
import { imageDb } from '../firebase/config';
import { getDownloadURL, listAll, ref, uploadBytes, getMetadata, deleteObject, updateMetadata } from "firebase/storage";
import { v4 } from "uuid";
import { auth, db } from '../firebase/config';
import { getDocs, collection, query, where } from 'firebase/firestore';
import SidebarArtist from './SidebarArtist'; 
import './ArtworkArtist.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

function ArtworkArtist() {
  const [img, setImg] = useState(null);
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [workName, setWorkname] = useState('');
  const [imgUrl, setImgUrl] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const fetchUsername = async (userId) => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      let artistUsername = null;

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData && userData.username) {
          artistUsername = userData.username;
        } else {
          console.error('Username property not found in user document.');
        }
      });

      return artistUsername;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      return null;
    }
  };

  const handleClick = async () => {
    if (img !== null && genre && price && workName) {
      const userId = auth.currentUser.uid;

     
      const fetchedUsername = await fetchUsername(userId);
      setUsername(fetchedUsername);

      const imgRef = ref(imageDb, `${v4()}`);
      const metadata = {
        customMetadata: {
          genre: genre,
          price: price,
          userId: userId,
          username: fetchedUsername, 
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

  const handleModifySubmit = async () => {
    try {
      const modifiedImage = imgUrl.find((img) => img.url === selectedImageUrl);

     
      const fetchedUsername = await fetchUsername(auth.currentUser.uid);

      modifiedImage.metadata.customMetadata.genre = genre;
      modifiedImage.metadata.customMetadata.price = price;
      modifiedImage.metadata.customMetadata.workName = workName;

     
      modifiedImage.metadata.customMetadata.username = fetchedUsername;

      setGenre('');
      setPrice('');
      setWorkname('');
      setSelectedImageUrl(null);

      const imgRef = ref(imageDb, selectedImageUrl);
      await updateMetadata(imgRef, {
        customMetadata: modifiedImage.metadata.customMetadata,
      });

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
    } catch (error) {
      console.error('Error modifying image:', error.message);
    }
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
            <div className="content-page col-md-6 mb-4">
              <h1>Artworks</h1>
              <hr />
              <div className="upload-form box p-3 text-center">
                <input type="file" onChange={(e) => setImg(e.target.files[0])} className="upload-input" />
                <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="form-control upload-input" />
                <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control upload-input" />
                <input type="text" placeholder="Name" value={workName} onChange={(e) => setWorkname(e.target.value)} className="form-control upload-input" />
                <button type="button" className="btn-circle upload fs-4" onClick={handleClick}>+</button>
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
                          <input type="text" placeholder="Name of the Artwork" value={workName} onChange={(e) => setWorkname(e.target.value)} className="mb-2 form-control fs-5" />
                          <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="mb-2 form-control fs-5" />
                          <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 form-control fs-5" />
                          <button type="button" className="submit mb-2 form-control" onClick={handleModifySubmit}>Submit</button>
                        </>
                      ) : (
                        <>
                          <p className="font-weight-bold fs-3 mb-4 ml-6 fw-bold"> {dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.workName}</p>
                          <p className="fst-italic fs-5 mb-3 ml-4">{dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.genre} </p>
                          <p className="fs-5 ml-4 fw-bold">Rs. {dataVal.metadata.customMetadata && dataVal.metadata.customMetadata.price}</p>
                          <button type="button" className="delete mb-2 form-control mt-3" onClick={() => handleDelete(dataVal.url)}>Delete</button>
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

