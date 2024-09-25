import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';
import '../styles/searchShop.css';

import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


import REACT_APP_API_URL from '../../public/constant.js';

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPincodes, setSelectedPincodes] = useState([]);
  const [pincodeLoading, setPincodeLoading] = useState(true);
  const [showPincode, setShowPincode] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalShops, setTotalShops] = useState(0);

  const navigate = useNavigate();

  // Function to get cookie values
  const getCookieValue = (cookieName) => {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.startsWith(name)) {
        return cookie.substring(name.length);
      }
    }
    return null;
  };

  // Effect to load pincodes from cookies
  useEffect(() => {
    const pincodesCookie = getCookieValue('userpincodes');
    if (pincodesCookie) {
      try {
        const pincodesData = JSON.parse(pincodesCookie);
        setSelectedPincodes(pincodesData);
      } catch (error) {
        console.error("Error parsing userpincodes cookie", error);
      }
    }
    setPincodeLoading(false);
  }, []);

  // Effect to fetch shops based on selected pincodes
  
  const fetchShops = async () => {
    try {

      const searchByPincode = selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode);
      const response = await fetch(
        `${REACT_APP_API_URL}/api/v1/shop/shops?keyword=${searchQuery}&pincode=742136`
    );
      if (!response.ok) throw new Error('Failed to fetch shops');
      const data = await response.json();
      setShops(data.shops || []);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [pincodeLoading, selectedPincodes,searchQuery]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    fetchShops();
  };

 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {!showFilter && !showSortBy && (
        <>
          <div id="shop-search-container-top">
            <div id='shop-search-container-top-div'>
              <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => navigate('/')} />
              <input
                id="shop-search-bar"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
              />
            </div>
          </div>

          <div id="shop-grid">
            {shops.length > 0 ? (
              shops.map(shop => (
                <div key={shop._id}>
                  <ShopCard shop={shop} />
                </div>
              ))
            ) : (
              <p>No shops found</p>
            )}
          </div>
        </>
      )}

      {showFilter && (
        <div className='searchpage-filter-section'>
          <div className='modal-content'>
            <div id="product-details-about" onClick={() => setShowPincode(!showPincode)} style={{ cursor: 'pointer' }}>
              <p>Pincode</p>
              {showPincode ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
            {showPincode && (
              <div id="shop-details-description">
                {selectedPincodes.map(pin => pin.pincode).join(', ')}
              </div>
            )}
            <div id="product-details-hr"></div>
            <div id="product-details-about" onClick={() => setShowFilter(false)} style={{ cursor: 'pointer' }}>
              <p>Shop</p>
              <IoIosArrowDown size={20} />
            </div>
            <div id="product-details-hr"></div>
            <div id="product-details-about" onClick={() => setShowSortBy(!showSortBy)} style={{ cursor: 'pointer' }}>
              <p>Category</p>
              {showSortBy ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
          </div>
        </div>
      )}

      {showSortBy && (
        <div className='searchpage-filter-section'>
          <div className='modal-content'>
            <div id="product-details-about" style={{ cursor: 'pointer' }}>
              <p>Low to High</p>
            </div>
          </div>
        </div>
      )}


      {/* Footer with Sort and Filter */}
      <div id='searchpage-footer'>
        <div id='searchpage-footer-sortby' onClick={() => { setShowSortBy(!showSortBy); setShowFilter(false); }}>
          <LiaSortSolid size={25} />
          SORT BY
        </div>
        <div id='searchpage-footer-filterby' onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }}>
          <MdFilterList size={25} />
          FILTER BY
        </div>
      </div>
    </>
  );
};

export default Shop;
