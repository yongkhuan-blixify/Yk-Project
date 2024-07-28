"use client";
import {
  Button,
  DetailList,
  DetailListClass,
  EmptyState,
  Loading,
} from "blixify-ui-web";
import CustomHeader from "../components/Header";
// import { Button } from "blixify-ui-web/lib/components/action/button";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import CustomModal from "app/components/Modal";
import { RecipeState } from "app/recipeEditor/page";
import { Breadcrumb } from "blixify-ui-web/lib/components/navigation/breadcrumb";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecipeInfo } from "store/actions/recipeActions";
// import { useRouter } from "next/navigation";

export default function RecipeDetailPage() {
  const searchParams = useSearchParams();
  const dataParam = searchParams?.get("id");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recipeDetail, setRecipeDetail] = useState<RecipeState>({
    recipeName: "",
    recipeType: "",
    recipeIntro: "",
    recipeIngredient: "",
    recipeStep: "",
    recipeImage: "",
    createdBy: "",
    createdOn: new Date(),
  });
  const [recipeNull, setRecipeNull] = useState(false);
  const pages = [
    { name: "Cookbook Junction", href: "/home", current: false },
    { name: "Recipe Detail", href: "#", current: true },
  ];

  useEffect(() => {
    handleGetRecipeDetail(dataParam);
  }, []);

  const handleGetRecipeDetail = async (id: any) => {
    setLoading(true);
    if (id) {
      const recipeResp = await getRecipeInfo(id);

      if (recipeResp) {
        setRecipeDetail(recipeResp);
      } else {
        setRecipeNull(true);
      }
      setLoading(false);
    }
  };

  const renderSignUpModalContent = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <Loading />
        <h1 className="mt-5 text-white">Rendering recipe...</h1>
      </div>
    );
  };

  const renderDetailListContent = () => {
    let detailList: DetailListClass[] = [];

    detailList = [
      {
        title: "Recipe Image",
        text: (
          <div className="border-2 border-white w-2/3 rounded-lg">
            <img
              src={
                recipeDetail.recipeImage
                  ? (recipeDetail.recipeImage as string)
                  : ""
              }
              className="rounded-lg"
              alt=""
            />
          </div>
        ),
      },
      {
        title: "Recipe Type",
        text: `${recipeDetail.recipeType ?? ""}`,
      },
      {
        title: "Ingredient",
        text: `${recipeDetail.recipeIngredient ?? ""}`,
      },
      {
        title: "Step",
        text: `${recipeDetail.recipeStep ?? ""}`,
      },
      {
        title: "Recipe By",
        text: `${recipeDetail.createdBy ?? ""}`,
      },
      {
        title: "Created On",
        text: `${moment(recipeDetail.createdOn).format("DD-MM-YYYY") ?? ""}`,
      },
    ];

    return detailList;
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="Recipe Detail" />
      <CustomModal
        open={loading}
        darkMode
        renderContent={renderSignUpModalContent}
      />
      <Container className="pb-20" bgColor="bg-black">
        <div className="mt-10">
          <Breadcrumb pages={pages} darkMode={true} />
        </div>
        <Text size="4xl" type="h1" className="font-extrabold text-white mt-10">
          Recipe Detail
        </Text>
        <Text size="base" type="h1" className="mt-5 text-white">
          This page provides an in-depth look at each recipe, offering you all
          the information and insights you need to bring the dish to life in
          your own kitchen. This page is designed to give you a comprehensive
          understanding of the recipe, ensuring your cooking experience is as
          smooth and enjoyable as possible.
        </Text>
        {recipeNull ? (
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
        ) : (
          <div className="border border-white rounded-lg mt-5">
            <DetailList
              title={recipeDetail.recipeName ?? ""}
              description={recipeDetail.recipeIntro ?? ""}
              darkMode
              className="rounded-lg"
              list={renderDetailListContent()}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
