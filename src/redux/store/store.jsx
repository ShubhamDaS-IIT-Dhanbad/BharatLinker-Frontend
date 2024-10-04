import {configureStore} from '@reduxjs/toolkit';
import HomePageProductsSlice from '../features/homeProductSlice.jsx';
import shop from '../features/searchShopSlice.jsx';
import searchproducts from '../features/searchProductSlice.jsx';
import searchshops from '../features/searchShopSlice.jsx'

const store=configureStore({
    reducer:{
        homepageproducts:HomePageProductsSlice,
        shop:shop,
        searchproducts:searchproducts,
        searchshops:searchshops
    }
});
export default store;