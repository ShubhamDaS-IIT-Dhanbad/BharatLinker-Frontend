import React, { useState, useEffect } from 'react';
import '../styles/shop.css'; // Ensure you have this CSS file for styling

import ProductCard from './productCard.jsx'; 
import { BsSearch } from "react-icons/bs";
import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';

import s1 from '../assets/shopsPage.webp';

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pincodes, setPincodes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPincodes = localStorage.getItem('pincode');
    if (storedPincodes) {
      setPincodes(JSON.parse(storedPincodes));
    }
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      // if (pincodes.length === 0) {
      //   setError('No pincode provided');
      //   setLoading(false);
      //   return;
      // }

      try {
        // const pincodeQuery = pincodes.join(',');
        const response = await fetch(`http://localhost:12000/api/v1/shop/shops?pincode=742136`);
        if (!response.ok) {
          throw new Error('Failed to fetch shops');
        }
        const data = await response.json();console.log(data);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
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

      {/* <img src={s1} alt="Banner" id='home-body-img' /> */}
      <div id="shop-grid" style={{ marginTop: "60px" }}>
        {filteredShops.length > 0 ? (
          filteredShops.map(shop => (
            <ShopCard key={shop._id} shop={shop} />
          ))
        ) : (
          <p>No shops found</p>
        )}
      </div>

      <div id='home-footer'>
        <div id='home-footer-sortby'>
          <LiaSortSolid size={25} />
          SORT BY
        </div>
        <div id='home-footer-filterby'>
          <MdFilterList size={25} />
          FILTER BY
        </div>
      </div>
    </>
  );
};

export default Shop;
