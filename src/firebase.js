import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAgLLtN7E0EGJOfavnTo79sD9X6-RGVCos",
    authDomain: "kuliner-fa825.firebaseapp.com",
    projectId: "kuliner-fa825",
    storageBucket: "kuliner-fa825.firebasestorage.app",
    messagingSenderId: "746264654566",
    appId: "1:746264654566:web:6feb63c39cbed104eb0127"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };