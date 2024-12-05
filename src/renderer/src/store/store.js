/* eslint-disable prettier/prettier */
import { configureStore } from '@reduxjs/toolkit'
import fabricatorReducer from './fabricatorSlice'
import projectReducer from './projectSlice'
import taskData from './taskSlice'
import teamSlice from './teamSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    userData: userReducer,
    fabricatorData: fabricatorReducer,
    projectData: projectReducer,
    taskData: taskData,
    teamData: teamSlice,
  }
})
export default store
