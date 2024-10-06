import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { USER_PRODUCT_SERVER } from '../../../public/constant';

// Create a user slice with initial state and reducers
const userSlice = createSlice({
  name: 'user',
  initialState: {
    displayName: '',
    email: '',
    uid: '',
    isAuthenticated: false,
    products: [],
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    loading: false,  // Added loading state
    error: null,     // Added error state for better error handling
  },
  reducers: {
    setUserData: (state, action) => {
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.isAuthenticated = true;
    },
    clearUserData: (state) => {
      state.displayName = '';
      state.email = '';
      state.uid = '';
      state.isAuthenticated = false;
      state.products = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMoreProducts = true;
      state.loading = false;
      state.error = null;
    },
    clearUserProductData: (state) => {
      state.products = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMoreProducts = true;
      state.loading = false;
      state.error = null;
    },
    setUserProducts: (state, action) => {
      // Append new products to the existing list

      if (action.payload.currentPage > 1) {
        state.products = [...state.products, ...action.payload.products];

      } else { state.products = action.payload.products }
      state.currentPage = action.payload.currentPage; // Set current page based on fetched data
      state.totalPages = action.payload.totalPages;
      state.hasMoreProducts = state.currentPage < state.totalPages;
      state.loading = false;  // Stop loading when products are set
      state.error = null;     // Clear error if the fetch was successful
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false; // Stop loading on error
    },
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Update to the provided page number
    },
  },
});

// Async action to fetch products by user ID and page number
export const fetchProductsByUserId = (userId, page, query) => async (dispatch) => {
  if (userId) {
    dispatch(setLoading(true));  // Set loading to true when the request starts
    try {
      // Encode the query to ensure proper URL formatting
      const response = await axios.get(
        `${USER_PRODUCT_SERVER}/product/getproductbyuid?keyword=${query}&userId=${userId}&page=${page}`
      );
      const { products, totalPages } = response.data; // Assume totalPages comes from the response
      dispatch(setUserProducts({ products, currentPage: page, totalPages })); // Pass the page number directly
    } catch (error) {
      dispatch(setError('Error fetching products'));
      console.error('Error fetching products:', error);
    } finally {
      dispatch(setLoading(false)); // Set loading to false when the request ends
    }
  }
};


// Export the actions to be used in components
export const {
  clearUserProductData,
  setUserData,
  clearUserData,
  setUserProducts,
  setLoading,
  setError,
  updateCurrentPage,
} = userSlice.actions;

// Export the reducer to be added to the store
export default userSlice.reducer;
