// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY , 
  authDomain: "amine-estate.firebaseapp.com",
  projectId: "amine-estate",
  storageBucket: "amine-estate.firebasestorage.app",
  messagingSenderId: "1094647285856",
  appId: "1:1094647285856:web:b89648cb460992084adb05"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);