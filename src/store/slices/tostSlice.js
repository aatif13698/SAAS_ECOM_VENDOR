// src/features/toast/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const id = Date.now();
      state.toasts.push({
        id,
        message: action.payload.message,
        variant: action.payload.variant || 'default',
        duration: action.payload.duration ?? 4000,
      });
    },

    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;