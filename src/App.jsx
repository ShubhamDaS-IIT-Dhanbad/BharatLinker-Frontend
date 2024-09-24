import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import SearchPage from './components/searchPage.jsx';
import ShopPage from './components/searchShop.jsx';
import SingleProduct from './components/singleProduct.jsx';
import SingleShop from './components/singleShop.jsx';
import Pincode from "./components/pincode.jsx";

function App() {
  useEffect(() => {
    const existingAddressCookie = document.cookie.split('; ').find(row => row.startsWith('address='));
    const userpincodesCookie = document.cookie.split('; ').find(row => row.startsWith('userpincodes='));

    if (!userpincodesCookie || !existingAddressCookie) {
      // if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const locationPincode = data.address.postcode || 'Add Pincode';

              const expirationTime = new Date();
              expirationTime.setTime(expirationTime.getTime() + (60 * 60 * 1000));
              const expires = `expires=${expirationTime.toUTCString()}`;

              // Store address as a cookie with expiration
              document.cookie = `address=${encodeURIComponent(JSON.stringify(data.address))}; ${expires}; path=/`;

              const userPincodes = [
                {
                  pincode: data.address.postcode,
                  selected: true,
                },
              ];

              document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(userPincodes))}; ${expires}; path=/`;
            } catch (error) {
              console.error("Error fetching pincode:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error.message);
          }
        );
      
    }
  }, []);

  return (
    <Router>
      <RoutesWithConditionalHeader />
    </Router>
  );
}

function RoutesWithConditionalHeader() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <>
      {isHomepage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:productId" element={<SingleProduct />} />
        <Route path="/shop/:shopId" element={<SingleShop />} />
        <Route path="/pincode" element={<Pincode />} />
      </Routes>
    </>
  );
}

export default App;
