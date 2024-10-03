import React, { useMemo, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/header.jsx';
import ScrollToTop from './components/scrollToTop.jsx';
import { useUserLocation } from './hooks/useUserLocation.jsx';
import { useUserPincode } from './hooks/useUserPincode.jsx';
import RetailerRoutes from './retailerComponent/retailerRoutes.jsx';
import RetailerHomePageHeaderFooter from './retailerComponent/retailerHomePageHeaderFooter.jsx';
import RetailerProductHeaderFooter from './retailerComponent/retailerProductHeaderFooter.jsx';

// Lazy load your components
const Home = lazy(() => import('./components/home.jsx'));
const Retailer = lazy(() => import('./retailerComponent/retailer.jsx'));
const SearchPage = lazy(() => import('./components/searchPage.jsx'));
const ShopPage = lazy(() => import('./components/searchShop.jsx'));
const SingleProduct = lazy(() => import('./components/singleProduct.jsx'));
const SingleShop = lazy(() => import('./components/singleShop.jsx'));
const Pincode = lazy(() => import('./components/pincode.jsx'));

function App() {
  const { address, userPincodes } = useUserLocation();
  const { inputValue, handleInputChange, handleAddPincode, togglePincodeSelection, handleDeletePincode } = useUserPincode(userPincodes);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
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
  const location = useLocation();

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

export default App;
