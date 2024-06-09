import { getAnalytics, isSupported, setUserId } from "firebase/analytics";
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
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
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
