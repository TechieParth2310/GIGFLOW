import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gigsAPI } from '../../services/api';

export const fetchGigs = createAsyncThunk(
  'gigs/fetchGigs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.getGigs(filters);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch gigs. Please check if the server is running.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGig = createAsyncThunk(
  'gigs/fetchGig',
  async (id, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.getGig(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch gig'
      );
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.createGig(gigData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      return rejectWithValue({
        message: errorData?.message || 'Failed to create gig',
        errors: errorData?.errors || null
      });
    }
  }
);

export const fetchMyGigs = createAsyncThunk(
  'gigs/fetchMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.getMyGigs();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch my gigs'
      );
    }
  }
);

export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.deleteGig(gigId);
      return { gigId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete gig'
      );
    }
  }
);

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    myGigs: [],
    currentGig: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  },
  reducers: {
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch gigs
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload.items || action.payload.data || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0
        };
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single gig
      .addCase(fetchGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGig.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGig = action.payload.data;
      })
      .addCase(fetchGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs.unshift(action.payload.data);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my gigs
      .addCase(fetchMyGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = action.payload.data || [];
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete gig
      .addCase(deleteGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.loading = false;
        // Remove deleted gig from myGigs
        state.myGigs = state.myGigs.filter(gig => gig._id !== action.payload.gigId);
        // Remove from gigs list if present
        state.gigs = state.gigs.filter(gig => gig._id !== action.payload.gigId);
        // Clear currentGig if it was deleted
        if (state.currentGig && state.currentGig._id === action.payload.gigId) {
          state.currentGig = null;
        }
      })
      .addCase(deleteGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentGig, clearError } = gigSlice.actions;
export default gigSlice.reducer;
