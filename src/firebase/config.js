
import {initializeApp} from 'firebase/app';
import {getAuth} from'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyBhDMzAFymgc1suDVT1FyP2g757_oiGOIw",
    authDomain: "art-gal-4080a.firebaseapp.com",
    projectId: "art-gal-4080a",
    storageBucket: "art-gal-4080a.appspot.com",
    messagingSenderId: "802538089446",
    appId: "1:802538089446:web:67b3648d416d3b9d1ec427"
  };

 export  const app=initializeApp(firebaseConfig);
 export const db =getFirestore(app);
  export const auth = getAuth(app);
  export const imageDb = getStorage(app);
 