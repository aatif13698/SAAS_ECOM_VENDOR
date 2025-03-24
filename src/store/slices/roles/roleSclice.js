import { createSlice } from "@reduxjs/toolkit";

export const roleSclice = createSlice({
  name: "roles",
  initialState: {
    roleData: [],
    roleExists : false
  },
  reducers: {
    setRole: (state, action) => {
      state.profileData = action.payload;
      state.profileExists = true;
    },
    remoRole: (state, action) => {
      state.profileData = null;
      state.profileExists = false;
    },
  },
});

export const { setRole, remoRole } = roleSclice.actions;
export default roleSclice.reducer;
