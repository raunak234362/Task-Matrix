/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fabricatorData: {
    name: '',
    contactPerson: '',
    contactPhone: '',
    contactCountry: '',
    contactState: '',
    contactCity: '',
    contract: ''
  }
}

const fabricatorSlice = createSlice({
  name: 'fabricator',
  initialState,
  reducers: {
    loadFabricator: (state, action) => {
      state.fabricatorData = action.payload
    },
    addFabricator: (state, action) => {
      state.fabricatorData.push(action.payload)
    },
    updateFabricator(state, action) {
      const updatedFabricator = action.payload
      state.fabricatorData = state.fabricatorData.map((fabricator) =>
        fabricator.id === updatedFabricator.id ? updatedFabricator : fabricator
      )
    }
  }
})

export const { loadFabricator, addFabricator, updateFabricator } = fabricatorSlice.actions

export default fabricatorSlice.reducer
