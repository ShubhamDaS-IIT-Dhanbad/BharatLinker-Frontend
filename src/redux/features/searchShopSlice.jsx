// src/redux/shopSlice.js
import { createSlice } from '@reduxjs/toolkit';

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shops: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchShopsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchShopsSuccess(state, action) {
      state.shops = action.payload;
      state.loading = false;
    },
    fetchShopsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearShops(state) {
      state.shops = [];
    },
  },
});

export const {
  fetchShopsStart,
  fetchShopsSuccess,
  fetchShopsFailure,
  clearShops,
} = shopSlice.actions;

export const selectShops = (state) => state.shop.shops;
export const selectLoading = (state) => state.shop.loading;
export const selectError = (state) => state.shop.error;

export default shopSlice.reducer;
