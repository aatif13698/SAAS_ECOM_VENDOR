import { createSlice } from "@reduxjs/toolkit";

const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));



export const profileSclice = createSlice({
  name: "profile",
  initialState: {
    profileData: null,
    profileExists : false
  },
  reducers: {
    setProfile: (state, action) => {
      state.profileData = action.payload;
      state.profileExists = true;
    },
    removeProfile: (state, action) => {
      state.profileData = null;
      state.profileExists = false;
    },
  },
});

export const { setProfile, removeProfile } = profileSclice.actions;
export default profileSclice.reducer;
