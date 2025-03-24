import { createSlice } from "@reduxjs/toolkit";

const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));


export const capabilitySlice = createSlice({
  name: "capability",
  initialState: {
    capability:  [],
    isCapability: false
  },
  reducers: {
    setCapability: (state, action) => {
      state.capability = action.payload;
      state.isCapability = true;
    },
    removeCapability: (state, action) => {
      state.capability = null;
      state.isCapability = false;
    },
  },
});

export const { setCapability, removeCapability } = capabilitySlice.actions;
export default capabilitySlice.reducer;
