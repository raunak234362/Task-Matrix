/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fabricatorData: []
}

const fabricatorSlice = createSlice({
  name: 'fabricatorData',
  initialState,
  reducers: {
    addFabricator: (state, action) => {
      state.fabricatorData.push(action.payload)
      localStorage.setItem('fabricatorData', JSON.stringify(state.fabricatorData))
    },
    showFabricators: (state, action) => {
      state.fabricatorData = action.payload
    },
    deleteFabricator: (state, action) => {
      state.fabricatorData = state.fabricatorData.filter(
        (fabricator) => fabricator.id !== action.payload
      )
    },
    updateFabricatorData: (state, action) => {
      state.fabricatorData = { ...state.fabricatorData, ...action.payload }
    }
  }
})

export const { addFabricator, showFabricators, deleteFabricator, updateFabricatorData } =
  fabricatorSlice.actions

export default fabricatorSlice.reducer
