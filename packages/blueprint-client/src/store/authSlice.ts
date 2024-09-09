import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HttpContracts } from "@blueprint/contracts";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "~/services/HttpService";
import { pushNotification } from "~/store/notificationSlice";

export interface AuthState {
  name: string;
  sessionInitialized: boolean;
  accessToken: string | undefined;
  userId: string | undefined;
}

const initialState: AuthState = {
  name: "...",
  sessionInitialized: false,
  accessToken: undefined,
  userId: undefined,
};

export const setAccessToken = createAction<string>("auth/set-access-token");
export const setUserName = createAction<string>("auth/set-username");
export const setUserId = createAction<string>("auth/set-user-id");
export const initializeSession = createAction<void>("auth/initialize-session");

export const rotateTokens = createAsyncThunk(
  "auth/rotate-tokens",
  async () => {
    const httpService = new HttpService();
    await httpService.rotateTokens();
  },
);

async function getMyselfResponse(
  httpService: HttpService,
): Promise<HttpContracts.MyselfOkResponse> {
  const request = httpService.request({
    contract: HttpContracts.myselfContract,
  });

  const response = await request.execute(undefined);
  return response.data;
}

export const refreshSession = createAsyncThunk(
  "auth/refresh-session",
  async (_, { dispatch }) => {
    await dispatch(rotateTokens());

    const httpService = new HttpService();
    const myselfResponse = await getMyselfResponse(httpService);

    if (myselfResponse.userId) {
      dispatch(setUserId(myselfResponse.userId));
    }

    if (myselfResponse.username) {
      dispatch(setUserName(myselfResponse.username));
    }

    dispatch(initializeSession());
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    const httpService = new HttpService();

    const request = httpService.request({
      contract: HttpContracts.logoutContract,
    });

    try {
      const response = await request.execute(undefined);
      response.castOrThrow(StatusCodes.NO_CONTENT);
      httpService.unsetRefreshToken();

      dispatch(pushNotification({
        type: "success",
        content: "Successfully logged out.",
      }));

      window.location.reload();
    } catch (e) {
      dispatch(pushNotification({
        type: "danger",
        content: "Could not log out.",
      }));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAccessToken, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.accessToken = action.payload;
    });

    builder.addCase(setUserName, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.name = action.payload;
    });

    builder.addCase(setUserId, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.userId = action.payload;
    });

    builder.addCase(logout.fulfilled, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.accessToken = undefined;
    });

    builder.addCase(initializeSession, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.sessionInitialized = true;
    });
  },
});

export const authReducer = authSlice.reducer;
