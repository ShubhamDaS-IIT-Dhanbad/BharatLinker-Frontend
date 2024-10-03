import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RETAILER_PRODUCT_SERVER } from '../../../public/constant.js';

const initialState = {
    products: [],
    loading: false,
    hasMoreProducts: true,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params) => {
        const { inputValue, page, productsPerPage, selectedPincodes, selectedCategories, selectedBrands, showSortBy } = params;
        const response = await axios.get(
            `${RETAILER_PRODUCT_SERVER}/product/getproducts?pincode=${selectedPincodes.join(',')}&keyword=${inputValue}&page=${page}&limit=${productsPerPage}&categories=${selectedCategories.join(',')}&brand=${selectedBrands}&sort=${showSortBy}`
        );
        return response.data;
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetProducts: (state) => {
            state.products = [];
            state.hasMoreProducts = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { products } = action.payload;

                if (products && products.length > 0) {
                    // Filter out duplicates based on a unique identifier (e.g., product ID)
                    const uniqueProducts = products.filter(
                        (product) => !state.products.some((existingProduct) => existingProduct._id === product._id)
                    );

                    // If there are unique products, add them to the state
                    if (uniqueProducts.length > 0) {
                        state.products = [...state.products, ...uniqueProducts];
                    }
                } else {
                    state.hasMoreProducts = false;
                }
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
