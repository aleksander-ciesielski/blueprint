import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AsyncThunk } from "@reduxjs/toolkit";
import type { Translation } from "~/translation/Translation";
import { TranslationManager } from "~/translation/TranslationManager";

export const languageChanged: AsyncThunk<void, Translation, any> = createAsyncThunk(
  "translation/language-changed",
  (translation) => {
    TranslationManager.getInstance().write(translation);
  },
);

export const translationSlice = createSlice({
  name: "translation",
  initialState: {
    current: TranslationManager.DEFAULT_TRANSLATION.id,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(languageChanged.fulfilled, (state) => {
      state.current = TranslationManager.getInstance().read().id;
    });
  },
});

export const translationReducer = translationSlice.reducer;
