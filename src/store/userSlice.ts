import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * @param {string | null} access_token - The user's access token.
 */
export interface UserState {
  access_token: string | null;
}

const initialState: UserState = {
  access_token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.access_token = action.payload;
    },
  },
});

export const { setAccessToken } = userSlice.actions;

export type RootState = ReturnType<typeof userSlice.reducer>;
