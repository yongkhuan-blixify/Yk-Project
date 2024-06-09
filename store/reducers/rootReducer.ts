import { combineReducers } from "redux";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  authStore: authReducer,
});

export default rootReducer;
