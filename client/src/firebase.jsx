// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5bded.firebaseapp.com",
  projectId: "mern-estate-5bded",
  storageBucket: "mern-estate-5bded.firebasestorage.app",
  messagingSenderId: "241027727347",
  appId: "1:241027727347:web:88f8ffec5cb8bd67ba9c86"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);