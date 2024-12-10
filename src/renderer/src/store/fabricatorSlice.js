/* eslint-disable prettier/prettier */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fabricatorData: [],
};

const fabricatorSlice = createSlice({
  name: "fabricator",
  initialState,
  reducers: {
    showFabricator: (state, action) => {
      state.fabricatorData = action.payload;
    },
    addFabricator: (state, action) => {
      state.fabricatorData.push(action.payload);
    },
    deleteFabricator: (state, action) => {
      state.fabricatorData = state.fabricatorData.filter(
        (fabricator) => fabricator.id !== action.payload,
      );
    },
    updateFabricatorData: (state, action) => {
      state.fabricatorData = { ...state.fabricatorData, ...action.payload };
    },
  },
});

export const {
  showFabricator,
  addFabricator,
  updateFabricatorData,
  deleteFabricator,
} = fabricatorSlice.actions;

export default fabricatorSlice.reducer;
