import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RETAILER_SERVER } from '../../../public/constant.js';

// Async thunk to fetch shops
export const fetchShops = createAsyncThunk(
    'shops/fetchShops',
    async ({ inputValue, selectedCategories, selectedBrands, selectedPincodes, page, shopsPerPage }) => {
        console.log(selectedPincodes);
        const response = await axios.get(
            `${RETAILER_SERVER}/shop/getshops?pincode=${selectedPincodes.join(',')}&keyword=${inputValue}&categories=${selectedCategories.join(',')}&brand=${selectedBrands.join(',')}&page=${page}&limit=${shopsPerPage}`
        );
        return response.data;
    }
);

const initialState = {
    shops: [], // Store all fetched shops
    loading: false,
    currentPage: 1,
    totalPages: 1,
    hasMoreShops: true,
    error: null,
};

const shopsSlice = createSlice({
    name: 'searchshops',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetShops: (state) => {
            state.shops = []; // Reset shops array
            state.currentPage = 1; // Reset to the first page
            state.totalPages = 1; // Reset total pages
            state.hasMoreShops = true; // Reset the flag for more shops
            state.error = null; // Clear any errors
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShops.pending, (state) => {
                state.loading = true; // Set loading to true
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchShops.fulfilled, (state, action) => {
                const { shops, totalPages } = action.payload; 

                if (shops.length > 0) {
                    // Filter out duplicate shops by checking their unique IDs
                    const newShops = shops.filter(
                        (shop) => !state.shops.some(existingShop => existingShop._id === shop._id)
                    );

                    // Append new, non-duplicate shops to the existing shops array
                    state.shops.push(...newShops);

                    // Update total pages and check for more shops
                    state.totalPages = totalPages;
                    state.hasMoreShops = state.currentPage < totalPages; // Check if more shops are available
                } else {
                    state.hasMoreShops = false; // No more shops available
                }
                state.loading = false;
            })
            .addCase(fetchShops.rejected, (state, action) => {
                state.loading = false; // Set loading to false on error
                state.error = action.error?.message || 'Something went wrong'; // Set error message
                state.hasMoreShops = false; // Mark that no more shops can be fetched
            });
    },
});

// Selectors
export const selectShops = (state) => state.searchshops.shops;
export const selectLoading = (state) => state.searchshops.loading;
export const selectCurrentPage = (state) => state.searchshops.currentPage;
export const selectError = (state) => state.searchshops.error;

// Exporting actions and reducer
export const { setCurrentPage, resetShops } = shopsSlice.actions;
export default shopsSlice.reducer;
