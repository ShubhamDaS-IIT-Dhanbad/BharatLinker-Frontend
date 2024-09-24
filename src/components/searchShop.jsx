import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';
import '../styles/searchShop.css';

import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const ITEMS_PER_PAGE = 10; // Number of items to display per page

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

  useEffect(() => {
    const fetchShops = async () => {
      if (pincodeLoading || selectedPincodes.length === 0) return;      
      const searchByPincode = selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode);
      try {
        const response = await fetch(`http://localhost:12000/api/v1/shop/shops?pincode=${searchByPincode}`);
        if (!response.ok) throw new Error('Failed to fetch shops');
        const data = await response.json();
        setShops(data.shops || []);
        setTotalShops(data.total); // Assuming your API returns the total number of shops
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [selectedPincodes, pincodeLoading, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredShops = shops.filter(shop => {
    const shopNameMatches = shop?.shopName?.toLowerCase().includes(searchQuery.toLowerCase());
    const shopCategoriesMatch = shop?.categories?.some(category =>
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return shopNameMatches || shopCategoriesMatch;
  });

  const totalPages = Math.ceil(totalShops / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {!showFilter &&!showSortBy && (
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
            {filteredShops.length > 0 ? (
              filteredShops.map(shop => <ShopCard key={shop._id} shop={shop} />)
            ) : (
              <p>No shops found</p>
            )}
          </div>
        </>)}


      {showFilter && (
        <div className='searchpage-filter-section'>
          <div className='modal-content'>
            <div id="product-details-about" onClick={() => setShowPincode(!showPincode)} style={{ cursor: 'pointer' }}>
              <p>Pincode</p>
              {showPincode ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
            {showPincode && (
              <div id="shop-details-description">
                {selectedPincodes.join(', ')}
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

      {/* Pagination Controls */}
      <div id="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

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
