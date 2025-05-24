import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCienRF_VhiFE34HIZ-R3OT9u4sHJAHBTk",
    authDomain: "my-portfolio-12299.firebaseapp.com",
    projectId: "my-portfolio-12299",
    storageBucket: "my-portfolio-12299.firebasestorage.app",
    messagingSenderId: "627355124358",
    appId: "1:627355124358:web:cb85b0a03b3fdcbf7b8707",
    measurementId: "G-98GM2PFE6N"
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };