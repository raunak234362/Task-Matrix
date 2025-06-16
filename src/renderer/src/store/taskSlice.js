/* eslint-disable prettier/prettier */
// projectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskData: [],
  taskRecord: [],
  commentData: [],
  taskById: {},
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskData.push(action.payload);
    },
    showTask: (state, action) => {
      state.taskData = action.payload;
    },
    deleteTask: (state, action) => {
      state.taskData = state.taskData.filter(
        (task) => task.id !== action.payload,
      );
    },
    updateTask: (state, action) => {
      state.taskData = state.taskData.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task,
      );
    },
    showTaskRecord: (state, action) => {
      state.taskRecord = action.payload;
    },
    addCommentToTask: (state, action) => {
      const { taskId, comment } = action.payload;
      const task = state.taskData.find((task) => task.id === taskId);
      if (task) {
        if (!task.comments) {
          task.comments = []; // Dynamically add 'comments' field if it doesn't exist
        }
        task.comments.push(comment); // Add the comment to the task's comments array
      }
    },
    showTaskByID: (state, action) => {
      state.taskById = action.payload;
    },
    deleteTaskByID: (state, action) => {
      state.taskById = state.taskById.filter(
        (task) => task.id !== action.payload,
      );
    },
  },
});

export const {
  addTask,
  showTask,
  deleteTask,
  showTaskRecord,
  updateTask,
  addCommentToTask,
  showTaskByID,
  deleteTaskByID,
} = taskSlice.actions;

export default taskSlice.reducer;
