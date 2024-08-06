import { configureStore } from "@reduxjs/toolkit";
import fabricatorSlice from "./fabricatorSlice"
import projectSlice from "./projectSlice"
import teamSlice from "./teamSlice"
import tokenSlice from "./tokenSlice";
import userSlice from "./userSlice";

const store = configureStore({
    reducer: {
        userSlice:userSlice,
        fabricatorData: fabricatorSlice,
        projectData: projectSlice,
        teamData: teamSlice,
        token:tokenSlice
    },
});
export default store;