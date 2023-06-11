import { configureStore } from "@reduxjs/toolkit";
//import login reducer bundle
import loginReducer from "./slices/login.slice";

//configure the store
export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});
