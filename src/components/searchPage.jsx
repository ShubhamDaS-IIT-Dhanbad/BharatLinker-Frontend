import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './productCard.jsx';
import '../styles/searchPage.css';
import REACT_APP_API_URL from '../../public/constant.js';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";


import LoadingSearchPage from './loadingComponents/loadingSearchPage.jsx';

const PinCodeCard = ({ pincodeObj, togglePincodeSelection }) => {
    return (
        <div className="pincode-item-search-page-card"
            onClick={() => togglePincodeSelection(pincodeObj.pincode)}>
            <div
                className={pincodeObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}>
            </div>
            <p className="pincode-item-pincode">{pincodeObj.pincode}</p>
        </div>
    );
};
const CategoryCard = ({ categoryObj, toggleCategorySelection }) => {
    return (
        <div className="pincode-item-search-page-card"
            onClick={() => toggleCategorySelection(categoryObj.category)}>
            <div
                className={categoryObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}>
            </div>
            <p className="pincode-item-pincode">{categoryObj.category}</p>
        </div>
    );
};
const BrandCard = ({ brandObj, toggleBrandSelection }) => {
    return (
        <div className="pincode-item-search-page-card"
            onClick={() => toggleBrandSelection(brandObj.brand)}>
            <div
                className={brandObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}>
            </div>
            <p className="pincode-item-pincode">{brandObj.brand}</p>
        </div>
    );
};

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const productsPerPage = 16;
    const [loading, setLoading] = useState(false);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [showSortBy, setShowSortBy] = useState(false);
    const [pincodeLoading, setPincodeLoading] = useState(true);
    const [pincodesLoaded, setPincodesLoaded] = useState(false);

    const [showPincode, setShowPincode] = useState(true);
    const [showCategory, setShowCategory] = useState(false);
    const [showBrand, setShowBrand] = useState(false);

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

    const [selectedPincodes, setSelectedPincodes] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Function to get cookie value
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
                setSelectedPincodes(pincodesData); // Set all pincodes, not just selected ones
                setPincodesLoaded(true); // Set pincodes as loaded
            } catch (error) {
                console.error("Error parsing userpincodes cookie", error);
            }
        } else {
            console.log("No pincodes found in cookie.");
        }
        setPincodeLoading(false);
    }, []);

    const fetchProducts = async () => {
        if (loading || !hasMoreProducts || !pincodesLoaded) return;
        setLoading(true);
        try {
            const searchByPincode = selectedPincodes.filter(pin => pin.selected).map(pin => pin.pincode);

            const response = await fetch(
                `${REACT_APP_API_URL}/api/v1/product/products?pincode=${searchByPincode.join(',')}&keyword=${inputValue}&page=${page}&limit=${productsPerPage}
                &categories=${selectedCategories.join(',')}`
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const data = await response.json();
            if (data.products && data.products.length > 0) {
                setProducts((prevProducts) =>
                    page === 1 ? data.products : [...prevProducts, ...data.products]
                );
            } else {
                setHasMoreProducts(false);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePincodeSelection = (pincode) => {
        setSelectedPincodes((prevSelectedPincodes) => {
            const updatedPincodes = prevSelectedPincodes.map(pin =>
                pin.pincode === pincode
                    ? { ...pin, selected: !pin.selected }
                    : pin
            );
            return updatedPincodes; // Return updated pincode list
        });
        setSearchParams({ query: inputValue });
        setProducts([]); // Reset products on pincode change
        setPage(1); // Reset page
        setHasMoreProducts(true); // Reset product loading
    };

    const [toggleBrandUsestate, setToggleBrandUsestate] = useState(false);
    const toggleBrandSelection = (brand) => {
        setSelectedBrands((prevSelectedBrands) => {
            const updatedBrands = prevSelectedBrands.map(b =>
                b.brand === brand
                    ? { ...b, selected: !b.selected }
                    : b
            );
            return updatedBrands;
        });


        // Update selectedCategories based on the toggled state
        setSelectedBrands((brand) => {
            if (prevSelected.includes(brand)) {
                // If the category is already selected, remove it
                return prevSelected.filter(item => item !== brand);
            } else {
                // If the category is not selected, add it
                return [...prevSelected, brand];
            }
        });

        setToggleBrandUsestate(!toggleBrandUsestate);
        setProducts([]);
        setPage(1);
        setHasMoreProducts(true);
    };


    const [toggleCategoryUsestate, setToggleCategoryUsestate] = useState(false);
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
                // If the category is already selected, remove it
                return prevSelected.filter(item => item !== categoryName);
            } else {
                // If the category is not selected, add it
                return [...prevSelected, categoryName];
            }
        });

        // Manage other state resets
        setToggleCategoryUsestate(!toggleCategoryUsestate);
        setProducts([]);  // Reset products
        setPage(1);       // Reset pagination
        setHasMoreProducts(true);  // Reset flag for loading more products
    };




    useEffect(() => {
        fetchProducts();
    }, [inputValue, toggleCategoryUsestate, toggleBrandUsestate, page, selectedPincodes, selectedBrands, selectedCategories, pincodesLoaded]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setSearchParams({ query: event.target.value });
        setProducts([]); // Reset products on input change
        setPage(1); // Reset page
        setHasMoreProducts(true); // Allow fetching of new products
    };

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;

        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreProducts && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreProducts, loading]);



    const [sortType, setSortType] = useState();
    const sortProducts = (order) => {
        const sorted = [...products].sort((a, b) => {
            if (order === 'lowToHigh') {
                setSortType('lowToHigh');
                return a.price - b.price; // Sort ascending
            } else {
                setSortType('highToLow')
                return b.price - a.price; // Sort descending
            }
        });
        setProducts(sorted);
    };



    return (
        <>
            {!showFilter && !showSortBy && (
                <>
                    <div id="product-search-container-top">
                        <div id='product-search-container-top-div'>
                            <MdOutlineKeyboardArrowLeft size={'25px'} onClick={() => navigate('/')} />
                            <input
                                style={{ borderRadius: "5px" }}
                                id="product-search-bar"
                                placeholder="Search"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div style={{ width: "100vw", height: "57px", backgroundColor: "white" }}></div>
                    <div id="search-product-page-container">
                        <div id="search-product-page-grid">
                            {products.map((product) => (
                                <div key={product?._id}>
                                    {product?.images && product?.title && product?.price && (
                                        <ProductCard
                                            id={product._id || '123ffsekn'}
                                            image={product.images[0]}
                                            title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                                            price={product.price}
                                            quantity={product.quantityAvailable}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {loading &&
                            <>
                                <LoadingSearchPage/>
                            </>}
                        {!hasMoreProducts && <p></p>}
                    </div>
                </>
            )}

            {showFilter && (
                <div className='searchpage-filter-section'>
                    <div id='filter-section-search-page'>
                        <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { setShowSortBy(false); setShowFilter(!showFilter); }} />
                        FILTER SECTION
                    </div>
                    <div id="filter-options-search-page">
                        <div onClick={() => setShowPincode(!showPincode)} className="filter-option-title">
                            <p>Pincode</p>
                            {showPincode ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                        </div>
                        {showPincode && (
                            <div id="filter-pincode-options">
                                {selectedPincodes.map((pincodeObj) => (
                                    <PinCodeCard
                                        key={pincodeObj.pincode}
                                        pincodeObj={pincodeObj}
                                        togglePincodeSelection={togglePincodeSelection}
                                    />
                                ))}
                            </div>
                        )}

                        <div onClick={() => setShowCategory(!showCategory)} className="filter-option-title">
                            <p>Category</p>
                            {showCategory ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                        </div>
                        {showCategory && (
                            <div id="filter-category-options">
                                {categories.map((cat, idx) => (
                                    <CategoryCard key={idx} categoryObj={cat} toggleCategorySelection={toggleCategorySelection} />
                                ))}
                            </div>
                        )}

                        <div onClick={() => setShowBrand(!showBrand)} className="filter-option-title">
                            <p>Brand</p>
                            {showBrand ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                        </div>
                        {showBrand && (
                            <div id="filter-brand-options">
                                {brands.map((cat, idx) => (
                                    <BrandCard key={idx} brandObj={cat} toggleBrandSelection={toggleBrandSelection} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showSortBy && (
                <div className='searchpage-sortby-section'>
                    <div id='pincode-you-location'>
                        <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { setShowSortBy(!showSortBy); }} />
                        SORT BY SECTION
                    </div>
                    <div id="sortby-options">

                        <div className="pincode-item-search-page-card"
                            onClick={() => { sortProducts('lowToHigh'); }}>
                            <div
                                className={sortType === 'lowToHigh' ? 'pincode-item-selected' : 'pincode-item-unselected'}>
                            </div>
                            <p className="pincode-item-pincode">low to high</p>
                        </div>
                        <div className="pincode-item-search-page-card"
                            onClick={() => { sortProducts('highToLow'); }}>
                            <div className={sortType === 'highToLow' ? 'pincode-item-selected' : 'pincode-item-unselected'}>
                            </div>
                            <p className="pincode-item-pincode">   high to low</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
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

export default SearchPage;

