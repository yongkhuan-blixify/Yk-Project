"use client";
import axios from "axios";
import { Button } from "blixify-ui-web/lib/components/action/button";
import { Option, Select } from "blixify-ui-web/lib/components/input/select";
import { TextArea } from "blixify-ui-web/lib/components/input/textArea";
import { UploadInput } from "blixify-ui-web/lib/components/input/uploadInput";
import { Breadcrumb } from "blixify-ui-web/lib/components/navigation/breadcrumb";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../../../firebaseService";
import CustomHeader from "../../components/Header";
import CustomNotification, {
  NotificationState,
} from "../../components/Notification";
import CustomTextInput from "../../components/TextInput";

export interface RecipeState {
  recipeName: string;
  recipeType: string;
  recipeIntro: string;
  recipeIngredient: string;
  recipeStep: string;
  recipeImage?: File | string;
  createdBy: string;
  createdOn: Date;
}

export enum RecipeTypeOption {
  BREAKFAST = "Breakfast",
  SOUP = "Soup",
  GRILLED = "Grilled",
  PASTA = "Pasta",
  SALAD = "Salad",
  SANDWICH = "Sandwich",
  BREAD = "Bread",
  DESSERT = "Dessert",
  ASIAN = "Asian",
  WESTERN = "Western",
}

export default function RecipeEditorPage() {
  const [userName, setUserName] = useState<string>("");
  const [recipeData, setRecipeData] = useState<RecipeState>({
    recipeName: "",
    recipeType: "",
    recipeIntro: "",
    recipeIngredient: "",
    recipeStep: "",
    recipeImage: "",
    createdBy: "",
    createdOn: moment().toDate(),
  });
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const pages = [
    { name: "Cookbook Junction", href: "/home", current: false },
    { name: "Creating recipe...", href: "/recipeEditor", current: true },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName ? storedUserName : "");
    }
  }, []);

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      setRecipeData((prevState) => ({
        ...prevState,
        recipeImage: file || "",
      }));
    } catch (err) {}
  };

  const handleClearInputData = () => {
    setRecipeData({
      recipeName: "",
      recipeType: "",
      recipeIntro: "",
      recipeIngredient: "",
      recipeStep: "",
      recipeImage: "",
      createdBy: "",
      createdOn: moment().toDate(),
    });
  };

  const handleSubmitRecipe = async () => {
    try {
      if (recipeData && userName) {
        const id = uuidv4();
        let imageURL = "";

        if (
          recipeData.recipeImage &&
          typeof recipeData.recipeImage !== "string"
        ) {
          const imagePath = `recipe/${id}/${recipeData.recipeImage.name}`;
          const uploadResult = await uploadImage(
            recipeData.recipeImage,
            imagePath
          );
          imageURL = uploadResult ? uploadResult : "";
        } else if (typeof recipeData.recipeImage === "string") {
          imageURL = recipeData.recipeImage;
        }

        const updatedRecipeData = {
          ...recipeData,
          createdBy: userName,
          recipeImage: imageURL,
          id: id,
        };

        const response = await axios.post(
          "/pages/api/create",
          updatedRecipeData
        );

        if (response.data) {
          console.log(response.data);
          setNotification({
            type: true,
            title: "Thank you for sharing your recipe!",
            msg: `Your recipe has been published on cookbook junction`,
          });
        }
      }
      handleClearInputData();
    } catch (err) {}
  };

  const renderRecipeTypeOption = () => {
    let recipeTypeOptionList: Option[] = [];
    Object.keys(RecipeTypeOption).map((eachRecipeType) => {
      const recipeOptions =
        RecipeTypeOption[eachRecipeType as keyof typeof RecipeTypeOption];
      recipeTypeOptionList.push({
        key: recipeOptions,
        label: recipeOptions,
      });
      return null;
    });
    return recipeTypeOptionList;
  };

  const renderRecipeFormData = () => {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          <CustomTextInput
            value={recipeData.recipeName}
            label="Recipe Name"
            placeholder="Place the name here"
            labelClassName="text-white text-sm font-semibold"
            inputClassName="border text-black border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 transition duration-300"
            onChange={(e) => {
              setRecipeData((prevState) => ({
                ...prevState,
                recipeName: e.target.value,
              }));
            }}
          />
          <Select
            value={recipeData.recipeType}
            label="Recipe Type"
            options={renderRecipeTypeOption()}
            darkMode
            containerClassName="w-full mt-2 mb-5 sm:mt-0 lg:w-60"
            disableKeyboard={true}
            onChange={(value: string) => {
              setRecipeData((prevState) => ({
                ...prevState,
                recipeType: value,
              }));
            }}
          />
          <TextArea
            value={recipeData.recipeIntro}
            label="Recipe Introduction"
            placeholder="Place the introduction here"
            subLabel=""
            rows={4}
            onChange={(e) => {
              setRecipeData((prevState) => ({
                ...prevState,
                recipeIntro: e.target.value,
              }));
            }}
            darkMode
          />
          <TextArea
            value={recipeData.recipeIngredient}
            label="Recipe Ingredient"
            placeholder="Place the ingredient here"
            subLabel=""
            rows={4}
            onChange={(e) => {
              setRecipeData((prevState) => ({
                ...prevState,
                recipeIngredient: e.target.value,
              }));
            }}
            darkMode
          />
          <TextArea
            value={recipeData.recipeStep}
            label="Recipe Step"
            placeholder="Place the step here"
            subLabel=""
            rows={4}
            onChange={(e) => {
              setRecipeData((prevState) => ({
                ...prevState,
                recipeStep: e.target.value,
              }));
            }}
            darkMode
          />
          <div>
            <Text size="sm" type="h1" className="font-semibold text-white">
              Upload Your Recipe Image
            </Text>
            <UploadInput
              lib={{ axios }}
              label=""
              file={recipeData.recipeImage}
              darkMode
              accept=".png,.jpg,.jpeg"
              onChange={handleOnChangeFile}
            />
          </div>
        </div>
        <div className="justify-end flex mt-10">
          <Button
            text="Next"
            type="normal"
            size="small"
            onClick={handleSubmitRecipe}
            className="my-5 w-4/5"
          />
        </div>
      </>
    );
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader userName={userName} page="Recipe Editor" />
      <CustomNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <Container className="pb-20" bgColor="bg-black">
        <div className="mt-10">
          <Breadcrumb pages={pages} darkMode={true} />
        </div>
        <Text size="4xl" type="h1" className="font-extrabold text-white mt-10">
          Recipe Editor
        </Text>
        <Text size="base" type="h1" className="mt-5 text-white">
          This page is designed to help you bring your recipes to life and share
          them with our vibrant community. Whether you are a seasoned chef or a
          home cook with a passion for food, Recipe Editor makes it easy to
          document your dishes and inspire others. Share your ultimate recipe
          with everyone!
        </Text>
        {renderRecipeFormData()}
      </Container>
    </div>
  );
}
