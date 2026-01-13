import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bidsAPI } from '../../services/api';

export const fetchBidsByGig = createAsyncThunk(
  'bids/fetchBidsByGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.getBidsByGig(gigId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bids'
      );
    }
  }
);

export const createBid = createAsyncThunk(
  'bids/createBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.createBid(bidData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      return rejectWithValue({
        message: errorData?.message || 'Failed to create bid',
        errors: errorData?.errors || null
      });
    }
  }
);

export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.getMyBids();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bids'
      );
    }
  }
);

export const hireFreelancer = createAsyncThunk(
  'bids/hireFreelancer',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.hireFreelancer(bidId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to hire freelancer'
      );
    }
  }
);

export const fetchBidCount = createAsyncThunk(
  'bids/fetchBidCount',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.getBidCount(gigId);
      return { gigId, count: response.data.count };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bid count'
      );
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
    loading: false,
    error: null
  },
  reducers: {
    clearBids: (state) => {
      state.bids = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    updateBidStatus: (state, action) => {
      const { bidId, status } = action.payload;
      const bid = state.myBids.find(b => b._id === bidId);
      if (bid) {
        bid.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch bids by gig
      .addCase(fetchBidsByGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBidsByGig.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload.data;
      })
      .addCase(fetchBidsByGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.loading = false;
        state.bids.push(action.payload.data);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my bids
      .addCase(fetchMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = action.payload.data;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hire freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true;
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false;
        const bid = state.bids.find(b => b._id === action.payload.data._id);
        if (bid) {
          bid.status = 'hired';
        }
        // Update all other bids to rejected
        state.bids.forEach(b => {
          if (b._id !== action.payload.data._id && b.status === 'pending') {
            b.status = 'rejected';
          }
        });
      })
      .addCase(hireFreelancer.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { clearBids, clearError, updateBidStatus } = bidSlice.actions;
export default bidSlice.reducer;
