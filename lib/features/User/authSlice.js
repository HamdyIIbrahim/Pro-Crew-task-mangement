import { createSlice } from "@reduxjs/toolkit";
import { authLogin } from "./authAction";
import { deleteCookie } from "cookies-next";

const initialState = {
  loading: false,
  error: null,
  name: null,
  photo: null,
  token: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut: (state) => {
      deleteCookie("token");
      deleteCookie("name");
      deleteCookie("photo");
      state.token = null;
      state.name = null;
      state.photo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload?.name;
        state.photo = action.payload?.photo;
        state.token = action.payload?.token;
      })
      .addCase(authLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { setCredentials, logOut } = user.actions;
export default user.reducer;
