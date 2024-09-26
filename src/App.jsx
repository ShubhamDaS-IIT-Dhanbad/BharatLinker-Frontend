import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import SearchPage from './components/searchPage.jsx';
import ShopPage from './components/searchShop.jsx';
import SingleProduct from './components/singleProduct.jsx';
import SingleShop from './components/singleShop.jsx';
import Pincode from "./components/pincode.jsx";

function App() {
  const [pincode, setPincode] = useState(null);

  useEffect(() => {
    const existingAddressCookie = document.cookie.split('; ').find(row => row.startsWith('address='));
    const userpincodesCookie = document.cookie.split('; ').find(row => row.startsWith('userpincodes='));

    if (!userpincodesCookie || !existingAddressCookie) {
      // Ensure geolocation is available in the browser
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const locationPincode = data.address.postcode || 'Add Pincode';
              
              // Set the pincode to the state
              setPincode({ pincode: locationPincode, selected: true });

              const expirationTime = new Date();
              expirationTime.setTime(expirationTime.getTime() + (60 * 60 * 1000)); // 1 hour expiry
              const expires = `expires=${expirationTime.toUTCString()}`;

              // Store address and pincode as cookies with expiration
              document.cookie = `address=${encodeURIComponent(JSON.stringify(data.address))}; ${expires}; path=/`;
              
              const userPincodes = [
                {
                  pincode: locationPincode,
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
      } else {
        console.error("Geolocation is not available in this browser.");
      }
    } else {
      try {
        // Extract and decode the cookie value
        const pincodesCookie = decodeURIComponent(userpincodesCookie.split('=')[1]);
        if (pincodesCookie) {
          try {
            const pincodesData = JSON.parse(pincodesCookie);
            setPincode(pincodesData);
          } catch (error) {
            console.error("Error parsing userpincodes cookie", error);
          }
        }
      } catch (error) {
        console.error("Error parsing userpincodes cookie", error);
      }
    }
  }, []);

  return (
    <Router>
      <RoutesWithConditionalHeader pincode={pincode} setPincode={setPincode} />
    </Router>
  );
}

function RoutesWithConditionalHeader({ pincode, setPincode }) {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
console.log(pincode)
  return (
    <>
      {isHomepage && <Header />}
      <Routes>
        <Route path="/" element={<Home userPincode={pincode} setUserPincode={setPincode} />} />
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
