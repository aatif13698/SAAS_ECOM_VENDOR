import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";


export const stateSlice = createSlice({
  name: "states",
  initialState: {
    stateList:  null,
    stateExists: false
  },
  reducers: {
    setState: (state, action) => {
      state.stateList = action.payload;
      state.stateExists = true;
    },
    removeState: (state, action) => {
      state.stateList = null;
      state.stateExists = false;
    },
  },
});

export const { setState, removeState } = stateSlice.actions;
export default stateSlice.reducer;
