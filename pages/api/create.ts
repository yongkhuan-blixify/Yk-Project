import { NextApiRequest, NextApiResponse } from "next";
import { addData } from "../../firebaseService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { collection, data } = req.body;

    if (collection && data) {
      const uploadFirebaseResp = await addData(collection, data, data.id);

      if (uploadFirebaseResp) {
        return res.status(200).json({
          message: `${collection} data successfully updated`,
          data: uploadFirebaseResp,
        });
      }
    }

    return res
      .status(400)
      .json({ message: "Collection and data are required" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "An error occurred", error: err });
  }
}
