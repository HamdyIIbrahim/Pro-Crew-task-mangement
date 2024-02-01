import { instance } from "@/axios/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const authLogin = createAsyncThunk("auth/login", async (loginData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data, status } = await instance.post(
      `/auth/login`,
      JSON.stringify(loginData),
      config
    );
    return { data, status };
  } catch (error) {
    console.log({ error });
  }
});

export const authSignup = createAsyncThunk(
  "auth/signup",
  async (signupData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("photo", signupData.photo);
    formData.append("password", signupData.password);
    try {
      const { data, status } = await instance.post(
        `/auth/signup`,
        formData,
        config
      );
      return { data, status };
    } catch (error) {
      console.log({ error });
    }
  }
);
