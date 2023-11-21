import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const navigate = useNavigate();
  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);

      // After successful registration, set the user's role in Firestore
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
    <div>
      <h3>Register User</h3>
      <input
        placeholder="Email..."
        onChange={(event) => {
          setRegisterEmail(event.target.value);
        }}
      />
      <input
        placeholder="Username..."
        onChange={(event) => {
          setRegisterUsername(event.target.value);
        }}
      />
      <input
        placeholder="Password..."
        onChange={(event) => {
          setRegisterPassword(event.target.value);
        }}
      />
      <button onClick={register}>Create User</button>
    </div>
  );
};

export default Register;
