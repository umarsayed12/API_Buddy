import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import { authApi } from "../slices/api/authApi";
import { historyApi } from "../slices/api/historyApi";

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [historyApi.reducerPath]: historyApi.reducer,
});

export default rootReducer;
