import { UserModel } from "@/app/models/User";
import moment from "moment";
import { fbClient as firebase, handleSetUserId } from "../utils/firebase";

let unsubscribeAuthListener: any = null;

export const handleSignOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (err) {}
};

// export const getUserByEmail = async (email: string) => {
//   try {
//     let selectedData: any = null;
//     return selectedData;
//   } catch (error) {
//     return null;
//   }
// };

export const getUserInfo = async (email: string) => {
  try {
    const userData: any = [];
    if (userData) {
      const user: UserModel = {
        name: userData.name,
        phone: userData.phone,
      };
      return user;
    }
  } catch (err) {}
};

export const getAuthListener = () => {
  return async (dispatch: any, getState: any) => {
    if (!unsubscribeAuthListener) {
      unsubscribeAuthListener = firebase
        .auth()
        .onAuthStateChanged(async (user: any) => {
          if (user) {
            handleSetUserId(user?.uid);
            try {
              //INFO: Monday only able to retrieve newly created item after 30 seconds via API
              const timeStamp = JSON.parse(
                JSON.stringify(getState().authStore.timeStamp)
              );
              if (moment().isAfter(moment(timeStamp).add(30, "seconds"))) {
                let userData = await getUserInfo(user.phoneNumber);
                if (userData) {
                  dispatch({
                    type: "UPDATE_USER_AUTH",
                    payload: {
                      user: userData,
                      userAuth: user,
                    },
                  });
                } else throw "Error";
              } else {
                dispatch({
                  type: "UPDATE_USER_AUTH",
                  payload: {
                    user: getState().authStore.user,
                    userAuth: user,
                  },
                });
              }
            } catch (err) {
              handleSignOut();
            }
          } else {
            dispatch({
              type: "UPDATE_USER_AUTH",
              payload: {
                user: null,
                userAuth: null,
              },
            });
          }
        });
    }
  };
};

export const removeAuthListener = () => {
  if (unsubscribeAuthListener) {
    unsubscribeAuthListener();
    unsubscribeAuthListener = null;
  }
};
