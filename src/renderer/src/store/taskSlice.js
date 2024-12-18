/* eslint-disable prettier/prettier */
// projectSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  taskData: []
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskData.push(action.payload)
    },
    showTask: (state, action) => {
      state.taskData = action.payload
    },
    deleteTask: (state, action) => {
      state.taskData = state.taskData.filter((project) => project.id !== action.payload)
    },
    updateTask: (state, action) => {
      state.taskData = state.taskData.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      )
    },
  }
})

export const { addTask, showTask, deleteTask, updateTask } = taskSlice.actions

export default taskSlice.reducer
