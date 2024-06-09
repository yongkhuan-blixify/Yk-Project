import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsV3BSpbbg3HPB4NoOvFkz6crretqf-vU",
  authDomain: "cookbook-junction.firebaseapp.com",
  projectId: "cookbook-junction",
  storageBucket: "cookbook-junction.appspot.com",
  messagingSenderId: "627989662854",
  appId: "1:627989662854:web:c6cbdea1e6f84d52ef5507",
  measurementId: "G-K1CMHQVWWS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage };
