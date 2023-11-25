import React, { useEffect, useState } from "react";
import { auth, db } from '../firebase/config';
import { getDocs, collection, query, where } from 'firebase/firestore';
import SidebarArtist from './SidebarArtist'; 
import "./AdminOffers.css";

function ArtistOffersPage() {
  const [artistOffers, setArtistOffers] = useState([]);
  const [artistUsername, setArtistUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('userId', '==', user.uid));
          const userSnapshot = await getDocs(q);

          if (userSnapshot.empty) {
            console.error("User not found.");
            return;
          }

          const userData = userSnapshot.docs[0].data();
          setArtistUsername(userData.username);

          const offersRef = collection(db, 'offers');
          const offersQuery = query(offersRef, where('artist', '==', userData.username));
          const offersSnapshot = await getDocs(offersQuery);

          const offersData = offersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setArtistOffers(offersData);
        } else {
          console.error("No user logged in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="side col-md-4 col-lg-3 col-xl-2 fixed-sidebar px-0">
          <SidebarArtist />
        </div>

        <div className="col-md-8 col-lg-9 col-xl-10 mt-5">
          <h1>Offers</h1>
          <hr />
          <div className="row row-cols-1 row-cols-md-3 g-4 ">
            {artistOffers.map((offer) => (
              <div key={offer.id} className="col mb-4 mt-5">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Artwork Name: {offer.artworkId}</h5>
                    <p className="card-text">User Email: {offer.userEmail}</p>
                    <p className="card-text">Offer: {offer.questions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistOffersPage;
