import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebaseService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { collectionName, documentId } = req.body;

    //INFO: Ensure collectionName is provided
    if (!collectionName) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    if (documentId) {
      //INFO: If documentId is provided, fetch the specific document
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const documentData = docSnap.data();
        return res.status(200).json({ id: docSnap.id, ...documentData });
      } else {
        return res.status(404).json({ message: "Document not found" });
      }
    } else {
      //INFO: If no documentId is provided, fetch all documents in the collection
      const dataCollection = collection(db, collectionName);
      const snapshot = await getDocs(dataCollection);

      const data = snapshot.docs.map((eachSnapshot) => {
        const id = eachSnapshot.id;
        const documentData = eachSnapshot.data();

        //INFO: Check if documentData is an object
        if (typeof documentData !== "object" || documentData === null) {
          console.error(
            `Document data for ID ${id} is not an object:`,
            documentData
          );
          return { id, error: "Invalid document data" };
        }

        return {
          id: id,
          ...documentData,
        };
      });

      return res.status(200).json({ data: data });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err });
  }
}
