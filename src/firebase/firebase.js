// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Import Realtime Database functions

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyC5hFxxgiJ5M2WDA2EMKQab-BQDiyQ77Uw",
  authDomain: "bharat-linker.firebaseapp.com",
  projectId: "bharat-linker",
  storageBucket: "bharat-linker.appspot.com",
  messagingSenderId: "1000044979704",
  appId: "1:1000044979704:web:506d4ca6156eea1113e20d",
  measurementId: "G-YTCLD8FG2J"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Realtime Database
const database = getDatabase(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider(); // Google Auth provider

// Export the initialized instances and provider
export { app, auth, database, provider };
