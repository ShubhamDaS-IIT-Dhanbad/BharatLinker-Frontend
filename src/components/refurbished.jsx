// src/pages/RefurbishedPage.jsx
import React, { useState, useEffect } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { TbChevronDown, TbCategory2 } from 'react-icons/tb';
import { BiSearchAlt } from 'react-icons/bi';
import { SlCloudUpload } from 'react-icons/sl';
import { IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRefurbishedProducts, setCurrentPage, resetProducts } from '../redux/features/refurbishedProductsSlice.jsx';
import { updateRefurbish } from '../redux/features/pincodeUpdatedSlice.jsx';
import { useUserPincode } from '../hooks/useUserPincode.jsx';
import r1 from '../assets/refur.webp';

import '../styles/refurbished.css';

const RefurbishedPage = ({ address }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [hideHeader, setHideHeader] = useState(false);
  const refurbishedProducts = useSelector(state => state.refurbishedProducts.items); // Get products from Redux state
  const { userPincodes } = useUserPincode();
  const selectedPincodes = userPincodes.filter(pin => pin.selected).map(pin => Number(pin.pincode));
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { currentPage, totalPages, hasMoreProducts, error } = useSelector(state => state.refurbishedProducts);

  const { isUpdatedRefurbish } = useSelector((state) => state.pincodestate);

  useEffect(() => {
    if (!isUpdatedRefurbish) {
      try {
        dispatch(resetProducts());
        dispatch(fetchRefurbishedProducts({ searchQuery: searchInput.trim() || '', selectedPincodes, page: currentPage }));
        dispatch(updateRefurbish());
      } catch (error) {
        console.error('Error fetching refurbished products:', error);
      }
    }
  }, []);
  const [isInitialRender, setIsInitialRender] = useState(true);
  useEffect(() => {
    if (!isInitialRender) {
      dispatch(resetProducts());
      dispatch(fetchRefurbishedProducts({ searchQuery: searchInput.trim() || '', selectedPincodes, page: currentPage }));
      dispatch(updateRefurbish());
    } else {
      setIsInitialRender(false);
    }
  }, [searchInput]);



  useEffect(() => {
    const handleScroll = () => {
      setHideHeader(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleUploadClick = () => {
    const userCookie = Cookies.get('BharatLinkerUser');
    if (!userCookie) {
      navigate('/login');
    } else {
      navigate('/refurbished/product/upload');
    }
  };

  const handleSearchClick = () => {
    setSearchInput(searchInput.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchInput(searchInput.trim());
    }
  };

  // Handle "Load More" button click
  const handleLoadMore = () => {
    if (!loading && hasMoreProducts && !fetching) {
      setFetching(true);
      dispatch(setCurrentPage(currentPage + 1)); // Increment current page
      dispatch(fetchRefurbishedProducts({ searchQuery: searchInput.trim(), selectedPincodes, page: currentPage + 1 })).finally(() => {
        setFetching(false);
      });
    }
  };

  // Error handling
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='refurbished-main-container'>
      <div className={hideHeader ? 'refurbished-header-hide' : 'refurbished-header-show'}>
        <div className='refurbished-header-parent'>
          <div className='refurbished-header-user'>
            <HiOutlineUserCircle id='refurbished-header-ham' size={35} />
            <div id='refurbished-header-location-div'>
              <p id='refurbished-header-location'>Location</p>
              <div id='refurbished-header-location-name' onClick={() => navigate('/pincode')}>
                {address.city} {address.postcode}
                <TbChevronDown size={15} />
              </div>
            </div>
          </div>
          <TbCategory2 size={25} className='refurbished-header-category' onClick={() => navigate('/')} />
        </div>

        <div id='refurbished-header-search-div'>
          <div id='refurbished-header-search-div-1'>
            <BiSearchAlt id='refurbished-header-search-icon' onClick={handleSearchClick} />
            <input
              id='refurbished-header-input'
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
      <div className='refursection-mag-div'>
        <img src={r1} alt="Refurbished section" />
      </div>
      <div className="refurbished-products-list">
        {refurbishedProducts.length > 0 ? (
          refurbishedProducts.map(product => (
            <div className="refurbished-product-card" key={product._id}>
              <div className="refurbished-product-card-top" onClick={() => navigate(`/product/${product._id}`)}>
                <img className="refurbished-product-card-top-image" src={product.images[0]} alt={product.title} />
              </div>
              <div className="refurbished-product-card-bottom">
                <span className='refurbished-product-card-shop-name'>{product.title}</span>
                <span className='refurbished-product-card-shop'>
                  ₹{product.price}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}

        {hasMoreProducts && !loading && (
          <div className='load-more-container'>
            <IoIosArrowDown size={30} className="load-more-container" onClick={handleLoadMore} />
          </div>
        )}
      </div>

      {/* Refurbished Footer Section */}
      <div id='refurbished-footer'>
        <div id='refurbished-footer-item' onClick={handleUploadClick}>
          Upload Your Product
        </div>
      </div>
    </div>
  );
};

export default RefurbishedPage;
