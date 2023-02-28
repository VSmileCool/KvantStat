// userReducer.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  name: string;
  email: string;
  // add any other properties you need
}

const initialState: UserState = {
  isLoggedIn: false,
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ name: string; email: string }>) {
      state.isLoggedIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.name = "";
      state.email = "";
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
