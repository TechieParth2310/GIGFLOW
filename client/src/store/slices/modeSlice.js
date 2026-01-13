import { createSlice } from '@reduxjs/toolkit';

// Get initial mode from localStorage, default to 'freelancer'
const getInitialMode = () => {
  try {
    const savedMode = localStorage.getItem('gigflow_mode');
    return savedMode === 'client' ? 'client' : 'freelancer';
  } catch (error) {
    return 'freelancer';
  }
};

const modeSlice = createSlice({
  name: 'mode',
  initialState: {
    mode: getInitialMode() // 'client' or 'freelancer'
  },
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
      // Persist to localStorage
      try {
        localStorage.setItem('gigflow_mode', action.payload);
      } catch (error) {
        console.error('Failed to save mode to localStorage:', error);
      }
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'client' ? 'freelancer' : 'client';
      // Persist to localStorage
      try {
        localStorage.setItem('gigflow_mode', state.mode);
      } catch (error) {
        console.error('Failed to save mode to localStorage:', error);
      }
    }
  }
});

export const { setMode, toggleMode } = modeSlice.actions;
export default modeSlice.reducer;
