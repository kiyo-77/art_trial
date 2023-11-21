import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import ArtworkArtist from './pages/ArtworkArtist';
import UploadedImages from './pages/UploadedImages';
import Unauthorized from './pages/Unauthorized';
import Cover from './pages/Cover';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Artwork from './pages/AdminDisplayArtwork';
import ArtistList from './pages/Displayartists';
import Artists_Visitor from './pages/artists_visitor';
import ArtworksVisitor from './pages/Artworks_Visitor';
import AdminOffers from './pages/AdminOffers';
import ArtistProfile from './pages/ArtistProfile';
import ArtistDashboard from './pages/ArtistDashboard';
import AdminDisplayArtwork from './pages/AdminDisplayArtwork';
import AdminUploadArtwork from './pages/AdminUploadArtwork';
import Register from './pages/Register';
import OfferPage from "./pages/OfferPage";
import ArtistOffersPage from './pages/ArtistOffersPage';
function App() {
 
  return (
   
    <div className='App'> 
    
      <Routes>
      <Route path="/" element={<Cover />} />
      <Route path="/login" element={<Login />} />
      <Route path="/artist-dashboard" element={<ArtistDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/uploaded-images" element={<UploadedImages />} />
      <Route path="/artworks" element={<Artwork />} />
      <Route path="/admin-artists" element={<ArtistList />} />
      <Route path="/artists-visitor" element={<Artists_Visitor />} />
      <Route path="/artworks-visitor" element={<ArtworksVisitor />} />
      <Route path="/admin-offers" element={<AdminOffers />} />
      <Route path="/artist-profile" element={<ArtistProfile />} />
      <Route path="/artist-artwork" element={<ArtworkArtist />} />
      <Route path="/admin-uploaded-artworks" element={<AdminDisplayArtwork />} />
      <Route path="/admin-submitted-artworks" element={<AdminUploadArtwork />} />
      <Route path="/register-page" element={<Register />} />
      <Route path="/offer" element={<OfferPage />} />
      <Route path="/artist-offers" element={<ArtistOffersPage />} />
      <Route path="/artist/:artistName" element={<Artists_Visitor />} />
      </Routes>
    
       </div>
      
  );
}

export default App;
