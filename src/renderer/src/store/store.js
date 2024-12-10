/* eslint-disable prettier/prettier */
import { configureStore } from '@reduxjs/toolkit'
import fabricatorSlice from './fabricatorSlice'
import projectSlice from './projectSlice'
import teamSlice from './teamSlice'
import tokenSlice from './tokenSlice'
import userSlice from './userSlice'
import taskSlice from './taskSlice'

const store = configureStore({
  reducer: {
    userData: userSlice,
    fabricatorData: fabricatorSlice,
    projectData: projectSlice,
    teamData: teamSlice,
    token: tokenSlice,
    taskData: taskSlice
  }
})
export default store
