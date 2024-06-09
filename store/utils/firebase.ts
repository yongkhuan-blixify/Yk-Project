import {
  getAnalytics,
  isSupported,
  logEvent,
  setUserId,
} from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* eslint-disable */
declare global {
  var _fbClient: any;
}
/* eslint-enable */

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId?: string | undefined;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCsV3BSpbbg3HPB4NoOvFkz6crretqf-vU",
  authDomain: "cookbook-junction.firebaseapp.com",
  projectId: "cookbook-junction",
  storageBucket: "cookbook-junction.appspot.com",
  messagingSenderId: "627989662854",
  appId: "1:627989662854:web:c6cbdea1e6f84d52ef5507",
  measurementId: "G-K1CMHQVWWS",
};

let fbClient: any;
if (!global._fbClient) {
  global._fbClient = firebase.initializeApp(firebaseConfig, "client");
}

fbClient = global._fbClient;
const firestore = getFirestore(fbClient);
const storage = getStorage(fbClient);

const initializeAnalytics = async () => {
  const isSupportedResult = await isSupported();
  if (isSupportedResult) {
    const analytics = getAnalytics(fbClient);
    return analytics;
  } else {
    return null;
  }
};

const handleGetAnalytics = async () => {
  try {
    await initializeAnalytics();
  } catch (err) {}
};

export const handleSetUserId = async (userId: string) => {
  try {
    if (userId) {
      const analytics = getAnalytics(fbClient);
      setUserId(analytics, userId);
    }
  } catch (err) {}
};

export { fbClient, firestore, storage };
