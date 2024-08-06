// projectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    taskData: {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "",
        stage: "",
        manager: "",
        team:"",
        fabricator:"",
        project:""
    },
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setTaskData: (state, action) => {
            state.taskData = { ...action.payload };
        },
        
        clearTaskData: (state) => {
            state.taskData = {
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                status: "",
                stage: "",
                manager: "",
                team:"",
                fabricator:"",
                project:""
            };
        },
        updateTaskData: (state, action) => {
            state.taskData = { ...state.taskData, ...action.payload };
        },
    },
});

export const {
    setTaskData,
    clearTaskData,
    updateTaskData
} = taskSlice.actions;

export default taskSlice.reducer;
