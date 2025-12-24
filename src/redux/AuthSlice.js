import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login action - syncs to localStorage
    logindispatch: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload?.data?.token;

      // Sync token and user ID to localStorage
      if (action.payload?.data?.token) {
        localStorage.setItem("token", action.payload.data.token);

        // Store user ID for validation (adjust path based on your response structure)
        const userId =
          action.payload.data.user?.id ||
          action.payload.data.user?._id ||
          action.payload.data.id ||
          action.payload.data._id;

        if (userId) {
          localStorage.setItem("userId", userId);
        }
      }
    },

    // Logout action - clears everything
    mainlogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },

    // Alternative logout alias (if needed elsewhere)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
});

export const { logindispatch, mainlogout, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
