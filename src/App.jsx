import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import SearchPage from './components/searchPage.jsx';
import ShopPage from './components/searchShop.jsx';
import SingleProduct from './components/singleProduct.jsx';
import SingleShop from './components/singleShop.jsx';
import Pincode from "./components/pincode.jsx";

import { useLocation } from "react-router-dom";
// RETAILER
import Retailer from './retailerComponent/retailer.jsx';
import RetailerLogin from './retailerComponent/retailerLogin.jsx';
import RetailerSignup from './retailerComponent/retailerSignup.jsx';
import ProtectedRoute from './components/protectedRouteRetailer.jsx';

import RetailerHomePageHeaderFooter from './retailerComponent/retailerHomePageHeaderFooter.jsx';
import RetailerProductHeaderFooter from './retailerComponent/retailerProductHeaderFooter.jsx';
import RetailerShopPage from './retailerComponent/retailerShopPage.jsx';

import RetailerUploadProduct from './retailerComponent/retailerUploadProduct.jsx';
import RetailerUpdateProduct from './retailerComponent/retailerUpdateProduct.jsx';

// ScrollToTop component
import ScrollToTop from './components/scrollToTop.jsx'; // Adjust the path as necessary

function App() {
  const [pincode, setPincode] = useState(null);

  return (
    <Router>
      <ScrollToTop />
      <RoutesWithConditionalHeader pincode={pincode} setPincode={setPincode} />
    </Router>
  );
}

function RoutesWithConditionalHeader({ pincode, setPincode }) {
  const location = useLocation();

  // Check if the path starts with `/retailer/` and matches specific subroutes
  const isRetailerHeaderFooter = location.pathname.startsWith('/retailer/home') ||
    location.pathname.startsWith('/retailer/shop') ||
    location.pathname.startsWith('/retailer/data');

  const isRetailerProductHeaderFooter = location.pathname.startsWith('/retailer/product') ||
    location.pathname.startsWith('/retailer/uploadproduct') ||
    location.pathname.startsWith('/retailer/updateproduct');

  const isHomepage = location.pathname === '/';

  return (
    <>
      {/* Show customer Header on homepage */}
      {isHomepage && <Header />}

      {/* Show RetailerHomePageHeaderFooter on specific retailer routes */}
      {isRetailerHeaderFooter && <RetailerHomePageHeaderFooter />}
      {isRetailerProductHeaderFooter&&<RetailerProductHeaderFooter />}

      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:productId" element={<SingleProduct />} />
        <Route path="/shop/:shopId" element={<SingleShop />} />
        <Route path="/pincode" element={<Pincode />} />

        {/* Retailer Routes */}
        <Route path='/retailer' element={<Retailer />} />
        <Route path='/retailer/login' element={<RetailerLogin />} />
        <Route path='/retailer/signup' element={<RetailerSignup />} />

        {/* PROTECTED ROUTES */}

        <Route path='/retailer/home' element={<ProtectedRoute><div>Retailer Home</div></ProtectedRoute>} />
        <Route path='/retailer/data' element={<ProtectedRoute><div>Retailer Data</div></ProtectedRoute>} />
        <Route path='/retailer/shop' element={<ProtectedRoute>< RetailerShopPage /></ProtectedRoute>} />
        <Route path='/retailer/product' element={<ProtectedRoute><div>product dashboard</div></ProtectedRoute>} />
        <Route path='/retailer/uploadproduct' element={<ProtectedRoute><RetailerUploadProduct/></ProtectedRoute>} />
        <Route path='/retailer/updateproduct' element={<ProtectedRoute><RetailerUpdateProduct/></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
