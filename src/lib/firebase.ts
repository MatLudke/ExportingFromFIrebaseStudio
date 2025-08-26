// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "tempo-certo-qf64u",
  "appId": "1:1044295739285:web:d583b8dfdb56de33ec789c",
  "storageBucket": "tempo-certo-qf64u.firebasestorage.app",
  "apiKey": "AIzaSyBCuaWiC3-tlpttDR_PBfGgKtFsKMflrK8",
  "authDomain": "tempo-certo-qf64u.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1044295739285"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
