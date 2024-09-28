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
  const isHomepage = location.pathname === '/';

  return (
    <>
      {isHomepage && <Header />}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:productId" element={<SingleProduct />} />
        <Route path="/shop/:shopId" element={<SingleShop />} />
        <Route path="/pincode" element={<Pincode />} />

        {/* RETAILER */}
        <Route path='/retailer' element={<Retailer />} />
        <Route path='/retailer/login' element={<RetailerLogin />} />
        <Route path='/retailer/signup' element={<RetailerSignup />} />
        {/* PROTECTED ROUTES */}
        <Route path='/retailer/home' element={<>hi</>} />
      </Routes>
    </>
  );
}

export default App;
