import { createSlice } from "@reduxjs/toolkit";
import { createTask } from "./taskAction";

const initialState = {
  title: "",
};

const task = createSlice({
  name: "task",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.title = action.payload.title;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const {} = task.actions;
export default task.reducer;
