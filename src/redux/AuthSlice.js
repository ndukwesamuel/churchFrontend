import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
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
  },
});

export const { logindispatch, mainlogout } = AuthSlice.actions;
export default AuthSlice.reducer;
