import { createSlice } from "@reduxjs/toolkit";

export const financialYearChangeSclice = createSlice({
  name: "financialYearChange",
  initialState: {
    changeCount: 0
  },
  reducers: {
    setIncreaseCount: (state) => {
      state.changeCount = state.changeCount + 1;
    },
  },
});

export const { setIncreaseCount } = financialYearChangeSclice.actions;
export default financialYearChangeSclice.reducer;
