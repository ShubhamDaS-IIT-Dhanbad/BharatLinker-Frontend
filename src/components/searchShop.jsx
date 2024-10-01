import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';
import '../styles/searchShop.css';

import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import {RETAILER_SERVER} from '../../public/constant.js';
import { useDebounce } from 'use-debounce';

import LoadingShopPage from './loadingComponents/loadingShopPage.jsx';
import axios from 'axios';

import { TbClockSearch } from "react-icons/tb";
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
    { category: "Pharmacy", selected: false },
    { category: "Book Store", selected: false },
    { category: "Mobile Shop", selected: false },
    { category: "Clothing Store", selected: false },
    { category: "Grocery Store", selected: false },
    { category: "Electronics", selected: false },
    { category: "Furniture Store", selected: false },
    { category: "Jewelry Store", selected: false },
    { category: "Toy Store", selected: false },
    { category: "Supermarket", selected: false },
    { category: "Pet Shop", selected: false },
    { category: "Bakery", selected: false },
    { category: "Hardware Store", selected: false },
    { category: "Florist", selected: false },
    { category: "Gift Shop", selected: false }
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
      const searchByCategories = selectedCategories; 
      if (searchByPincode.length === 0) {
        setShops([]); 
        return;
      }
  
      // Constructing the query
      let query = `pincode=${searchByPincode.join(',')}&keyword=${debouncedSearchQuery}`;
      if (searchByCategories.length > 0) {
        query += `&category=${searchByCategories.join(',')}`;
      }
      const response = await axios.get(`${RETAILER_SERVER}/shop/getshops?${query}`);
      
      setShops(response.data.shops || []);
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
  }, [debouncedSearchQuery, selectedPincodes,selectedCategories]);

  const handleSearchChange = (event) => {
    setLoading(true);
    const newValue = event.target.value;
    setSearchQuery(newValue);
    setShops([]);
    searchInputRef.current.focus();
  };

  const toggleCategorySelection = (categoryName) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.category === categoryName
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryName)
        ? prevSelected.filter((item) => item !== categoryName)
        : [...prevSelected, categoryName]
    );
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
              <MdOutlineKeyboardArrowLeft size={'25px'} onClick={() => navigate('/')} />
              <input
                style={{ borderRadius: "5px" }}
                id="shop-search-bar"
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
              />
            </div>
          </div>

          {loading ? (
            <LoadingShopPage/>
          ) : (
            <div id="search-shop-grid">
              {shops.length > 0 ? (
                shops.map(shop => (
                  <div key={shop._id}>
                    <ShopCard shop={shop} />
                  </div>
                ))
              ) : (
              <div className='no-shop-found'>
                <TbClockSearch size={60}
                />
                No shop Found
              </div>
              )}
            </div>
          )}
        </>
      )}

      {showFilter && (
        <div className='searchpage-filter-section'>
          <div id='filter-section-search-page'>
            {/* <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }} /> */}
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
              <p>Shop Category</p>
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
