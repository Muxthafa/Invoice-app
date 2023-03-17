// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnRkARyHnDJraFWWLm9WFSEmtxT1HTxHU",
  authDomain: "invoice-app-26315.firebaseapp.com",
  projectId: "invoice-app-26315",
  storageBucket: "invoice-app-26315.appspot.com",
  messagingSenderId: "815124480437",
  appId: "1:815124480437:web:8aea65e5a4477808d619fc",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export default db;
