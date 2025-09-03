import { createSlice } from "@reduxjs/toolkit";
import { Church } from "lucide-react";

const initialState = {
  isAuthenticated: false,
  user: null,
  ChurchProfile: null,
  //   token: null,
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    logindispatch: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      //   state.token = action.payload.token;
    },
    mainlogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    ChurchProfile: (state, action) => {
      state.ChurchProfile = action.payload.members;
    },
  },
});

export const { logindispatch, mainlogout } = AuthSlice.actions;
export default AuthSlice.reducer;
