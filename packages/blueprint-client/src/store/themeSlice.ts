import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AsyncThunk } from "@reduxjs/toolkit";
import type { Theme } from "~/themes/Theme";
import { ThemeManager } from "~/themes/ThemeManager";

export const themeChanged: AsyncThunk<void, Theme, any> = createAsyncThunk(
  "theme/theme-changed",
  (theme) => {
    ThemeManager.getInstance().write(theme);
  },
);

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    current: ThemeManager.DEFAULT_THEME.id,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(themeChanged.fulfilled, (state) => {
      state.current = ThemeManager.getInstance().read().id;
    });
  },
});

export const themeReducer = themeSlice.reducer;
