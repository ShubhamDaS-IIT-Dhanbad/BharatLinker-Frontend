import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchShops, setCurrentPage, resetShops } from '../redux/features/searchShopSlice.jsx';
import {updateShop} from '../redux/features/pincodeUpdatedSlice.jsx';

import { useNavigate } from 'react-router-dom';
import ShopCard from './shopCard.jsx';
import '../styles/searchShop.css';
import { MdOutlineKeyboardArrowLeft, MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TbHomeMove, TbClockSearch } from "react-icons/tb";
import { BiSearchAlt } from "react-icons/bi";
import LoadingShopPage from './loadingComponents/loadingShopPage.jsx';
import { useDebounce } from 'use-debounce';


const CategoryCard = ({ categoryObj, toggleCategorySelection }) => (
  <div className="pincode-item-search-page-card" onClick={() => toggleCategorySelection(categoryObj.category)}>
    <div className={categoryObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
    <p className="pincode-item-pincode">{categoryObj.category}</p>
  </div>
);

const Shop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shops, loading, currentPage, hasMoreShops } = useSelector((state) => state.searchshops);
  const { isUpdatedShop } = useSelector((state) => state.pincodestate);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 200);
  const [selectedPincodes, setSelectedPincodes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [showFilterCategory, setShowFilterCategory] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [numberOfShops] = useState(20);

  const [categories] = useState([
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

  const fetchShopsData = (pincodes) => {
    const params = {
      inputValue: debouncedSearchQuery,
      selectedCategories,
      selectedBrands: [],
      selectedPincodes: pincodes.filter(pin => pin.selected).map(pin => pin.pincode),
      page: currentPage,
      shopsPerPage: numberOfShops
    };

    dispatch(resetShops());
    dispatch(fetchShops(params)).then(() => setFetching(false));
  };

  const getCookieValue = (cookieName) => {
    const name = `${cookieName}=`;
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
    if (!isUpdatedShop) {
      try {
        const pincodesData = JSON.parse(pincodesCookie);
        setSelectedPincodes(pincodesData);
        fetchShopsData(pincodesData);
        dispatch(updateShop());
      } catch (error) {
        console.error("Error parsing userpincodes cookie", error);
      }
    }
  }, []);
  useEffect(() => {
    if (!isInitialRender) {
      fetchShopsData(selectedPincodes);
    } else {
      const timer = setTimeout(() => setIsInitialRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearchQuery]);


  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const toggleCategorySelection = (categoryName) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryName)
        ? prevSelected.filter((item) => item !== categoryName)
        : [...prevSelected, categoryName]
    );
  };

  const handleLoadMore = () => {
    if (!loading && hasMoreShops && !fetching) {
      setFetching(true);
      dispatch(setCurrentPage(currentPage + 1));
      const params = {
        inputValue: debouncedSearchQuery,
        selectedCategories,
        selectedBrands: [],
        selectedPincodes: selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode),
        page: currentPage + 1,
        shopsPerPage: numberOfShops
      };
      dispatch(fetchShops(params)).then(() => setFetching(false));
    }
  };

  return (
    <>
      {!showFilter && !showSortBy && (
        <>
          <div id='product-search-container-top'>
            <div id='search-header-div-search-div-1'>
              <BiSearchAlt id='header-div-search-div-search' />
              <input
                id='search-page-header-div-input'
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search By Shop Name"
              />
              <TbHomeMove onClick={() => navigate('/')} size={25} style={{ paddingRight: "10px" }} />
            </div>
          </div>

          {!loading ? (
            <div id="search-shop-grid">
              {shops.length > 0 ? (
                <>
                  {shops.map(shop => (
                    <div key={shop._id}>
                      <ShopCard shop={shop} />
                    </div>
                  ))}
                  {hasMoreShops && (
                    <div className='search-shop-load-more-container'>
                      <IoIosArrowDown
                        size={30}
                        className="search-page-load-more-icon"
                        onClick={handleLoadMore}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className='search-no-shop-found'>
                  <TbClockSearch size={60} />
                  <div>No shop Found</div>
                  <div style={{ fontWeight: "900" }}>In Your Area</div>
                </div>
              )}
            </div>
          ) : (
            <LoadingShopPage />
          )}
        </>
      )}

      {showFilter && (
        <div className='search-page-filter-section'>
          <div id='filter-section-search-shop'>
            <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => setShowFilter(!showFilter)} />
            FILTER SECTION
          </div>
          <div className='filter-options-search-shop'>
            <div
              className='search-shop-page-filter-option-title'
              onClick={() => setShowFilterCategory(!showFilterCategory)}
              style={{ cursor: 'pointer' }}
            >
              <p>Shop Category</p>
              {showFilterCategory ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
            {showFilterCategory && (
              <div id="filter-shop-category-options">
                {categories.map((cat, idx) => (
                  <CategoryCard key={idx} categoryObj={cat} toggleCategorySelection={toggleCategorySelection} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showSortBy && (
        <div className='search-page-filter-section'>
          <div id='filter-section-search-shop'>
            <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => setShowSortBy(!showSortBy)} />
            SORT BY
          </div>
        </div>
      )}

      <div id='search-shop-footer'>
        <div id='search-shop-footer-sortby' onClick={() => { setShowSortBy(!showSortBy); setShowFilter(false); }}>
          <LiaSortSolid size={33} />
          SORT BY
        </div>
        <div id='search-shop-footer-filterby' onClick={() => { setShowFilter(!showFilter); setShowSortBy(false); }}>
          <MdFilterList size={33} />
          FILTER BY
        </div>
      </div>
    </>
  );
};

export default Shop;
