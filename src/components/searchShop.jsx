import React, { useState, useEffect } from 'react';
import '../styles/searchShop.css'; // Ensure you have this CSS file for styling

import ProductCard from './productCard.jsx';
import { BsSearch } from "react-icons/bs";
import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";

import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';


import o1 from '../assets/oneplus.jpg'
import s1 from '../assets/shopsPage.webp';

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pincodes, setPincodes] = useState([]);
  const navigate = useNavigate();
  const [pincode, setPincode] = useState('742136');

  const [showPincode, setShowPincode] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showCatgory, setShowCategory] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [showSortby, setShowSortby] = useState(false);

  useEffect(() => {
    const storedPincodes = localStorage.getItem('pincode');
    if (storedPincodes) {
      setPincodes(JSON.parse(storedPincodes));
    }
  }, []);

  useEffect(() => {
    const fetchShops = async () => {

      try {
        // const pincodeQuery = pincodes.join(',');
        const response = await fetch(`http://localhost:12000/api/v1/shop/shops?pincode=742136`);
        if (!response.ok) {
          throw new Error('Failed to fetch shops');
        }
        const data = await response.json(); console.log(data);
        setShops(data.shops || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [pincodes]);

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


  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <>
      {!showFilter && !showSortby && (
        <>
          <div id="shop-search-container-top">
            <div id='shop-search-container-top-div'>
              <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { navigate('/') }} />
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
              filteredShops.map(shop => (
                <ShopCard key={shop._id} shop={shop} />
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
              <p>pincode</p>
              {showPincode ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>

            {showPincode && (
              <div id="shop-details-description">
                pincode
              </div>
            )}


            <div id="product-details-hr"></div>
            <div id="product-details-about" onClick={() => setShowShop(!showShop)} style={{ cursor: 'pointer' }}>
              <p>Shop</p>
              {showShop ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
            <div id="product-details-hr"></div>
            <div id="product-details-about" onClick={() => setShowCategory(!showCatgory)} style={{ cursor: 'pointer' }}>
              <p>Category</p>
              {showCatgory ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
          </div>
        </div>
      )}

      {showSortby && (
        <div className='searchpage-filter-section'>
          <div className='modal-content'>
            <div id="product-details-about" onClick={() => setShowPincode(!showPincode)} style={{ cursor: 'pointer' }}>
              <p>low to high</p>
              {showPincode ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
          </div>
        </div>
      )}

      <div id='searchpage-footer'>
        <div id='searchpage-footer-sortby' onClick={() => { setShowSortby(!showSortby); setShowFilter(false) }}>
          <LiaSortSolid size={25} />
          SORT BY
        </div>
        <div id='searchpage-footer-filterby' onClick={() => { setShowSortby(false); setShowFilter(!showFilter) }}>
          <MdFilterList size={25} />
          FILTER BY
        </div>
      </div>
    </>
  );
};

export default Shop;
