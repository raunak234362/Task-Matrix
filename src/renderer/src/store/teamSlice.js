import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    teamData:{
        name: '',
        created_by:'',
        leader:'',
        member:[],
    },
}

const teamSlice = createSlice({
    name:'teamData',
    initialState,
    reducers:{
        setTeamData: (state, action) => {
            state.teamData = { ...action.payload };
        },
        clearTeamData: (state) => {
            state.teamData = {
                name: '',
                created_by:'',
                leader:'',
                member:[],
            };
        },
        updateTeamData: (state, action) => {
            state.teamData = { ...state.teamData, ...action.payload };
        },
        addTeamMember: (state, action) => {
            state.teamData.teamMember={...action.payload};
        },
        removeTeamMember:(state)=>{
            state.teamData.teamMembers.pop();
        }
    }
})

export const {
    setTeamData,
    addTeamData,
    clearTeamData,
    updateTeamData,
    addTeamMember,
    removeTeamMember,
} = teamSlice.actions;

export default teamSlice.reducer;