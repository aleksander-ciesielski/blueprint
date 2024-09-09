import { createSlice } from "@reduxjs/toolkit";

export const systemSlice = createSlice({
  name: "system",
  initialState: {
    pageReady: false,
  },
  reducers: {
    pageLoaded(state) {
      state.pageReady = true;
    },
  },
});

export const {
  pageLoaded,
} = systemSlice.actions;

export const systemReducer = systemSlice.reducer;
