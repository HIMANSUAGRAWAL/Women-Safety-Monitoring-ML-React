// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtQoOFhDf8RwHH6hY43Zgzdv6RBUv5854",
  authDomain: "lng1-9ef0b.firebaseapp.com",
  projectId: "lng1-9ef0b",
  storageBucket: "lng1-9ef0b.firebasestorage.app",
  messagingSenderId: "347977762817",
  appId: "1:347977762817:web:d82ebbbf9860b5f06c9800"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;