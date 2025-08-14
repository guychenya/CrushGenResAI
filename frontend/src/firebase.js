// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your project's credentials
const firebaseConfig = {
  apiKey: "AIzaSyDDIGXCukP9f_iYwr0LoMxHEdHTuN47jA4",
  authDomain: "crushgenresai.firebaseapp.com",
  projectId: "crushgenresai",
  storageBucket: "crushgenresai.appspot.com",
  messagingSenderId: "1091700014251",
  appId: "1:1091700014251:web:f1c545669caa0a4f3d4bee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("User is logged out");
  }
});
