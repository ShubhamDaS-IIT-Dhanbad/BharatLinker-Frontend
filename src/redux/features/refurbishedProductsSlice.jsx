// src/redux/features/refurbishedProductsSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { USER_PRODUCT_SERVER } from '../../../public/constant.js';

// Async thunk for fetching refurbished products
export const fetchRefurbishedProducts = createAsyncThunk(
  'refurbishedProducts/fetchRefurbishedProducts',
  async ({ searchQuery, selectedPincodes, page }) => {
    const response = await axios.get(
      `${USER_PRODUCT_SERVER}/product/getproducts?keyword=${searchQuery}&pincode=${selectedPincodes.join(',')}&page=${page}&limit=20`
    );
    return response.data; // Assuming response.data contains products and pagination info
  }
);

// Create slice for refurbished products
const refurbishedProductSlice = createSlice({
  name: 'refurbishedProducts',
  initialState: {
    items: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    error: null,
  },
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.loading = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMoreProducts = true; // Resetting hasMoreProducts when fetching new products
      state.error = null; // Reset error
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Set current page
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefurbishedProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(fetchRefurbishedProducts.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload.products]; // Append new products
        state.currentPage = action.payload.currentPage; // Assuming the API returns the current page
        state.totalPages = action.payload.totalPages; // Assuming the API returns total pages
        state.hasMoreProducts = state.currentPage < state.totalPages; // Check if more products are available
        state.loading = false;
      })
      .addCase(fetchRefurbishedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Capture error message
      });
  },
});

// Export actions
export const { resetProducts, setCurrentPage } = refurbishedProductSlice.actions;
export default refurbishedProductSlice.reducer;
