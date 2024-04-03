import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyACzy5axRJO9MT_0PAOj_s4jS48LwYzZsU",
  authDomain: "felloway.app",
  projectId: "felloway-30160",
  storageBucket: "felloway-30160.appspot.com",
  messagingSenderId: "1001735400507",
  appId: "1:1001735400507:web:9600cdb2a6c690f5ed801e",
  measurementId: "G-RZRZE7HY9K"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };