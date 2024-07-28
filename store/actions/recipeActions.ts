// import { UserModel } from "app/models/User";
// import moment from "moment";
import axios from "axios";
// import { fbClient as firebase } from "../utils/firebase";

// let unsubscribeAuthListener: any = null;

//INFO: NEED TO DESIGN A READ API THAT CAN PASS QUERY IN
export const getRecipeInfo = async (id: string) => {
  try {
    const recipeInfoResp = await axios.post("/api/readAPI", {
      collectionName: "recipe",
      documentId: id,
    });

    return recipeInfoResp.data;
  } catch (err) {}
};

export const getAllRecipe = async () => {
  try {
    const allRecipeInfoResp = await axios.post("/api/readAPI", {
      collectionName: "recipe",
    });

    return allRecipeInfoResp.data;
  } catch (err) {}
};
