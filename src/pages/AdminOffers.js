import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import SidebarAdmin from './SidebarAdmin';
import './AdminOffers.css';

function AdminOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersCollection = collection(db, 'offers');
        const querySnapshot = await getDocs(offersCollection);

        const offersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(offersData);
      } catch (error) {
        console.error('Error fetching offers:', error.message);
      }
    };

    fetchOffers();
  }, []);

  const handleDelete = async (offerId) => {
    try {
      await deleteDoc(doc(db, 'offers', offerId));
      setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== offerId));
    } catch (error) {
      console.error('Error deleting offer:', error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="side col-md-4 col-lg-3 col-xl-2 fixed-sidebar px-0">
          <SidebarAdmin />
        </div>
        <div className="col-md-8 col-lg-9 col-xl-10 mt-5">
          <div className="row">
            <div className="content-page col-md-8 mb-4">
              <h1 className="mt-2">Offers</h1>
            </div>
            <div className="col-md-12">
              {offers.map((offer) => (
                <div key={offer.id} className="col-md-4 mb-4 ms-5">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Artwork ID: {offer.artworkId}</h5>
                      <p className="card-text">Artist: {offer.artist}</p>
                      <p className="card-text">User Email: {offer.userEmail}</p>
                      <p className="card-text">Questions: {offer.questions}</p>
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          type="button"
                          className="delete"
                          onClick={() => handleDelete(offer.id)}
                        >
                          Delete
                        </button>
                      
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOffers;
