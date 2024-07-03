// import { UserModel } from "app/models/User";
// import moment from "moment";
import axios from "axios";
import { fbClient as firebase } from "../utils/firebase";

let unsubscribeAuthListener: any = null;

export const getUserInfo = async (id: string) => {
  try {
    const userInfoResp = await axios.post("/api/readAPI", {
      collectionName: "user",
      documentId: id,
    });

    return userInfoResp.data;
  } catch (err) {}
};

export const getAuthListener = () => {
  return async (dispatch: any, getState: any) => {
    if (!unsubscribeAuthListener) {
      unsubscribeAuthListener = firebase
        .auth()
        .onAuthStateChanged(async (user: any) => {
          if (user) {
            try {
              let userData = await getUserInfo(user.uid);
              if (userData) {
                dispatch({
                  type: "UPDATE_USER_AUTH",
                  payload: {
                    user: userData,
                    userAuth: user.auth,
                  },
                });
              } else throw "Error";
            } catch (err) {
              dispatch({
                type: "UPDATE_USER_AUTH",
                payload: {
                  user: null,
                  userAuth: null,
                },
              });
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

export const resetPassword = async (email: string) => {
  const message =
    "Password reset link has been sent to your email if your account exists";
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return message;
  } catch (err) {
    return message;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    return "Your email or password may be incorrect, please try again";
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    return response;
  } catch (err) {
    return "Your email or password may be incorrect, please try again";
  }
};

export const handleSignOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (err) {}
};
