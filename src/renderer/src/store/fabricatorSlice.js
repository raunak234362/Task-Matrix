import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fabricatorData: [],
  clientData: [],
};

const fabricatorSlice = createSlice({
  name: "fabricatorData",
  initialState,
  reducers: {
    addFabricator: (state, action) => {+
      state.fabricatorData.push(action.payload);
    },
    loadFabricator: (state, action) => {
      state.fabricatorData = action.payload;
    },
    updateFabricator(state, action) {
      const updatedFabricator = action.payload;
      state.fabricatorData = state.fabricatorData.map((fabricator) =>
        fabricator.id === updatedFabricator.id ? updatedFabricator : fabricator
      );
    },
    addBranchToFabricator(state, action) {
      const { fabricatorId, branchData } = action.payload;

      state.fabricatorData = state.fabricatorData.map((fabricator) =>
        fabricator.id === fabricatorId
          ? {
              ...fabricator,
              branch: fabricator.branch
                ? [...fabricator.branch, branchData]
                : [branchData],
            }
          : fabricator
      );
    },
    updateFabricatorBranch(state, action) {
      const { fabricatorId, branchData } = action.payload;

      state.fabricatorData = state.fabricatorData.map((fabricator) =>
        fabricator.id === fabricatorId
          ? {
              ...fabricator,
              branch: fabricator.branch
                ? [...fabricator.branch, branchData]
                : [branchData],
            }
          : fabricator
      );
    },
    addClient: (state, action) => {
      state.clientData.push(action.payload);
    },
    showClient: (state, action) => {
      state.clientData = action.payload;
    },
    deleteFabricator: (state, action) => {
      state.fabricatorData = state.fabricatorData.filter(
        (fabricator) => fabricator.id !== action.payload
      );
    },
  },
});

export const {
  addFabricator,
  loadFabricator,
  updateFabricator,
  addBranchToFabricator,
  updateFabricatorBranch,
  deleteFabricator,
  addClient,
  showClient,
} = fabricatorSlice.actions;

export default fabricatorSlice.reducer;
