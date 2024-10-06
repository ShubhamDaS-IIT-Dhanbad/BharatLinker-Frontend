import {configureStore} from '@reduxjs/toolkit';
import user from '../features/userSlice.jsx';
import HomePageProductsSlice from '../features/homeProductSlice.jsx';
import shop from '../features/searchShopSlice.jsx';
import searchproducts from '../features/searchProductSlice.jsx';
import searchshops from '../features/searchShopSlice.jsx'
import retailer from '../features/retailerDataSlice.jsx'
import pincodestate from '../features/pincodeUpdatedSlice.jsx'
import refurbishedProducts from '../features/refurbishedProductsSlice.jsx'

const store=configureStore({
    reducer:{
        user:user,
        homepageproducts:HomePageProductsSlice,
        shop:shop,
        searchproducts:searchproducts,
        searchshops:searchshops,
        retailer:retailer,
        pincodestate:pincodestate,
        refurbishedProducts:refurbishedProducts
    }
});
export default store;