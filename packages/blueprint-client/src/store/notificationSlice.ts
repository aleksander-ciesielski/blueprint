import {
  createAction, createAsyncThunk, createSlice, nanoid,
} from "@reduxjs/toolkit";

export const NOTIFICATION_LIFESPAN_MS = 3_000;

export interface NotificationManifest {
  type: "success" | "danger";
  content: string;
}

export interface NotificationManifestWithId extends NotificationManifest {
  id: string;
}

export interface NotificationState {
  lifespanMs: number,
  list: NotificationManifestWithId[];
}

const initialState: NotificationState = {
  lifespanMs: NOTIFICATION_LIFESPAN_MS,
  list: [],
};

const unshiftNotification = createAction("notification/unshift");

const pushNotification = createAsyncThunk<NotificationManifestWithId, NotificationManifest>(
  "notification/push",
  async (notification, { dispatch }): Promise<NotificationManifestWithId> => {
    setTimeout(() => {
      dispatch(unshiftNotification());
    }, NOTIFICATION_LIFESPAN_MS);

    return {
      ...notification,
      id: nanoid(),
    };
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(unshiftNotification, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.list = state.list.slice(1);
    });

    builder.addCase(pushNotification.fulfilled, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.list = [...state.list, action.payload];
    });
  },
});

export { pushNotification };

export const notificationReducer = notificationSlice.reducer;
