import { createSlice } from '@reduxjs/toolkit';

const pincodeSlice = createSlice({
  name: 'pincodestate',
  initialState: {
    isUpdatedPincode: true,
    isUpdatedProduct: false, 
    isUpdatedShop: false, 
  },
  reducers: {
    updatePincode: (state, action) => {
      state.isUpdatedPincode = false;
    },
    updateProduct: (state) => {
      state.isUpdatedProduct = true; 
    },
    updateShop: (state) => {
      state.isUpdatedShop = true;
    },

    reupdateProduct: (state) => {
        state.isUpdatedProduct = false; 
      },
      reupdateShop: (state) => {
        state.isUpdatedShop = false;
      }
  },
});

export const {
  updatePincode,
  updateProduct,
  updateShop,
  reupdateProduct,
  reupdateShop,
} = pincodeSlice.actions;

export default pincodeSlice.reducer;
