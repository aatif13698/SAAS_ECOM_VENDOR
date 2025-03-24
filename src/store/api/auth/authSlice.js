import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));


export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:  storedAdmin ? storedAdmin : null,
    isAuth: storedAdmin ? true : false
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logOut: (state, action) => {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
