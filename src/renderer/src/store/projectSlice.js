/* eslint-disable prettier/prettier */
// projectSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectData: [],
  teamData:[]
}

// eslint-disable-next-line prettier/prettier
const projectSlice = createSlice({
  name: 'project',
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
    },
    addTeam: (state, action) => {
      state.projectData.push(action.payload)
    },
    showTeam: (state, action) => {
      state.projectData = action.payload
    },
    deleteTeam: (state, action) => {
      state.projectData = state.projectData.filter((project) => project.id !== action.payload)
    },
    updateTeamData: (state, action) => {
      state.projectData = { ...state.projectData, ...action.payload }
    }
  }
})

export const { addProject, showProjects, deleteProject, updateProjectData, addTeam, showTeam,deleteTeam,updateTeamData } = projectSlice.actions

export default projectSlice.reducer
