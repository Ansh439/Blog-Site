// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-site-e3a34.firebaseapp.com",
  projectId: "blog-site-e3a34",
  storageBucket: "blog-site-e3a34.appspot.com",
  messagingSenderId: "780767168282",
  appId: "1:780767168282:web:f0167f85bf3427fd8e8ea3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);