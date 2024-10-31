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
  },
});

export const { SigninStart, SigninSuccess, SigninFailure } = userSlice.actions;
export default userSlice.reducer;
