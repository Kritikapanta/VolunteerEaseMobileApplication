// firebase.ts
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBZIfmg9TWp3VPToiePL1yJ1EKxHxRyKbA",
  authDomain: "volunteerease.firebaseapp.com",
  databaseURL: "https://volunteerease-default-rtdb.firebaseio.com",
  projectId: "volunteerease",
  storageBucket: "volunteerease.appspot.com",
  messagingSenderId: "643508608747",
  appId: "1:643508608747:web:6c837d9d7dea481503e8ae",
  measurementId: "G-C213MVV29X",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app); // ✅ No custom persistence setup
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, getDownloadURL, ref, storage, uploadBytesResumable };

