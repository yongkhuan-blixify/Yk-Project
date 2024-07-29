"use client";
import CustomModal from "app/components/Modal";
import CustomNotification, {
  NotificationState,
} from "app/components/Notification";
import axios from "axios";
import { Loading, TextInput } from "blixify-ui-web";
import { Button } from "blixify-ui-web/lib/components/action/button";
import { Grid, GridClass } from "blixify-ui-web/lib/components/display/grid";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { authStateInterface } from "store/reducers/authReducer";
import CustomHeader from "../components/Header";
import { RecipeState } from "../recipeEditor/page";

interface Props {
  authStore: authStateInterface;
}

function HomePage(props: Props) {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userLevel, setUserLevel] = useState<string>("");
  const [dailyModal, setDailyModal] = useState(false);
  const gridLimit = 10;
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchRecipe, setSearchRecipe] = useState("");
  const [recipeList, setRecipeList] = useState<RecipeState[]>([]);

  //INFO: Use callback to prevent data not trigger during search
  const handleGetRecipeList = useCallback(async () => {
    try {
      setLoading(true);
      // INFO: call the read API via this link
      const recipeResp = await axios.post("/api/readAPI", {
        collectionName: "recipe",
      });

      const recipeList = recipeResp.data.data
        .filter((eachRecipe: any) =>
          searchRecipe
            ? eachRecipe.recipeName
                .toLowerCase()
                .includes(searchRecipe.toLowerCase())
            : true
        )
        .map((eachRecipe: any) => ({
          id: eachRecipe.id,
          createdBy: eachRecipe.createdBy,
          createdOn: eachRecipe.createdOn,
          recipeImage: eachRecipe.recipeImage,
          recipeIngredient: eachRecipe.recipeIngredient,
          recipeIntro: eachRecipe.recipeIntro,
          recipeName: eachRecipe.recipeName,
          recipeStep: eachRecipe.recipeStep,
          recipeType: eachRecipe.recipeType,
        }));

      setRecipeList(recipeList);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [searchRecipe]);

  useEffect(() => {
    handleGetRecipeList();
  }, [handleGetRecipeList, searchRecipe]);

  useEffect(() => {
    if (props.authStore.user) {
      handleCheckUserDailyLogin();
      if (
        props.authStore.user.experiencePoint &&
        props.authStore.user.experiencePoint < 50
      ) {
        setUserLevel("Junior Chef");
      } else if (
        props.authStore.user.experiencePoint &&
        props.authStore.user.experiencePoint > 50 &&
        props.authStore.user.experiencePoint < 100
      ) {
        setUserLevel("Senior Chef");
      } else {
        setUserLevel("Master Chef");
      }
      setUserName(props.authStore.user?.userName);
    }
  }, [props.authStore.user]);

  const handleCheckUserDailyLogin = () => {
    if (props.authStore.user.loginClaimed !== moment().format("DD/MM/YYYY")) {
      setDailyModal(true);
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

  const handleClaimExperience = async () => {
    try {
      setModalLoading(true);
      let updatedPoint = 0;

      if (props.authStore.user.experiencePoint) {
        updatedPoint = props.authStore.user.experiencePoint;
      }

      updatedPoint += 10;

      const response = await axios.post("/api/update", {
        collection: "user",
        data: {
          loginClaimed: moment().format("DD/MM/YYYY"),
          experiencePoint: updatedPoint,
          id: props.authStore.user.id,
        },
      });

      if (response) {
        setNotification({
          type: true,
          title: "Claim Successfully",
          msg: `You have claimed daily login experience for today!`,
        });
        setDailyModal(false);
      }
      setModalLoading(false);
    } catch (err) {
      setModalLoading(false);
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

  const renderDailyModalContent = () => {
    const today = moment(); // today's date
    const startOfWeek = today.clone().startOf("isoWeek"); // the start of the week
    // Generate dates for the week
    const days = Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.clone().add(i, "days");
      return {
        formatted: date.format("dddd (D MMMM YYYY)"),
        isPast: date.isBefore(today, "day"),
        isToday: date.isSame(today, "day"),
      };
    });

    return (
      <div>
        <h1 className="text-lg text-white">
          Claim Your Daily Login Experience!
        </h1>
        <h1 className="text-xs text-gray-300 mb-5">
          By clicking claim you will be claiming 10 experience to your account.
        </h1>
        <div className="grid grid-cols-4 mt-5">
          {days.slice(0, 4).map((day, index) => (
            <div
              className={`border border-white rounded-lg flex justify-center p-5 ${
                day.isPast
                  ? "bg-primary-600"
                  : day.isToday
                  ? "bg-orange-500"
                  : ""
              }`}
            >
              <p className="text-white">{day.formatted}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 ">
          {days.slice(4).map((day, index) => (
            <div
              className={`border border-white rounded-lg flex justify-center p-5 ${
                day.isPast
                  ? "bg-primary-600"
                  : day.isToday
                  ? "bg-orange-500"
                  : ""
              }`}
            >
              <p className="text-white">{day.formatted}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          {modalLoading ? (
            <div className="flex justify-end">
              <Loading />
            </div>
          ) : (
            <Button
              text="Claim"
              type="normal"
              size="small"
              onClick={() => handleClaimExperience()}
              className="my-5 w-2/5"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="Cookbook Junction" />
      <CustomNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <CustomModal
        open={dailyModal}
        darkMode
        renderContent={renderDailyModalContent}
      />
      <Container className="my-10" bgColor="bg-black">
        <div className="flex flex-row gap-3">
          <div className="bg-indigo-500 w-fit rounded-lg mb-5">
            <Text size="4xl" type="h1" className="font-extrabold p-3 ">
              {userName}
            </Text>
          </div>
          <div className="bg-orange-500 w-fit rounded-lg mb-5">
            <Text size="4xl" type="h1" className="font-extrabold p-3 ">
              {userLevel}
            </Text>
          </div>
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
          <div className="w-60">
            <TextInput
              containerClassName="mt-5"
              value={searchRecipe}
              type="text"
              darkMode
              label="Search Recipe"
              placeholder="Eg. Nasi Lemak"
              onChange={(e) => setSearchRecipe(e.target.value)}
            />
          </div>
          <div className="flex sm:mt-12 mt-5 sm:ml-5">
            <Button
              text="Create My Recipe"
              type="normal"
              size="small"
              onClick={() => router.push("/recipeEditor")}
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
          onClickData={(id) => router.push(`/recipeDetail?id=${id}`)}
        />
      </Container>
    </div>
  );
}

function App() {
  return <CustomHomeScreen />;
}

const mapStateToProps = (state: any) => {
  return {
    authStore: state.authStore,
  };
};

const CustomHomeScreen = connect(mapStateToProps)(HomePage);

export default App;
