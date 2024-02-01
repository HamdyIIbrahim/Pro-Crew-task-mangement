import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./features/User/authSlice";
import taskSlice from "./features/Task/taskSlice";
export default combineReducers({
  user: userSlice,
  task: taskSlice,
});
