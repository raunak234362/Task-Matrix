import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fabricatorData: {
    name:"",
    contactPerson:"",
    contactPhone:"",
    contactCountry:"",
    contactState:"",
    contactCity:"",
    contract:""
  },
};

const fabricatorSlice = createSlice({
    name: 'fabricator',
    initialState,
    reducers: {
        setFabricatorData: (state, action) => {
            state.fabricatorData = { ...action.payload };
        },
        clearFabricatorData: (state) => {
            state.fabricatorData = {
                contactPerson:"",
                contactPhone:"",
                contactCountry:"",
                contactState:"",
                contactCity:"",
                contract:""
            };
        },
        updateFabricatorData: (state, action) => {
            state.fabricatorData = { ...state.fabricatorData, ...action.payload };
        },
    },
});

export const {
    setFabricatorData,
    clearFabricatorData,
    updateFabricatorData,
} = fabricatorSlice.actions;

export default fabricatorSlice.reducer;
