import {configureStore} from '@reduxjs/toolkit';
import HomePageProductsSlice from '../features/homeProductSlice.jsx';
import shop from '../features/searchShopSlice.jsx';
import products from '../features/searchProductSlice.jsx';

const store=configureStore({
    reducer:{
        homepageproducts:HomePageProductsSlice,
        shop:shop,
        products:products
    }
});
export default store;