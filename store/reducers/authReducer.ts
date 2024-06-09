export interface authStateInterface {
  userAuth: any;
  user: any;
  userLoading: boolean;
}

const initState: authStateInterface = {
  userAuth: null,
  user: null,
  userLoading: true,
};

const authReducer: any = (state = initState, action: any) => {
  switch (action.type) {
    case "UPDATE_USER_AUTH":
      return {
        ...state,
        userAuth: action.payload.userAuth,
        user: action.payload.user,
        userLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

export default authReducer;
