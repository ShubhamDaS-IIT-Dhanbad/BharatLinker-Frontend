import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import ProductCard from './productCard.jsx';
import '../styles/searchPage.css';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import { TbClockSearch } from "react-icons/tb";
import LoadingSearchPage from './loadingComponents/loadingSearchPage.jsx';


import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, resetProducts, setCurrentPage } from '../redux/features/searchProductSlice.jsx';
import { updateProduct } from '../redux/features/pincodeUpdatedSlice.jsx';

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"; // Added missing import for IoIosArrowDown and IoIosArrowUp
import { TbHomeMove } from "react-icons/tb";

import { BiSearchAlt } from "react-icons/bi";

import { debounce } from 'lodash';

const CategoryCard = ({ categoryObj, toggleCategorySelection }) => {
    return (
        <div className="pincode-item-product-page-card" onClick={() => toggleCategorySelection(categoryObj.category)}>
            <div className={categoryObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
            <p className="pincode-item-pincode">{categoryObj.category}</p>
        </div>
    );
};

const BrandCard = ({ brandObj, toggleBrandSelection }) => {
    return (
        <div className="pincode-item-product-page-card" onClick={() => toggleBrandSelection(brandObj.brand)}>
            <div className={brandObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}></div>
            <p className="pincode-item-pincode">{brandObj.brand}</p>
        </div>
    );
};



const SearchPage = () => {
    const location = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    // Redux state selectors
    const { products, loading, hasMoreProducts, currentPage } = useSelector((state) => state.searchproducts);
    const { isUpdatedProduct } = useSelector((state) => state.pincodestate);

    // State Management
    const [inputValue, setInputValue] = useState(query);
    const productsPerPage = 20;
    const [showFilter, setShowFilter] = useState(false);
    const [showSortBy, setShowSortBy] = useState('');
    const [selectedPincodes, setSelectedPincodes] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [sortType, setSortType] = useState();
    const [brands, setBrands] = useState([
        { brand: "Apple", selected: false },
        { brand: "Samsung", selected: false },
        { brand: "Sony", selected: false },
        { brand: "LG", selected: false }
    ]);
    const [categories, setCategories] = useState([
        { category: "mobile", selected: false },
        { category: "laptop", selected: false },
        { category: "earphone", selected: false },
        { category: "television", selected: false }
    ]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Debounced version of fetchProduct
    const debouncedFetchProduct = useCallback(
        debounce((pincodesData) => {
            const params = {
                inputValue,
                page: 1,
                productsPerPage,
                selectedPincodes: pincodesData.filter(pin => pin.selected).map(pin => pin.pincode),
                selectedCategories,
                selectedBrands,
                showSortBy: sortType
            };
            dispatch(resetProducts());
            dispatch(fetchProducts(params)).finally(() => setFetching(false));
        }, 0), [inputValue, selectedPincodes, selectedCategories, selectedBrands, sortType]
    );

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
        const pincodesData = JSON.parse(pincodesCookie);
        if (!isUpdatedProduct) {
            setSelectedPincodes(pincodesData);
            if (products.length === 0) {
                debouncedFetchProduct(pincodesData);
            }
            dispatch(updateProduct());
        }
    }, []);

    const [isInitialRender, setIsInitialRender] = useState(true);
    useEffect(() => {
        if (!isInitialRender) {
            debouncedFetchProduct(selectedPincodes)
        } else {
            const timer = setTimeout(() => setIsInitialRender(false), 500);
            return () => clearTimeout(timer);
        }
    }, [selectedPincodes, selectedBrands, selectedCategories, sortType]);



    const toggleBrandSelection = (brand) => {
        setBrands((prevSelectedBrands) => {
            return prevSelectedBrands.map(b =>
                b.brand === brand
                    ? { ...b, selected: !b.selected }
                    : b
            );
        });
        setSelectedBrands((prevSelected) => {
            if (prevSelected.includes(brand)) {
                return prevSelected.filter(item => item !== brand);
            } else {
                return [...prevSelected, brand];
            }
        });
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
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSearchParams(prev => ({
            ...prev,
            query: value
        }));
        debouncedFetchProduct(selectedPincodes)
    };

    const handleLoadMore = () => {
        if (!loading && hasMoreProducts && !fetching) {
            setFetching(true);
            dispatch(setCurrentPage(currentPage + 1));
            const params = {
                inputValue,
                page: currentPage + 1,
                productsPerPage,
                selectedPincodes: selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode),
                selectedCategories,
                selectedBrands,
                showSortBy: sortType
            };
            dispatch(fetchProducts(params)).finally(() => setFetching(false));
        }
    };



    return (
        <>
            <ToastContainer />
            <div style={{ width: "100vw", height: "30px", backgroundColor: "white" }}></div>
            {!showFilter && !showSortBy &&
                <>
                    <div id='product-search-container-top'>
                        <div id='search-header-div-search-div-1'>
                            <BiSearchAlt id='header-div-search-div-search' />
                            <input
                                id='search-page-header-div-input'
                                placeholder="Search Products"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            < TbHomeMove onClick={() => navigate('/')} size={25} style={{ paddingRight: "10px" }} />
                        </div>
                    </div>

                    <div id="product-page-container">
                        {products.length > 0 ? (
                            <>
                                <div id="product-page-grid">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            id={product._id}
                                            image={product.images[0]}
                                            title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                                            price={product.price}
                                            quantity={product.quantityAvailable}
                                        />
                                    ))}
                                </div>

                                {hasMoreProducts && !loading && (
                                    <div className='search-page-load-more-container'>
                                        < IoIosArrowDown size={30} className="search-page-load-more-icon" onClick={handleLoadMore} />
                                    </div>
                                )}
                            </>
                        ) : (
                            !loading &&
                            <div className='no-product-found'>
                                <TbClockSearch size={60} />
                                <div>No Product Found</div>
                                <div style={{ fontWeight: "900" }}>In Your Area</div>
                            </div>

                        )}
                        {loading && <LoadingSearchPage />}
                    </div>
                </>
            }

            {showFilter && (
                <div className='product-filter-section'>
                    <div id='filter-section-product-page'>
                        <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }} />
                        FILTER SECTION
                    </div>
                    <div id="filter-options-product-page">
                        <div onClick={() => setShowCategory(!showCategory)} className="search-shop-page-filter-option-title">
                            <p>Category</p>
                            {showCategory ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                        </div>
                        {showCategory && (
                            <div id="filter-category-options">
                                {categories.map((categoryObj) => (
                                    <CategoryCard
                                        key={categoryObj.category}
                                        categoryObj={categoryObj}
                                        toggleCategorySelection={toggleCategorySelection}
                                    />
                                ))}
                            </div>
                        )}
                        <div onClick={() => setShowBrand(!showBrand)} className="search-shop-page-filter-option-title">
                            <p>Brand</p>
                            {showBrand ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                        </div>
                        {showBrand && (
                            <div id="filter-brand-options">
                                {brands.map((brandObj) => (
                                    <BrandCard
                                        key={brandObj.brand}
                                        brandObj={brandObj}
                                        toggleBrandSelection={toggleBrandSelection}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showSortBy && (
                <div className='searchpage-sortby-section'>
                    <div id='product-sort-by-header'>
                        <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => { setShowSortBy(!showSortBy); }} />
                        SORT BY SECTION
                    </div>
                    <div id="product-page-sortby-options">
                        <div className="search-shop-page-sortby-option-title"
                            onClick={() => { setSortType('price_low_to_high'); }}>
                            <div
                                className={sortType === 'price_low_to_high' ? 'pincode-item-selected' : 'pincode-item-unselected'}>
                            </div>
                            <p className="pincode-item-pincode">low to high</p>
                        </div>
                        <div className="search-shop-page-sortby-option-title"
                            onClick={() => { setSortType('price_high_to_low'); }}>
                            <div className={sortType === 'price_high_to_low' ? 'pincode-item-selected' : 'pincode-item-unselected'}>
                            </div>
                            <p className="pincode-item-pincode">   high to low</p>
                        </div>
                    </div>
                </div>
            )}


            <div id='product-footer'>
                <div id='product-footer-sortby' onClick={() => { setShowSortBy(!showSortBy); setShowFilter(false); }}>
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div id='product-footer-filterby' onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }}>
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default SearchPage;


