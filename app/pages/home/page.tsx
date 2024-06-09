"use client";
import axios from "axios";
import { Button } from "blixify-ui-web/lib/components/action/button";
import { Grid, GridClass } from "blixify-ui-web/lib/components/display/grid";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomHeader from "../../components/Header";
import CustomTextInput from "../../components/TextInput";
import { RecipeState } from "../recipeEditor/page";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  const gridLimit = 10;

  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchRecipe, setSearchRecipe] = useState("");
  const [recipeList, setRecipeList] = useState<RecipeState[]>([]);
  // const [cursor] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName ? storedUserName : "");
    }
    handleGetRecipeList();
  }, []);

  const handleGetRecipeList = async () => {
    try {
      setLoading(true);
      //INFO: call the read api via this link
      const recipeResp = await axios.get("/pages/api/read");

      console.log(recipeResp);

      setRecipeList(recipeResp.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

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

  const renderRecipeGridData = () => {
    const recipeListData: GridClass[] = [];
    if (recipeList) {
      recipeList.map((eachRecipe: any) => {
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
        });
      });
    }

    return recipeListData;
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader userName={userName} page="Cookbook Junction" />
      <Container className="my-10" bgColor="bg-black">
        <div className="bg-indigo-500 w-fit rounded-lg mb-5">
          <Text size="4xl" type="h1" className="font-extrabold p-3 ">
            {userName}
          </Text>
        </div>
        <Text size="4xl" type="h1" className="font-extrabold text-white">
          Welcome To Cookbook Junction
        </Text>
        <div style={{ width: "60vw" }}>
          <Text size="base" type="h1" className="mt-2 text-white">
            At Cookbook Junction, discover a wide variety of recipes published
            by numerous users, sorted by the latest additions. Easily search for
            recipes that pique your interest
          </Text>
        </div>
        <div className="flex flex-col sm:flex-row justify-between">
          <CustomTextInput
            value={searchRecipe}
            label="Search Recipe"
            containerClassName="mt-5 sm:w-96"
            labelClassName="text-gray-400 font-semibold"
            inputClassName="border text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-300"
            onChange={(e) => {
              setSearchRecipe(e.target.value);
            }}
          />
          <div className="flex sm:mt-12 mt-5 sm:ml-5">
            <Button
              text="Create My Recipe"
              type="normal"
              size="small"
              onClick={() => router.push("/pages/recipeEditor")}
              className="self-end w-full"
            />
          </div>
        </div>
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
          onClickData={() => router.push("/pages/recipeDetail")}
        />
      </Container>
    </div>
  );
}
