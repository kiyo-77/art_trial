import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import "./login.css";
const Register = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const navigate = useNavigate();
  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);

     
      await setUserRoleInFirestore(userCredential.user.uid);

      console.log('User registered');
      navigate("/login");
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  const setUserRoleInFirestore = async (userId) => {
    const usersCollection = collection(db, 'users');
    await addDoc(usersCollection, {
      emailid: registerEmail,
      userId: userId,
      role: 'artist',
      username: registerUsername,
    });
  };

  return (
    <div class="body-container">
    <div class="wrapper">
      <h3>Sign Up</h3>
      <div class = "input-box">
      <input
        placeholder="Email..."
        type="email"
        onChange={(event) => {
          setRegisterEmail(event.target.value);
        }}
      /></div>
      <div class = "input-box">
      <input
        placeholder="Username..."
        onChange={(event) => {
          setRegisterUsername(event.target.value);
        }}
      /></div>
      <div class = "input-box">
      <input
        placeholder="Password..."
        type="password"
        onChange={(event) => {
          setRegisterPassword(event.target.value);
        }}
      /></div>
      <button onClick={register} class="btn">Register</button>
    </div>
     </div>

  );
};

export default Register;
