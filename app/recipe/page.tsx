"use client";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import CustomModal from "app/components/Modal";
import CustomNotification, {
  NotificationState,
} from "app/components/Notification";
import axios from "axios";
import { Grid, GridClass, Loading } from "blixify-ui-web";
import { Button } from "blixify-ui-web/lib/components/action/button";
import { EmptyState } from "blixify-ui-web/lib/components/display/emptyState";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllRecipe } from "store/actions/recipeActions";
import { authStateInterface } from "store/reducers/authReducer";
import CustomHeader from "../components/Header";

interface Props {
  authStore: authStateInterface;
}

function RecipePage(props: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [savedRecipe, setSavedRecipe] = useState([]);

  const gridLimit = 10;

  useEffect(() => {
    if (props.authStore.user) handleGetSavedRecipe();
  }, [props.authStore.user]);

  const handlePagination = (value: string | number) => {
    if (typeof value === "number") {
      setPageIndex(value);
    } else {
      if (value === "next") {
        // //INFO : Check whether need to get new data from firebase
        // if (cursor && (pageIndex + 1) * limit > data.length) {
        //   // INFO : Retrieve data for firebase
        // }
        setPageIndex(pageIndex + 1);
      } else {
        setPageIndex(pageIndex - 1);
      }
    }
  };

  const handleRemoveRecipe = async (id: string) => {
    try {
      setModalLoading(true);
      let savedRecipeList: any = [];
      if (props.authStore.user.savedRecipe) {
        savedRecipeList = props.authStore.user.savedRecipe.filter(
          (item: string) => item !== id
        );
      }
      const response = await axios.post("/api/update", {
        collection: "user",
        data: { savedRecipe: savedRecipeList, id: props.authStore.user.id },
      });
      if (response) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {}
  };

  const handleGetSavedRecipe = async () => {
    try {
      setLoading(true);
      const recipeResp = await getAllRecipe();

      let saveRecipeList: any = [];

      if (recipeResp.data) {
        recipeResp.data.map((eachRecipe: any) => {
          if (props.authStore.user.savedRecipe.includes(eachRecipe.id)) {
            saveRecipeList.push(eachRecipe);
          }
        });

        setSavedRecipe(saveRecipeList);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const renderDeleteModalContent = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <Loading />
        <h1 className="mt-5 text-white">Removing recipe...</h1>
      </div>
    );
  };

  const renderRecipeGridData = () => {
    const recipeListData: GridClass[] = [];
    if (savedRecipe) {
      savedRecipe.map((eachRecipe: any) => {
        let tagList = [
          eachRecipe.recipeType,
          "Cookbook by: " + eachRecipe.createdBy,
        ];

        recipeListData.push({
          id: eachRecipe.id,
          title: eachRecipe.recipeName,
          description: eachRecipe.recipeIntro,
          tags: tagList,
          imageUrl: eachRecipe.recipeImage,
          extra: (
            <div className="flex flex-row gap-3">
              <Button
                text="View"
                type="darkMode"
                size="small"
                onClick={() => router.push(`/recipeDetail?id=${eachRecipe.id}`)}
                className="w-full my-3"
              />
              <Button
                text="Remove"
                type="danger"
                size="small"
                onClick={() => handleRemoveRecipe(eachRecipe.id)}
                className="w-full my-3"
              />
            </div>
          ),
        });
      });
    }

    return recipeListData;
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="My Recipe Book" />
      <CustomNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <CustomModal
        open={modalLoading}
        darkMode
        renderContent={renderDeleteModalContent}
      />
      <Container className="pb-20" bgColor="bg-black">
        <Text size="4xl" type="h1" className="font-extrabold text-white mt-10">
          My Recipe Book
        </Text>
        <Text size="base" type="h1" className="mt-5 text-white">
          This is a dedicated space where you can easily save and organize all
          the recipes you love. Whether you have found a family favorite or
          discovered a new dish that you cannot wait to try, My Recipe Book
          ensures you have all your culinary treasures in one convenient place.
        </Text>
        {savedRecipe ? (
          <Grid
            data={renderRecipeGridData()}
            limit={gridLimit}
            loading={loading}
            paginationType="cursor"
            cursor={""}
            darkMode
            pageIndex={pageIndex}
            handleUpdatePageIndex={handlePagination}
            itemClassName="shadow-md rounded"
            className="pb-20"
            size={renderRecipeGridData.length}
            onClickData={() => {}}
          />
        ) : (
          <EmptyState
            text="Looking for recipe? Check out more recipe at Cookbook Junction and save your interested recipe here!"
            darkMode
            className="mt-10"
            icon={<InformationCircleIcon className="h-10 text-primary-600" />}
            callToAction={
              <Button
                text="Go to Cookbook Junction"
                type="normal"
                size="small"
                onClick={() => router.push("/home")}
                className="my-5 w-4/5"
              />
            }
          />
        )}
      </Container>
    </div>
  );
}

function App() {
  return <CustomRecipeScreen />;
}

const mapStateToProps = (state: any) => {
  return {
    authStore: state.authStore,
  };
};

const CustomRecipeScreen = connect(mapStateToProps)(RecipePage);

export default App;
