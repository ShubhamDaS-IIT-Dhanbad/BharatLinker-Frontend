import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import Retailer from './retailerComponent/retailer.jsx';
import SearchPage from './components/searchPage.jsx';
import ShopPage from './components/searchShop.jsx';
import SingleProduct from './components/singleProduct.jsx';
import SingleShop from './components/singleShop.jsx';
import Pincode from "./components/pincode.jsx";
import { useLocation } from "react-router-dom";
import { useUserLocation } from './hooks/useUserLocation.jsx';
import { useUserPincode } from './hooks/useUserPincode.jsx';
import ScrollToTop from './components/scrollToTop.jsx';
import RetailerRoutes from './retailerComponent/retailerRoutes.jsx';



import RetailerHomePageHeaderFooter from './retailerComponent/retailerHomePageHeaderFooter.jsx';
import RetailerProductHeaderFooter from './retailerComponent/retailerProductHeaderFooter.jsx';


function App() {
  const { address, userPincodes} = useUserLocation();
  const { inputValue, handleInputChange, handleAddPincode, togglePincodeSelection, handleDeletePincode } = useUserPincode(userPincodes);

  return (
    <Router>
      <ScrollToTop />
      <RoutesWithConditionalHeader
        address={address}
        userPincodes={userPincodes}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        handleAddPincode={handleAddPincode}
        togglePincodeSelection={togglePincodeSelection}
        handleDeletePincode={handleDeletePincode}
      />
    </Router>
  );
}

function RoutesWithConditionalHeader({ address}) {
  const location = useLocation();

  const isRetailerHeaderFooter = location.pathname.startsWith('/retailer/home') || location.pathname.startsWith('/retailer/shop') || location.pathname.startsWith('/retailer/data');
  const isRetailerProductHeaderFooter = location.pathname.startsWith('/retailer/product') || location.pathname.startsWith('/retailer/uploadproduct') || location.pathname.startsWith('/retailer/updateproduct');
  const isHomepage = location.pathname === '/';

  return (
    <>
      {isHomepage && <Header address={address} />}
      {isRetailerHeaderFooter && <RetailerHomePageHeaderFooter />}
      {isRetailerProductHeaderFooter && <RetailerProductHeaderFooter />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:productId" element={<SingleProduct />} />
        <Route path="/shop/:shopId" element={<SingleShop />} />
        <Route path="/pincode" element={<Pincode/>}/>
        <Route path='/retailer' element={<Retailer />} />
        <Route path="/*" element={<RetailerRoutes />} />
      </Routes>
    </>
  );
}

export default App;
