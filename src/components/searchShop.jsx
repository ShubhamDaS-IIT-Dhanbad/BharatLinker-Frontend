import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';
import '../styles/searchShop.css';

import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import REACT_APP_API_URL from '../../public/constant.js';

const CategoryCard = ({ categoryObj, toggleCategorySelection }) => {
  return (
    <div className="pincode-item-search-page-card" onClick={() => toggleCategorySelection(categoryObj.category)}>
      <div className={categoryObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
      <p className="pincode-item-pincode">{categoryObj.category}</p>
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

  // Create a ref for the input
  const searchInputRef = useRef(null);

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
  }, []);

  // Effect to fetch shops based on selected pincodes and search query
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const searchByPincode = selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode);
        const response = await fetch(`${REACT_APP_API_URL}/api/v1/shop/shops?keyword=${searchQuery}&pincode=${searchByPincode.join(',')}`);

        if (!response.ok) throw new Error('Failed to fetch shops');
        const data = await response.json();
        setShops(data.shops || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [selectedPincodes, searchQuery]);

  const handleSearchChange = (event) => {
    const newValue = event.target.value; // Get the new value from the input
    setSearchQuery(newValue); // Update the search query state
    setShops([]); // Reset shops on input change
    searchInputRef.current.focus(); // Maintain focus on the search input
  };

  const toggleCategorySelection = (categoryName) => {
    setCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.category === categoryName) {
          return {
            ...category,
            selected: !category.selected // Toggle the selected state
          };
        }
        return category;
      });
    });

    // Update selectedCategories based on the toggled state
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryName)) {
        return prevSelected.filter(item => item !== categoryName);
      } else {
        return [...prevSelected, categoryName];
      }
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
                ref={searchInputRef} // Set the ref here
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
              />
            </div>
          </div>
        {loading?(<>loading...</>):(<div id="shop-grid">
            {shops.length > 0 ? (
              shops.map(shop => (
                <div key={shop._id}>
                  <ShopCard shop={shop} />
                </div>
              ))
            ) : (
              <p>No shops found</p>
            )}
          </div>)}
          
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
            <div id="product-details-about" onClick={() => setShowFilterCategory(!showFilterCategory)} style={{ cursor: 'pointer' }}>
              <p>Category</p>
              {showFilterCategory ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
          </div>
        </div>
      )}

      {showFilterCategory && (
        <div id="filter-category-options">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} categoryObj={cat} toggleCategorySelection={toggleCategorySelection} />
          ))}
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
