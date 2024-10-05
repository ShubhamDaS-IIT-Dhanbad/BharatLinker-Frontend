import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RETAILER_SERVER } from '../../../public/constant.js';

// Utility function to get cookie
export const getBharatLinkerRetailerCookie = () => {
    const cookieName = 'BharatLinkerRetailer=';
    const cookieArray = document.cookie.split('; ');
    const foundCookie = cookieArray.find(row => row.startsWith(cookieName));
    return foundCookie ? JSON.parse(decodeURIComponent(foundCookie.split('=')[1])) : null;
};

// Async actions for fetching, updating, uploading, and deleting shop data
export const fetchShopData = createAsyncThunk(
    'shop/fetchShopData',
    async (shopId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RETAILER_SERVER}/shop/getshopdetails?shopId=${shopId}`);
            return response.data.shop;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateShopData = createAsyncThunk(
    'shop/updateShopData',
    async ({ shopId, updatedShop }, { rejectWithValue }) => {
        try {
            constresponse = await axios.post(`${RETAILER_SERVER}/shop/updateshopdata?shopId=${shopId}`, updatedShop);
            return response.data.shop;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const uploadShopImage = createAsyncThunk(
    'shop/uploadShopImage',
    async ({ shopId, file }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('shopId', shopId);
        formData.append('images', file);

        try {
            const response = await axios.post(`${RETAILER_SERVER}/shop/uploadshopimage`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.images[0];
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteShopImage = createAsyncThunk(
    'shop/deleteShopImage',
    async ({ shopId, imageUrl }, { rejectWithValue }) => {
        const deleteUrl = `${RETAILER_SERVER}/shop/deleteshopimage?shopId=${shopId}&imageUrl=${encodeURIComponent(imageUrl)}`;
        try {
            await axios.delete(deleteUrl);
            return imageUrl;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Initial state
const initialState = {
    shop: null,
    shopImages: [],
    pincodes: [],
    loading: false,
    error: null,
};

const retailerSlice = createSlice({
    name: 'retailer',
    initialState,
    reducers: {
        addPincode: (state, action) => {
            if (state.pincodes.length < 5) {
                state.pincodes = [...state.pincodes, action.payload]; 
                state.shop.pinCodes=state.pincodes
            }
        },
        removePincode: (state, action) => {
            state.pincodes = state.pincodes.filter((_, i) => i !== action.payload); // Immutably remove the pincode
            if (state.pincodes.length < 5) {
                state.pincodes = [...state.pincodes]; 
                state.shop.pinCodes=state.pincodes
            }
        },
    },    
    extraReducers: (builder) => {
        builder
            .addCase(fetchShopData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShopData.fulfilled, (state, action) => {
                state.shop = action.payload;
                state.shopImages = action.payload.shopImages || [];
                state.pincodes = action.payload.pinCodes || [];
                state.loading = false;
            })
            .addCase(fetchShopData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateShopData.fulfilled, (state, action) => {
                state.shop = action.payload;
                state.shopImages = action.payload.shopImages || [];
                state.pincodes = action.payload.pinCodes || [];
            })
            .addCase(uploadShopImage.fulfilled, (state, action) => {
                state.shopImages.push(action.payload);
            })
            .addCase(deleteShopImage.fulfilled, (state, action) => {
                state.shopImages = state.shopImages.filter((img) => img !== action.payload);
            });
    },
});

// Selectors
export const selectShop = (state) => state.retailer.shop;
export const selectShopImages = (state) => state.retailer.shopImages;
export const selectPincodes = (state) => state.retailer.pincodes;
export const selectLoading = (state) => state.retailer.loading;
export const selectError = (state) => state.retailer.error;

// Export actions and reducer
export const { addPincode, removePincode } = retailerSlice.actions;
export default retailerSlice.reducer;

