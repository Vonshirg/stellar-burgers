import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestState, TFeedState } from '@utils-types';
import { getFeedsApi } from '@api';

export const getFeed = createAsyncThunk('feed/getFeed', async () => {
  const feed = await getFeedsApi();
  return feed;
});

export const initialState: TFeedState = {
  status: RequestState.Pending,
  orders: [],
  total: 0,
  totalToday: 0
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.fulfilled, (state, action) => {
        state.status = RequestState.Success;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeed.pending, (state) => {
        state.status = RequestState.Loading;
      })
      .addCase(getFeed.rejected, (state) => {
        state.status = RequestState.Failed;
      });
  },
  selectors: {
    feedDataSelector: (state) => state.orders,
    feedTotalSelector: (state) => state.total,
    feedTodaySelector: (state) => state.totalToday,
    feedStatusSelector: (state) => state.status
  }
});

export const {
  feedDataSelector,
  feedTotalSelector,
  feedTodaySelector,
  feedStatusSelector
} = feedSlice.selectors;
