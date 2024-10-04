import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShops, setCurrentPage, resetShops } from '../redux/features/searchShopSlice.jsx';
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

// Category card for filtering by categories
const CategoryCard = ({ categoryObj, toggleCategorySelection }) => (
  <div className="pincode-item-search-page-card" onClick={() => toggleCategorySelection(categoryObj.category)}>
    <div className={categoryObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
    <p className="pincode-item-pincode">{categoryObj.category}</p>
  </div>
);

// Pin code card for filtering by pin codes
const PinCodeCard = ({ pincodeObj, togglePincodeSelection }) => (
  <div className="pincode-item-search-page-card" onClick={() => togglePincodeSelection(pincodeObj.pincode)}>
    <div className={pincodeObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
    <p className="pincode-item-pincode">{pincodeObj.pincode}</p>
  </div>
);

const Shop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shops, loading, currentPage, hasMoreShops } = useSelector((state) => state.searchshops);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 200);
  const [selectedPincodes, setSelectedPincodes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [showPincode, setShowPincode] = useState(false);
  const [showFilterCategory, setShowFilterCategory] = useState(false);

  const [isInitialRender, setIsInitialRender] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [numberOfShops, setNumberOfShops] = useState(20);

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

  const fetchShopsData = () => {
    const params = {
      inputValue: debouncedSearchQuery,
      selectedCategories,
      selectedBrands: [],
      selectedPincodes: selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode),
      page: currentPage,
      shopsPerPage: numberOfShops
    };

    dispatch(resetShops());
    return dispatch(fetchShops(params)).then(() => {
      setFetching(false); // Reset fetching after data is fetched
    });
  };

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
        if (shops.length === 0) fetchShopsData();
      } catch (error) {
        console.error("Error parsing userpincodes cookie", error);
      }
    }
  }, []);

  // Fetch shops data when search query or selected pincodes change
  useEffect(() => {
    if (!isInitialRender) {
      fetchShopsData();
    } else {
      const timer = setTimeout(() => {
        setIsInitialRender(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearchQuery, selectedPincodes]);


  // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Toggle category selection for filtering
  const toggleCategorySelection = (categoryName) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryName)
        ? prevSelected.filter((item) => item !== categoryName)
        : [...prevSelected, categoryName]
    );
  };

  // Toggle pincode selection
  const togglePincodeSelection = (pincode) => {
    setSelectedPincodes((prevSelectedPincodes) =>
      prevSelectedPincodes.map(pin =>
        pin.pincode === pincode ? { ...pin, selected: !pin.selected } : pin
      )
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
      return dispatch(fetchShops(params))
        .then(() => {
          setFetching(false);
        });
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
            <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }} />
            FILTER SECTION
          </div>
          <div className='filter-options-search-shop'>
            <div className="search-shop-page-filter-option-title" onClick={() => setShowPincode(!showPincode)} style={{ cursor: 'pointer' }}>
              <p>Pincode</p>
              {showPincode ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
            </div>
            {showPincode && (
              <div id="filter-shop-pincode-options">
                {selectedPincodes.map(pincodeObj => <PinCodeCard key={pincodeObj.pincode} pincodeObj={pincodeObj} togglePincodeSelection={togglePincodeSelection} />)}
              </div>
            )}

            <div className='search-shop-page-filter-option-title' onClick={() => setShowFilterCategory(!showFilterCategory)} style={{ cursor: 'pointer' }}>
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



      {showSortBy && 
        <div className='search-page-filter-section'>
          <div id='filter-section-search-shop'>
            <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => { setShowFilter(false); setShowSortBy(!showSortBy); }} />
            SORT BY
          </div>
        </div>
      }
          <div id='search-shop-footer'>
            <div id='search-shop-footer-sortby' onClick={() => { setShowSortBy(!showSortBy); setShowFilter(false); }}>
              <LiaSortSolid size={33} />
              SORT BY
            </div>
            <div id='search-shop-footer-filterby' onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }}>
              <MdFilterList size={33} />
              FILTER BY
            </div>
          </div>
        </>
      );
};

      export default Shop;

