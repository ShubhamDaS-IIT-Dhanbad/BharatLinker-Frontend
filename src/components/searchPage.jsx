import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './productCard.jsx';
import '../styles/searchPage.css';
import REACT_APP_API_URL from '../../public/constant.js';
import { LiaSortSolid } from "react-icons/lia";

import { MdFilterList, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { AiOutlineClose } from "react-icons/ai";

import r1 from '../assets/realm.jpg'
import o1 from '../assets/oneplus.jpg'

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);
    const [products, setProducts] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [showSortby, setShowSortby] = useState(false);
    const [pincode, setPincode] = useState('742136');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(1);
    const productsPerPage = 4;
    const [loading, setLoading] = useState(false);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);

    const [showPincode, setShowPincode] = useState(true);
    const [showShop, setShowShop] = useState(false);
    const [showCatgory, setShowCategory] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (loading || !hasMoreProducts) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `${REACT_APP_API_URL}/api/v1/product/products?pincode=${pincode}&keyword=${inputValue}&page=${page}&limit=${productsPerPage}`
                );
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                const data = await response.json(); // Ensure data is parsed
                if (data.products && data.products.length > 0) {
                    setProducts((prevProducts) => {
                        if (page === 1) {
                            return data.products; // Replace with new data
                        }
                        return [...prevProducts, ...data.products]; // Append new products
                    });
                } else {
                    setHasMoreProducts(false); // No more products to load
                }

            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [inputValue, minPrice, maxPrice, pincode, page]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setSearchParams({ query: event.target.value });
        setProducts([]); // Reset products on new search
        setPage(1); // Reset to first page
        setHasMoreProducts(true); // Reset the loading state
    };
    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreProducts && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <>
            {!showFilter && !showSortby && (
                <>
                    <div id="shop-search-container-top">
                        <div id='shop-search-container-top-div'>
                            <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { navigate('/') }} />
                            <input
                                id="shop-search-bar"
                                placeholder="Search"
                                onKeyDown={handleInputChange}

                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div style={{ width: "100vw", height: "57px", backgroundColor: "black" }}></div>



                    <div id="search-product-page-container" onScroll={handleScroll}
                        style={{ overflowY: 'auto', maxHeight: '80vh' }}>

                        {/* {query.length>0 && <div className="search-product-page-query">Showing result for {query}</div>} */}

                        <div id="search-product-page-grid">
                            {products.map((product) => (
                            <div key={product?._id}>
                                {product?.images && product?.title && product?.price && (
                                    <ProductCard
                                        id={product?._id ?product?._id: '123ffsekn'}
                                        image={product?.images[0]}
                                        title={product?.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                                        price={product?.price}
                                        quantity={product?.quantityAvailable}
                                    />
                                )}
                            </div>
                        ))}


                        </div>
                        {loading && <p>Loading more products...</p>}
                        {!hasMoreProducts && <p>No more products to load.</p>}
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

export default SearchPage;
