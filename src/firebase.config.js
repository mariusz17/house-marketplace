import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnehJsGQ8GTCOhhspXB0gyy8LTE37bgdM",
  authDomain: "house-marketplace-app-90860.firebaseapp.com",
  projectId: "house-marketplace-app-90860",
  storageBucket: "house-marketplace-app-90860.appspot.com",
  messagingSenderId: "149661074293",
  appId: "1:149661074293:web:03d9ce8c66b0d5f08f493c",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
