/* eslint-disable prettier/prettier */
// projectSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectData: []
}

const projectSlice = createSlice({
  name: 'projectData',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projectData.push(action.payload)
    },
    showProjects: (state, action) => {
      state.projectData = action.payload
    },
    deleteProject: (state, action) => {
      state.projectData = state.projectData.filter((project) => project.id !== action.payload)
    },
    updateProjectData: (state, action) => {
      state.projectData = { ...state.projectData, ...action.payload }
    }
  }
})

export const { addProject, showProjects, deleteProject,updateProjectData } = projectSlice.actions

export default projectSlice.reducer
