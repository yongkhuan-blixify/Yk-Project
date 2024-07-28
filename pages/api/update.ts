import { NextApiRequest, NextApiResponse } from "next";
import { updateData } from "../../firebaseService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { collection, data } = req.body;

    if (collection && data && data.id) {
      const updateFirebaseResp = await updateData(collection, data, data.id);

      if (updateFirebaseResp) {
        return res.status(200).json({
          message: `${collection} data successfully updated`,
          data: updateFirebaseResp,
        });
      } else {
        return res.status(500).json({ message: "Failed to update data" });
      }
    }

    return res
      .status(400)
      .json({ message: "Collection, data, and data ID are required" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "An error occurred", error: err });
  }
}
