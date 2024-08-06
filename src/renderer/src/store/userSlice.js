import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {
    name: '',
    userName: '',
    email: '',
    password: '',
    role:''
  },
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
    addTask: (state, action) => {
      state.userData.tasks.push(action.payload);
    },
    removeTask: (state, action) => {
      state.userData.tasks = state.userData.tasks.filter(
        (task) => task.id !== action.payload
      );
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
  },
});

export const {
  setUserData,
  clearUserData,
  updateUserData,
  addTask,
  removeTask,
  login,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
