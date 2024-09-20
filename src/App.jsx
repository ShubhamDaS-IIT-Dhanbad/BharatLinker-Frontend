import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import SearchPage from './components/searchPage.jsx'; 
import ShopPage from './components/shop.jsx'; 
import SingleProduct from './components/singleProduct.jsx';
import SingleShop from './components/singleShop.jsx'

function App() {
  const [pincode, setPinCode] = useState(['742136','123456']);

  useEffect(() => {
    const storedPincode = localStorage.getItem('pincode');
    if (storedPincode) {
      setPinCode(JSON.parse(storedPincode));
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();
            const locationPincode = '742136';
            const updatedPincode = [locationPincode,'742136','742137','742138'];
            setPinCode(updatedPincode);
            localStorage.setItem('pincode', JSON.stringify(updatedPincode));
          } catch (error) {
            console.error("Error fetching pincode:", error);
          }
        });
      }
    }
  }, []);

  return (
    <Router>
      <RoutesWithConditionalHeader pincode={pincode} setPinCode={setPinCode} />
    </Router>
  );
}

function RoutesWithConditionalHeader({ pincode, setPinCode }) {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <>
      {isHomepage && <Header />}
      <Routes>
        <Route path="/" element={<Home pincode={pincode} setPinCode={setPinCode} />} />
        <Route path="/search" element={<SearchPage pincode={pincode} />} />
        <Route path="/shop" element={<ShopPage/>} />
        <Route path="/product/:productId" element={<SingleProduct />} />
        <Route path="/shop/:shopId" element={<SingleShop/>}/>
      </Routes>
    </>
  );
}

export default App;

