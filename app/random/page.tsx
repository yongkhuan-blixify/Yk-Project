"use client";
import { ShareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BackgroundMusic from "app/components/BackgroundMusic";
import CustomModal from "app/components/Modal";
import CustomNotification, {
  NotificationState,
} from "app/components/Notification";
import { Recipe } from "app/models/Recipe";
import axios from "axios";
import { Button } from "blixify-ui-web";
import { ImageGallery } from "blixify-ui-web/lib/components/design/imageGallery";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { authStateInterface } from "store/reducers/authReducer";
import CustomHeader from "../components/Header";

interface Props {
  authStore: authStateInterface;
}

function RandomPage(props: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [shareModal, setShareModal] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState<Recipe>();
  const [recipeList, setRecipeList] = useState([]);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

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

  const handleSaveRecipe = async () => {
    try {
      let savedRecipeList: any = [];
      if (props.authStore.user.savedRecipe) {
        savedRecipeList = props.authStore.user.savedRecipe;
      }

      if (!savedRecipeList.includes(randomRecipe?.id)) {
        savedRecipeList.push(randomRecipe?.id);

        const response = await axios.post("/api/update", {
          collection: "user",
          data: { savedRecipe: savedRecipeList, id: props.authStore.user.id },
        });
        if (response) {
          setNotification({
            type: true,
            title: "Saved Successfully",
            msg: `Recipe has been saved to your cookbook!`,
          });
        }
      } else {
        setNotification({
          type: true,
          title: "Recipe Existed",
          msg: `You have already saved this recipe to your cookbook.`,
        });
      }
      setShareModal(false);
    } catch (err) {
      setShareModal(false);
    }
  };

  const renderShareModalContent = () => {
    return (
      <div>
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-white text-lg">
              Share Recipe with Friends Now!
            </h1>
          </div>
          <div onClick={() => setShareModal(false)}>
            <XMarkIcon className="h-5 text-white hover:h-6" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center my-5">
          <Button
            text="Share to Instagram"
            type="icon"
            icon={<ShareIcon className="h-5 mr-2 text-primary-600" />}
            size="small"
            onClick={() => window.open("https://www.instagram.com/")}
            className="self-end w-full"
          />
          <Button
            text="Share to Facebook"
            type="normal"
            size="small"
            onClick={() => window.open("https://www.facebook.com/")}
            className="self-end w-full my-5"
          />
          <Button
            text="Save to Recipe Book"
            type="darkMode"
            size="small"
            onClick={() => handleSaveRecipe()}
            className="self-end w-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="Recipe of the Day" />
      <CustomModal
        open={shareModal}
        darkMode
        renderContent={renderShareModalContent}
      />
      <CustomNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />
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
        {/* //INFO: No need /public */}
        <div className=" mt-5">
          <BackgroundMusic src="/assets/bgm.mp3" />
        </div>
        {randomRecipe && (
          <div>
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
              <div className="flex flex-row gap-2">
                <Button
                  text="Share"
                  type="darkMode"
                  size="small"
                  onClick={() => setShareModal(true)}
                  className="my-5 w-full mt-10"
                />
                <Button
                  text="Refresh"
                  type="normal"
                  size="small"
                  onClick={() => handleGetRandomRecipe(recipeList)}
                  className="my-5 w-full mt-10"
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="mr-10">
                <Text size="base" type="h1" className="mt-5 text-white">
                  {randomRecipe && randomRecipe.recipeIntro}
                </Text>
                <div className="mt-10">
                  <p className="text-white font-semibold">Ingredients:</p>
                  <div className="border border-white rounded-lg mt-2">
                    <Text size="base" type="h1" className="text-white p-3">
                      {randomRecipe && randomRecipe.recipeIngredient}
                    </Text>
                  </div>
                </div>
                <div className="mt-10">
                  <p className="text-white font-semibold">
                    Step by step cooking:
                  </p>
                  <div className="border border-white rounded-lg mt-2">
                    <Text size="base" type="h1" className="text-white p-3">
                      {randomRecipe && randomRecipe.recipeStep}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="w-fit">
                <img
                  src={
                    randomRecipe.recipeImage
                      ? (randomRecipe.recipeImage as string)
                      : ""
                  }
                  className="rounded-lg w-full bg-gray-300"
                  alt=""
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function App() {
  return <CustomRandomScreen />;
}

const mapStateToProps = (state: any) => {
  return {
    authStore: state.authStore,
  };
};

const CustomRandomScreen = connect(mapStateToProps)(RandomPage);

export default App;
