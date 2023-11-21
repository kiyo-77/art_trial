import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarArtist from './SidebarArtist'; 
import "./ArtistProfile.css";

function ArtistProfile() {
  const [userDetails, setUserDetails] = useState({
    emailid: '',
    username: '',
  });

  const fetchUserData = async (userId) => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData && userData.username) {
          setUserDetails({
            ...userDetails,
            emailid: userData.emailid,
            username: userData.username,
          });
        } else {
          console.error('Username property not found in user document.');
        }
      });
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    const userId = auth.currentUser.uid;
    fetchUserData(userId);
  }, []); 

  const handleUpdateProfile = async () => {
    try {
      const userId = auth.currentUser.uid;
      const usersCollection = collection(db, 'users');

    
      const q = query(usersCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      // Assuming there's only one document with the given userId
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;

        // Update the document
        await updateDoc(userDocRef, {
          emailid: userDetails.emailid,
          username: userDetails.username,
        });

        // Display success toast
        toast.success('Profile updated successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error('User document not found.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    
    <div className="container-fluid">
    <div className="row flex-nowrap">
     
      <div className="side col-md-4 col-xl-2 fixed-sidebar px-sm-2 px-0 ">
        <SidebarArtist />
      </div>
     
      <div className="col-md-5 mt-5 mx-5 md-5">
        <ToastContainer />
        <h1 className="mb-4 ">Profile</h1>
        <form>
          <div className="mb-5 p-3 mt-5 ">
            <label htmlFor="emailid" className="form-label fs-3 fw-bold">
              Email address
            </label>
            <input
              type="email"
              className="form-control fs-3"
              id="emailid"
              name="emailid"
              value={userDetails.emailid}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="mb-5 p-3 mt-4">
            <label htmlFor="username" className="form-label fs-3 fw-bold">
              Username
            </label>
            <input
              type="text"
              className="form-control fs-3"
              id="username"
              name="username"
              value={userDetails.username}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="button"
            className="update"
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  </div>
  
  );
}

export default ArtistProfile;
