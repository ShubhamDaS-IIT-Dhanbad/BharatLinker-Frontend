import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';
import '../styles/searchShop.css';

import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import REACT_APP_API_URL from '../../public/constant.js';
import { useDebounce } from 'use-debounce';

// Category card for filtering by categories
const CategoryCard = ({ categoryObj, toggleCategorySelection }) => {
  return (
    <div className="pincode-item-search-page-card" onClick={() => toggleCategorySelection(categoryObj.category)}>
      <div className={categoryObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
      <p className="pincode-item-pincode">{categoryObj.category}</p>
    </div>
  );
};

// Pin code card for filtering by pin codes
const PinCodeCard = ({ pincodeObj, togglePincodeSelection }) => {
  return (
    <div className="pincode-item-search-page-card"
      onClick={() => togglePincodeSelection(pincodeObj.pincode)}>
      <div className={pincodeObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
      <p className="pincode-item-pincode">{pincodeObj.pincode}</p>
    </div>
  );
};

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPincodes, setSelectedPincodes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [showPincode, setShowPincode] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [showFilterCategory, setShowFilterCategory] = useState(false);

  const [categories, setCategories] = useState([
    { category: "mobile", selected: false },
    { category: "laptop", selected: false },
    { category: "earphone", selected: false },
    { category: "television", selected: false }
  ]);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Debounce for 500ms

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
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const searchByPincode = selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode);
      if (searchByPincode.length === 0) { setShops([]); return; }
      const response = await fetch(`${REACT_APP_API_URL}/api/v1/shop/shops?pincode=${searchByPincode}&keyword=${debouncedSearchQuery}`);
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
    if (selectedPincodes.length > 0) {
      fetchShops();
    }
  }, [debouncedSearchQuery, selectedPincodes]);

  const handleSearchChange = (event) => {
    setLoading(true);
    const newValue = event.target.value;
    setSearchQuery(newValue);
    setShops([]);
    searchInputRef.current.focus(); // Keep focus on search input
  };

  const toggleCategorySelection = (categoryName) => {
    setCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.category === categoryName) {
          return {
            ...category,
            selected: !category.selected
          };
        }
        return category;
      });
    });

    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryName)) {
        return prevSelected.filter(item => item !== categoryName);
      } else {
        return [...prevSelected, categoryName];
      }
    });
  };

  const togglePincodeSelection = (pincode) => {
    setSelectedPincodes((prevSelectedPincodes) => {
      const updatedPincodes = prevSelectedPincodes.map(pin =>
        pin.pincode === pincode
          ? { ...pin, selected: !pin.selected }
          : pin
      );
      return updatedPincodes;
    });
  };

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
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
              />
            </div>
          </div>

          {loading ? (
            <div>Loading shops...</div>
          ) : (
            <div id="search-shop-grid">
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
          )}
        </>
      )}

      {showFilter && (
        <div className='searchpage-filter-section'>
          <div id='filter-section-search-page'>
            <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }} />
            FILTER SECTION
          </div>
          <div className='filter-options-search-page'>
            <div className="search-shop-page-filter-option-title" onClick={() => setShowPincode(!showPincode)} style={{ cursor: 'pointer' }}>
              <p>Pincode</p>
              {showPincode ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
            {showPincode && (
              <div id="filter-search-shop-pincode-options">
                {selectedPincodes.map(pincodeObj => <PinCodeCard
                  key={pincodeObj.pincode}
                  pincodeObj={pincodeObj}
                  togglePincodeSelection={togglePincodeSelection} />)}
              </div>
            )}

            <div className='search-shop-page-filter-option-title' onClick={() => setShowFilterCategory(!showFilterCategory)} style={{ cursor: 'pointer' }}>
              <p>Category</p>
              {showFilterCategory ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
            {showFilterCategory && (
              <div id="filter-search-shop-pincode-options">
                {categories.map((cat, idx) => (
                  <CategoryCard key={idx} categoryObj={cat} toggleCategorySelection={toggleCategorySelection} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}



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
