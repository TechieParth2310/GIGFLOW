import { createSlice } from '@reduxjs/toolkit';

// Load theme from localStorage - FORCE dark mode as default
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    // FORCE dark mode if no saved preference OR if saved is not explicitly 'light'
    const theme = (saved === 'light') ? 'light' : 'dark';
    
    // Apply theme class immediately and aggressively
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // If no saved preference, save dark as default
    if (!saved) {
      localStorage.setItem('theme', 'dark');
    }
    
    return theme;
  }
  return 'dark'; // Default to dark
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme()
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode);
        // Apply theme class immediately
        if (state.mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode);
        if (state.mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
