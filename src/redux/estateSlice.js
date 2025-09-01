// estateSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // estates: null, // List of estates
  selectedEstate: null, // Currently selected estate
};

const estateSlice = createSlice({
  name: "estate",
  initialState,
  reducers: {
    // setEstates: (state, action) => {
    //   state.selectedEstate = action.payload;
    // },
    setSelectedEstate: (state, action) => {
      state.selectedEstate = action.payload;
    },
  },
});

export const { setSelectedEstate } = estateSlice.actions;
export default estateSlice.reducer;
