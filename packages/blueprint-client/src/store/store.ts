import { configureStore } from "@reduxjs/toolkit";
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
} from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { snippetReducer } from "~/store/snippetSlice";
import { themeReducer } from "~/store/themeSlice";
import { translationReducer } from "~/store/translationSlice";
import { programReducer } from "~/store/programSlice";
import { systemReducer } from "~/store/systemSlice";
import { notificationReducer } from "~/store/notificationSlice";
import { authReducer } from "~/store/authSlice";

export const store = configureStore({
  reducer: {
    system: systemReducer,
    auth: authReducer,
    snippet: snippetReducer,
    theme: themeReducer,
    translation: translationReducer,
    program: programReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelector = useReduxSelector as TypedUseSelectorHook<RootState>;
export const useDispatch = useReduxDispatch<typeof store.dispatch>;
