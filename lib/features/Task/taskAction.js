import { instance } from "@/axios/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
export const createTask = createAsyncThunk(
  "task/create-task",
  async (taskData) => {
    try {
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data, status } = await instance.post(
        `/tasks/`,
        JSON.stringify(taskData),
        config
      );
      return { data, status };
    } catch (error) {
      console.log({ error });
    }
  }
);
