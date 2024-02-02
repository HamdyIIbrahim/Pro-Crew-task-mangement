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
      return error;
    }
  }
);

export const deleteTask = createAsyncThunk("task/delete-task", async (Id) => {
  try {
    const token = getCookie("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data, status } = await instance.delete(`/tasks/${Id}`, config);
    return { data, status };
  } catch (error) {
    return error;
  }
});

export const startTask = createAsyncThunk(
  "task/start-task",
  async ({ Id, clockIn }) => {
    try {
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data, status } = await instance.patch(
        `/tasks/start-task/${Id}`,
        JSON.stringify({ clockIn }),
        config
      );
      return { data, status };
    } catch (error) {
      return error;
    }
  }
);

export const endTask = createAsyncThunk(
  "task/end-task",
  async ({ Id, clockOut }) => {
    try {
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data, status } = await instance.patch(
        `/tasks/end-task/${Id}`,
        JSON.stringify({ clockOut }),
        config
      );
      return { data, status };
    } catch (error) {
      return error;
    }
  }
);

export const filterTasks = createAsyncThunk(
  "task/filter-tasks",
  async (title) => {
    try {
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data, status } = await instance.get(
        `/tasks/search?title=${title}`,
        config
      );
      return { data, status };
    } catch (error) {
      return error;
    }
  }
);

export const editTask = createAsyncThunk(
  "task/edit-task",
  async ({ Id, title }) => {
    try {
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data, status } = await instance.patch(
        `/tasks/${Id}`,
        JSON.stringify({ title }),
        config
      );
      return { data, status };
    } catch (error) {
      return error;
    }
  }
);
