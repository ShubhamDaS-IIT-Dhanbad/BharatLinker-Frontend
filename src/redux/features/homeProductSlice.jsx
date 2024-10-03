import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RETAILER_PRODUCT_SERVER } from '../../../public/constant.js';

const initialState = {
    products: {}, // Store products by page number
    loading: false,
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    error: null,
};

// Asynchronous thunk for fetching products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ selectedPincodes, page }) => {
        const response = await axios.get(
            `${RETAILER_PRODUCT_SERVER}/product/gethomepageproducts?pincodes=${selectedPincodes}&page=${page}&limit=10`
        );
        return response.data;
    }
);

const productsSlice = createSlice({
    name: 'homepageproducts',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload; // Update currentPage
        },
        resetProducts: (state) => {
            state.products = {};
            state.currentPage = 1; // Reset to first page
            state.totalPages = 1;
            state.hasMoreProducts = true;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { products, totalPages } = action.payload;

                if (products.length > 0) {
                    // Store products in a dictionary by page number
                    state.products[state.currentPage] = products;
    
                    // Update total pages and loading status
                    state.totalPages = totalPages;
                    state.hasMoreProducts = state.currentPage < totalPages; // Check if more products are available
                    state.currentPage+=1;
                    
                } else {
                    state.hasMoreProducts = false; // No more products available
                }

                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.hasMoreProducts = false; // Mark that no more products can be fetched
            });
    },
});

export const { setCurrentPage, resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
