import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboards = await api.getLeaderboard();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  leaderboards: [],
  loading: false,
  error: null
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default leaderboardSlice.reducer;
