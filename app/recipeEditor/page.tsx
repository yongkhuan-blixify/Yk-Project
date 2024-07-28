"use client";
import CustomModal from "app/components/Modal";
import axios from "axios";
import { Loading, TextInput } from "blixify-ui-web";
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
import { uploadImage } from "../../firebaseService";
import CustomHeader from "../components/Header";
import CustomNotification, {
  NotificationState,
} from "../components/Notification";

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

enum RecipeTypeOption {
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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      if (recipeData && userName) {
        if (
          recipeData.recipeName !== "" ||
          recipeData.recipeType !== "" ||
          recipeData.recipeImage !== "" ||
          recipeData.recipeIntro !== "" ||
          recipeData.recipeIngredient !== "" ||
          recipeData.recipeStep !== ""
        ) {
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

          const collectionName = "recipe";

          const response = await axios.post("/api/create", {
            collection: collectionName,
            data: updatedRecipeData,
          });

          if (response.data) {
            setNotification({
              type: true,
              title: "Thank you for sharing your recipe!",
              msg: `Your recipe has been published on cookbook junction`,
            });
            handleClearInputData();
            setLoading(false);
          }
        } else {
          setNotification({
            type: false,
            title: "Submmision Rejected",
            msg: `Please filled in all input before proceed.`,
          });
          setLoading(false);
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const renderSignUpModalContent = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <Loading />
        <h1 className="mt-5 text-white">Submitting recipe...</h1>
      </div>
    );
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
          <TextInput
            value={recipeData.recipeName}
            type="text"
            label="Recipe Name"
            placeholder="Place name here"
            onChange={(e) => {
              setRecipeData((prevState) => ({
                ...prevState,
                recipeName: e.target.value,
              }));
            }}
            darkMode
            containerClassName="pb-5 mt-2 w-full"
          />
          <Select
            value={recipeData.recipeType}
            label="Recipe Type"
            options={renderRecipeTypeOption()}
            darkMode
            containerClassName="w-full mt-2 pb-5"
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
            className="my-5 w-2/5 md:w-1/5"
          />
        </div>
      </>
    );
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="Recipe Editor" />
      <CustomModal
        open={loading}
        darkMode
        renderContent={renderSignUpModalContent}
      />
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
