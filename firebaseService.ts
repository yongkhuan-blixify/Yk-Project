import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db as firebaseDb, storage } from "./firebaseConfig";

export const db = firebaseDb;

//INFO: setDoc push up firebase data
export const addData = async (
  collectionName: string, //recipe
  data: any, //recipeData
  id: string //uuidv4
) => {
  try {
    //INFO: Push to firebase https://firebase.google.com/docs/firestore/query-data/get-data
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data);
    return docRef.id;
  } catch (err) {
    console.log(err);
  }
};

//INFO: Firebase upload image https://firebase.google.com/docs/storage/web/upload-files
export const uploadImage = async (file: File, path: string) => {
  try {
    //INFO: Check if file exist
    if (!file) return null;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    //INFO: get the return image link from firebase
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (err) {
    console.log(err);
  }
};
