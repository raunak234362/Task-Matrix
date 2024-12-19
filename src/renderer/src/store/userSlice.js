/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {},
  staffData:[],
  auth: {
    status: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = { ...action.payload };
    },
    clearUserData: (state) => {
      state.userData = {
        name: '',
        userName: '',
        email: '',
        password: '',
        role:''
      };
    },
    updateUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
 
    login: (state,action) => {
      state.userData.token =action.payload.token;
      state.userData.userType =action.payload.userType;
      state.auth.status = true;
    },
    logout: (state) => {
      state.userData = {
        tasks: [],
        token: null,
        userType: null,
      };
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userType');
      state.auth.status = false;
    },
    addStaff:(state,action)=>{
      state.staffData.push(action.payload)
    },
    showStaff:(state,action)=>{
      state.staffData = action.payload
    },
    deleteStaff: (state, action) => {
      state.projectData = state.projectData.filter((project) => project.id !== action.payload)
    },
    updateStaffData: (state, action) => {
      state.projectData = { ...state.projectData, ...action.payload }
    }
  },
});

export const {
  setUserData,
  clearUserData,
  updateUserData,
  addStaff,
  showStaff,
  deleteStaff,
  updateStaffData,
  login,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
