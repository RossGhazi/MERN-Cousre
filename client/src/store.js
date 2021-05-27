import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rooRedcuer from "./reducers";

const initialState = {};
const middleware = [thunk];
const store = createStore(
  rooRedcuer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
