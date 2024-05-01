// clientSlice.js
import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    data: {}, // Change this to an object
    loading: false,
    adding: false,
    updating: false,
    error: null,
  },
  reducers: {
    addClientPending: (state) => {
      state.adding = true;
      state.error = null;
    },
    addClientSuccess: (state, action) => {
      // Assuming payload is an object, not an array
      state.data = action.payload;
      state.adding = false;
      state.error = null;
    },
    addClientFailure: (state, action) => {
      state.adding = false;
      state.error = action.payload;
    },
    getClientByIdPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    getClientByIdSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    getClientByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateClientPending: (state) => {
      state.updating = true;
      state.error = null;
    },
    updateClientSuccess: (state, action) => {
      // Assuming payload is an object, not an array
      state.data = action.payload;
      state.updating = false;
      state.error = null;
    },
    updateClientFailure: (state, action) => {
      state.updating = false;
      state.error = action.payload;
    },
  },
});

export const {
  addClientPending,
  addClientSuccess,
  addClientFailure,
  getClientByIdPending,
  getClientByIdSuccess,
  getClientByIdFailure,
  updateClientPending,
  updateClientSuccess,
  updateClientFailure,
} = clientSlice.actions;
export default clientSlice.reducer;
