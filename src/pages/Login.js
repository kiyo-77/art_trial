import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const navigate = useNavigate();
const GotoRegisterpage=()=>{
  navigate("/register-page");
}
  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

     
      fetchUserRole(userCredential.user.uid);
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const fetchUserRole = async (userId) => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const userRole = doc.data().role;

      if (userRole === 'artist') {
        navigate('/artist-dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard');
      }
    });
  };

  return (
    <div>
      <h3>Login</h3>
      <input
        placeholder="Email..."
        onChange={(event) => {
          setLoginEmail(event.target.value);
        }}
      />
      <input
        placeholder="Password..."
        onChange={(event) => {
          setLoginPassword(event.target.value);
        }}
      />
      <button onClick={login}>Login</button>
      <button onClick={GotoRegisterpage}>Register</button>
    </div>
  );
};

export default Login;
