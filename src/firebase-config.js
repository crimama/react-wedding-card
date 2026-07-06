import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnPihKAD3oTQmk5--lmuyib1VG7gWDgGY",
  authDomain: "hun-yunkyung-wedding.firebaseapp.com",
  projectId: "hun-yunkyung-wedding",
  storageBucket: "hun-yunkyung-wedding.firebasestorage.app",
  messagingSenderId: "696038345423",
  appId: "1:696038345423:web:c1ac1ee029c1b5ad0645ba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
