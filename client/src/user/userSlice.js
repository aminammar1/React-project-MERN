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
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  SigninStart,
  SigninSuccess,
  SigninFailure,
  updateAvatar,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
