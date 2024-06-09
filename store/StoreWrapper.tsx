"use client";
import { Provider } from "react-redux";
import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore,
} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

const initialState = {};
const middleware = [thunk];

export const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);

interface Props {
  children: React.ReactNode;
}

export default function StoreWrapper(props: Props) {
  return <Provider store={store}>{props.children}</Provider>;
}
