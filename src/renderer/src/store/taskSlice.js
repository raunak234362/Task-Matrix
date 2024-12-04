/* eslint-disable prettier/prettier */
// projectSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  taskData: []
}

const taskSlice = createSlice({
  name: 'taskData',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskData.push(action.payload)
    },
    showTasks: (state, action) => {
      state.taskData = action.payload
    },
    deleteTask: (state, action) => {
      state.taskData = state.taskData.filter((task) => task.id !== action.payload)
    },
    updateTaskData: (state, action) => {
      state.taskData = { ...state.taskData, ...action.payload }
    }
  }
})

export const { addTask, showTasks, deleteTask, updateTaskData } = taskSlice.actions

export default taskSlice.reducer
