import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './productCard.jsx';
import '../styles/searchPage.css';
import REACT_APP_API_URL from '../../public/constant.js';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);
    const [products, setProducts] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [pincode, setPincode] = useState('742136');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(1);
    const productsPerPage = 4;
    const [loading, setLoading] = useState(false);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);

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

    const handleApplyFilter = () => {
        localStorage.setItem('pincode', JSON.stringify([pincode]));
        setShowFilter(false);
    };

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreProducts && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
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


            {!showFilter && (
                <div id="search-product-page-container" onScroll={handleScroll} style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                    <div id="search-product-page-grid" style={{ marginTop: '70px' }}>
                        {products.map((product) => (
                            <div key={product?._id}>
                                {product?.images && product?.title && product?.price && (
                                    <ProductCard
                                        id={product?._id}
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
            )}
            {showFilter && (
                <div className='modal' style={{ marginTop: "200px" }}>
                    <div className='modal-content'>
                        <AiOutlineClose className='modal-close' onClick={() => setShowFilter(false)} />
                        <h2>Filter Options</h2>

                        <div className="filter-inputs">
                            <label>Pincode</label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                placeholder="Enter Pincode"
                            />

                            <label>Min Price</label>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Enter Min Price"
                            />

                            <label>Max Price</label>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Enter Max Price"
                            />
                        </div>

                        <button onClick={handleApplyFilter}>Apply Filters</button>
                    </div>
                </div>
            )}

            <div id='home-footer'>
                <div id='home-footer-sortby'>
                    <LiaSortSolid size={25} />
                    SORT BY
                </div>
                <div id='home-footer-filterby' onClick={() => setShowFilter(true)}>
                    <MdFilterList size={25} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default SearchPage;
