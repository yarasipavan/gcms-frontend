import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//middleware function that handles login request
export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (credentialsObj, { rejectWithValue }) => {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/login`,
        credentialsObj
      );
      console.log(res.data);
      //if login success store the required values in local storage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.payload));
        localStorage.setItem("status", "success");

        return res.data;
      } else {
        throw new Error(res.data.alertMsg);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.alertMsg) {
        return rejectWithValue(err.response.data.alertMsg);
      }
      return rejectWithValue(err.message);
    }
  }
);

//default values
let user = localStorage.getItem("user");
//if not exist in local storage set empty obj
if (!user) {
  user = {};
}
// else parse the obj and set
else {
  user = JSON.parse(user);
}

let status = localStorage.getItem("status");
//if not exist in local storage set idle
if (!status) {
  status = "idle";
}

const clearAllInLocalStorage = () => {
  localStorage.clear();
};

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    user: user,
    status: status,
    errorMessage: "",
  },
  reducers: {
    logout: (state) => {
      //clear all data and set default values
      clearAllInLocalStorage();
      state.user = {};
      state.status = "idle";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state, actionObj) => {
      state.status = "pending";
      state.user = {};
      state.errorMessage = "";
    });
    builder.addCase(userLogin.fulfilled, (state, actionObj) => {
      state.status = "success";
      state.user = actionObj.payload.payload;
      state.errorMessage = "";
    });
    builder.addCase(userLogin.rejected, (state, actionObj) => {
      state.status = "rejected";
      state.user = {};
      state.errorMessage = actionObj.payload;
    });
  },
});

//export action creation functions
export const { logout } = loginSlice.actions;
//export all reducers as a single reducer
export default loginSlice.reducer;
