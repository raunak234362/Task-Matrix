import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: false,
  userData: {},
  departmentData: [],
  staffData: []
}

const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    login: (state, action) => {
      // state.token = action.payload.token;
      state.userData = action.payload
      sessionStorage.setItem('token', action.payload.token)
    },
    setUserData: (state, action) => {
      state.token = action.payload.token
      state.userData = action.payload
    },
    addStaff: (state, action) => {
      state.staffData.push(action.payload)
    },
    showStaff: (state, action) => {
      state.staffData = action.payload
    },
    addDepartment: (state, action) => {
      state.departmentData.push(action.payload)
    },
    showDepartment: (state, action) => {
      state.departmentData = action.payload
    },
    logout: (state) => {
      state.token = false
      state.userData = null
      sessionStorage.removeItem('token')
    },
    updatetoken: (state, action) => {
      state.token = action.payload.token
      sessionStorage.setItem('token', action.payload.token)
    }
  }
})

export const {
  login,
  showStaff,
  addStaff,
  setUserData,
  addDepartment,
  showDepartment,
  updatetoken,
  logout
} = userSlice.actions

export default userSlice.reducer
