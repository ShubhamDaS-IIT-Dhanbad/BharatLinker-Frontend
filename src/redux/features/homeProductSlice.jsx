import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RETAILER_PRODUCT_SERVER } from '../../../public/constant.js';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ selectedPincodes, page }) => {
        const response = await axios.get(
            `${RETAILER_PRODUCT_SERVER}/product/gethomepageproducts?pincode=${selectedPincodes.join(',')}&page=${page}&limit=20`
        );
        return response.data; // This should return both products and totalPages
    }
);

const initialState = {
    products: [], // Store all fetched products
    loading: false,
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    error: null,
};

const productsSlice = createSlice({
    name: 'homepageproducts',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload; // Update currentPage
        },
        resetProducts: (state) => {
            state.products = []; // Reset products array
            state.currentPage = 1; // Reset to the first page
            state.totalPages = 1; // Reset total pages
            state.hasMoreProducts = true; // Reset the flag for more products
            state.error = null; // Clear any errors
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true; // Set loading to true
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { products, totalPages } = action.payload; // Expecting products and totalPages from response

                if (products.length > 0) {
                    // Filter out duplicate products by checking their unique IDs
                    const newProducts = products.filter(
                        (product) => !state.products.some(existingProduct => existingProduct._id === product._id)
                    );

                    // Append new, non-duplicate products to the existing products array
                    state.products = [...state.products, ...newProducts];

                    // Update total pages and check for more products
                    state.totalPages = totalPages;
                    state.hasMoreProducts = state.currentPage < totalPages; // Check if more products are available
                } else {
                    state.hasMoreProducts = false; // No more products available
                }

                state.loading = false; // Set loading to false after fetch is complete
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false; // Set loading to false on error
                state.error = action.error.message; // Set error message
                state.hasMoreProducts = false; // Mark that no more products can be fetched
            });
    },
});

// Exporting actions and reducer
export const { setCurrentPage, resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
