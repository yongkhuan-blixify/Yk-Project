"use client";
import { Recipe } from "app/models/Recipe";
import axios from "axios";
import { Button } from "blixify-ui-web";
import { ImageGallery } from "blixify-ui-web/lib/components/design/imageGallery";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import { useEffect, useState } from "react";
import CustomHeader from "../components/Header";

export default function RandomPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [randomRecipe, setRandomRecipe] = useState<Recipe>();
  const [recipeList, setRecipeList] = useState([]);

  const images = [
    "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1638502521795-89107ac5e246?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1892&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?q=80&w=1962&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1701113208672-df1d083413d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1627309302198-09a50ae1b209?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1700897424755-5af071df965e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1535567465397-7523840f2ae9?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  useEffect(() => {
    handleGetRecipeList();
  }, []);

  useEffect(() => {
    handleGetRandomRecipe(recipeList);
  }, [recipeList]);

  useEffect(() => {
    console.log(randomRecipe);
  }, [randomRecipe]);

  const handleSetCurrentImage = (index: number) => {
    setCurrentImage(index);
  };

  const handleGetRecipeList = async () => {
    const recipeResp = await axios.post("/api/readAPI", {
      collectionName: "recipe",
    });

    setRecipeList(recipeResp.data.data);
  };

  const handleGetRandomRecipe = (recipes: Recipe[]) => {
    const randomIndex = Math.floor(Math.random() * recipes.length);

    setRandomRecipe(recipes[randomIndex]);
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="Recipe of the Day" />
      <div>
        <ImageGallery
          imageGallery={images}
          currentImage={currentImage}
          currentImageClassName="h-80 w-full"
          eachImageClassName="h-40 w-40"
          imageTransitionDuration={4000}
          handleSetCurrentImage={handleSetCurrentImage}
          autoImageTransition={false}
        />
      </div>
      <Container className="pb-20" bgColor="bg-black">
        <div className="flex flex-row justify-between">
          <div>
            <Text
              size="4xl"
              type="h1"
              className="font-extrabold text-white mt-10"
            >
              Random Recipe : {randomRecipe && randomRecipe.recipeName}
            </Text>
          </div>
          <div className="pt-5 w-full">
            <Button
              text="Refresh"
              type="normal"
              size="small"
              onClick={() => {}}
              className="my-5 w-1/5"
            />
          </div>
        </div>
        <Text size="base" type="h1" className="mt-5 text-white">
          {randomRecipe && randomRecipe.recipeIntro}
        </Text>
      </Container>
    </div>
  );
}
