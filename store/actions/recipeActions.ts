// import { UserModel } from "app/models/User";
// import moment from "moment";
import axios from "axios";
// import { fbClient as firebase } from "../utils/firebase";

// let unsubscribeAuthListener: any = null;

export const getRecipeInfo = async (id: string) => {
  try {
    const recipeInfoResp = await axios.post("/api/readAPI", {
      collectionName: "recipe",
      documentId: id,
    });

    return recipeInfoResp.data;
  } catch (err) {}
};
