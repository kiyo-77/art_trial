import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import SidebarAdmin from "./SidebarAdmin";
import "./ArtistList.css"; 

function ArtistList() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const artistData = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData && userData.username && userData.emailid) {
            const artistInfo = {
              username: userData.username,
              emailid: userData.emailid,
            };
            artistData.push(artistInfo);
          }
        });

        setArtists(artistData);
      } catch (error) {
        console.error("Error fetching artists:", error.message);
      }
    };

    fetchArtists();
  }, []);

  const deleteArtist = async (artistInfo) => {
    try {
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);
      let artistDocId = null;

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (
          userData &&
          userData.username === artistInfo.username &&
          userData.emailid === artistInfo.emailid
        ) {
          artistDocId = doc.id;
        }
      });

      if (artistDocId) {
        await deleteDoc(doc(usersCollection, artistDocId));
        setArtists((prevArtists) =>
          prevArtists.filter(
            (artist) =>
              artist.username !== artistInfo.username &&
              artist.emailid !== artistInfo.emailid
          )
        );
      }
    } catch (error) {
      console.error("Error deleting artist:", error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        
        <div className="side col-md-4 col-lg-3 col-xl-2 fixed-sidebar px-0">
          <SidebarAdmin />
        </div>
        <div className="col-md-8 col-lg-9 col-xl-10 mt-5">
          <h1>Artists</h1>
          <div className="mt-5 row artist-list">
            {artists.map((artist, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="artist-box">
                  <p className="artist-name">{artist.username}</p>
                  <p className="artist-email">{artist.emailid}</p>
                  <button onClick={() => deleteArtist(artist)} className="delete-artist">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistList;
