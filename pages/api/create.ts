import { NextApiRequest, NextApiResponse } from "next";
import { addData } from "../../firebaseService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //INFO: Get the recipe data pass in from API
    const recipeData = req.body;

    if (recipeData) {
      //INFO: Upload the recipe data to firebase
      const uploadFirebaseResp = await addData(
        "recipe",
        recipeData,
        recipeData.id
      );
      if (uploadFirebaseResp) {
        //INFO: If success return success response
        res.status(200).json({
          message: "Recipe successfully updated",
          data: uploadFirebaseResp,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "An error occurred", error: err });
  }
}
