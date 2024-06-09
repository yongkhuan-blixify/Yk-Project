import { collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebaseService";

export default async function handler(
  req: NextApiRequest, //INFO: Request
  res: NextApiResponse //INFO: Response
) {
  try {
    console.log("innn");
    //INFO: Go to recipe collection on firebase
    const recipeCollection = collection(db, "recipe");
    //INFO: Get recipe data from firebase
    const snapshot = await getDocs(recipeCollection);
    //INFO: save the firebase data into data
    const data = snapshot.docs.map((eachSnapshot) => {
      //INFO: Id of the specific firebase data
      const id = eachSnapshot.id;

      //INFO: Get the data
      const documentData = eachSnapshot.data();

      //INFO: Return the data with id
      return {
        id: id,
        ...documentData,
      };
    });

    //INFO: Response with data
    res.send({ data: data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
}
