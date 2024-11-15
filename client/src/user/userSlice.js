import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SigninStart: (state) => {
      state.loading = true;
    },
    SigninSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    SigninFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateAvatar: (state, action) => {
      if (state.currentUser) {
        state.currentUser.avatar = action.payload;
      }
    },
  },
});

export const { SigninStart, SigninSuccess, SigninFailure, updateAvatar } =
  userSlice.actions;
export default userSlice.reducer;
