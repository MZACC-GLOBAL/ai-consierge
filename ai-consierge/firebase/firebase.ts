
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP_1oI07PRopDMs24izyh2SjtcAIGtYdM",
  authDomain: "makvue-concierge.firebaseapp.com",
  projectId: "makvue-concierge",
  storageBucket: "makvue-concierge.firebasestorage.app",
  messagingSenderId: "679563307542",
  appId: "1:679563307542:web:557039d1d6b9ae9a7f2337",
  measurementId: "G-HRWHKN83C1"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)