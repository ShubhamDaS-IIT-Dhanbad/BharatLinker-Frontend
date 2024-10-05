import React, { useMemo, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";  // Import GA4

import Header from './components/header.jsx';
import ScrollToTop from './components/scrollToTop.jsx';
import { useUserLocation } from './hooks/useUserLocation.jsx';
import { useUserPincode } from './hooks/useUserPincode.jsx';
import RetailerRoutes from './retailerComponent/retailerRoutes.jsx';
import RetailerHomePageHeaderFooter from './retailerComponent/retailerHomePageHeaderFooter.jsx';
import RetailerProductHeaderFooter from './retailerComponent/retailerProductHeaderFooter.jsx';

import Home from './components/home.jsx';
import Retailer from './retailerComponent/retailer.jsx';
import SearchPage from './components/searchPage.jsx';
import ShopPage from './components/searchShop.jsx';
import SingleProduct from './components/singleProduct.jsx';
import SingleShop from './components/singleShop.jsx';
import Pincode from './components/pincode.jsx';

function App() {
  const { address, userPincodes } = useUserLocation();
  const { inputValue, handleInputChange, handleAddPincode, togglePincodeSelection, handleDeletePincode } = useUserPincode(userPincodes);

  useEffect(() => {
    // Initialize Google Analytics with your Measurement ID
    ReactGA.initialize("G-VEKMNYQYQ1"); // Replace with your GA4 Measurement ID
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <RoutesWithConditionalHeader
          address={address}
          userPincodes={userPincodes}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleAddPincode={handleAddPincode}
          togglePincodeSelection={togglePincodeSelection}
          handleDeletePincode={handleDeletePincode}
        />
      </Suspense>
    </Router>
  );
}

const RoutesWithConditionalHeader = React.memo(({ address }) => {
  const location = useLocation();  // Moved this hook inside the component that is wrapped by <Router>

  useEffect(() => {
    // Send pageview event to GA4 whenever the route changes
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  const { isRetailerHeaderFooter, isRetailerProductHeaderFooter, isHomepage } = useMemo(() => {
    return {
      isRetailerHeaderFooter: location.pathname.startsWith('/retailer/home') ||
        location.pathname.startsWith('/retailer/shop') ||
        location.pathname.startsWith('/retailer/data'),
      isRetailerProductHeaderFooter: location.pathname.startsWith('/retailer/product') ||
        location.pathname.startsWith('/retailer/uploadproduct') ||
        location.pathname.startsWith('/retailer/updateproduct'),
      isHomepage: location.pathname === '/',
    };
  }, [location.pathname]);

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
        <Route path="/pincode" element={<Pincode />} />
        <Route path='/retailer' element={<Retailer />} />
        <Route path="/*" element={<RetailerRoutes />} />
      </Routes>
    </>
  );
});

const LoadingFallback = () => (
  <>
    <div style={{ width: '100vw', height: "57px", position: "fixed", top: "0px", backgroundColor: 'rgb(135, 162, 255)' }} />
    <div style={{ width: '100vw', height: "57px", position: "fixed", bottom: "0px", backgroundColor: 'rgb(135, 162, 255)' }} />
  </>
);

export default App;
