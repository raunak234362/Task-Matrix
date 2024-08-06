// projectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projectData: {
        name: "",
        fabricator: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "",
        stage: "",
        team: "",
        manager:"",
    },
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProjectData: (state, action) => {
            state.projectData = { ...action.payload };
        },
        
        clearProjectData: (state) => {
            state.projectData = {
                name: "",
                fabricator: "",
                description: "",
                startDate: "",
                endDate: "",
                status: "",
                stage: "",
                team: "",
                manager:""
            };
        },
        updateProjectData: (state, action) => {
            state.projectData = { ...state.projectData, ...action.payload };
        },
       
    },
});

export const {
    setProjectData,
    clearProjectData,
    updateProjectData
} = projectSlice.actions;

export default projectSlice.reducer;
