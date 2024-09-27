import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import '../styles/home.css';
import REACT_APP_API_URL from '../../public/constant.js';
import b1 from '../assets/b1.jpg';
import HomeProductFragment from './productReferenceComponent/homeProductFragment.jsx';
import { MdOutlineStore } from "react-icons/md";
import { RxCaretRight } from "react-icons/rx";
import { RiSunCloudyLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import ExploreByCategories from './homePageComponent/exploreByCategory.jsx';

function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const productsPerPage = 4;
    const [pincode, setPinCode] = useState([]);  // Default to empty array
    const containerRef = useRef(null);

    const navigate = useNavigate();

    // Helper function to get cookie value by name
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

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        if (pincode.length > 0) {
            try {
                const response = await fetch(
                    `${REACT_APP_API_URL}/api/v1/product/products?pincode=${pincode.join(',')}&page=${page}&limit=${productsPerPage}`
                );
                const data = await response.json();
                if (data.products && data.products.length > 0) {
                    setCurrentProducts((prevProducts) => {
                        if (page === 1) {
                            return data.products;
                        }
                        return [...prevProducts, ...data.products]; // Append new products
                    });
                } else {
                    setHasMoreProducts(false);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle fetching and setting pincode from `userpincodes` cookie
    useEffect(() => {
        const pincodesCookie = getCookieValue('userpincodes');
        if (pincodesCookie) {
            try {
                const pincodesData = JSON.parse(pincodesCookie);
                if (pincodesData && pincodesData.length > 0) {
                    setPinCode([pincodesData[0].pincode]); // Use the first pincode from the cookie
                }
            } catch (error) {
                console.error("Error parsing userpincodes cookie", error);
            }
        }
    }, []);

    useEffect(() => {
        setCurrentProducts([]);
        fetchProducts();
    }, [pincode, page]);

    // Intersection Observer for Infinite Scroll
    const observer = useRef();
    const lastProductElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMoreProducts) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMoreProducts]);

    // Reusable Product Section
    const ProductSection = ({ title, keyword, pincode }) => (
        <div id="home-product-details-similar">
            <div id='home-product-details-similar-names'>
                <p>{title}</p>
                <div id='home-product-details-similar-names-see-all'>
                    See All <RxCaretRight size={20} />
                </div>
            </div>
            {loading ? (
                <Skeleton height={200} width={300} count={4} style={{ margin: '10px' }} />
            ) : (
                <HomeProductFragment pincode={pincode} keyword={keyword} />
            )}
        </div>
    );

    return (
        <div id='home-div' ref={containerRef}>
            {loading ? (
                <div>
                    <Skeleton height={400} width={'100%'} />
                    <Skeleton height={30} width={200} style={{ margin: '20px 0' }} />
                    <Skeleton count={3} height={200} width={300} style={{ margin: '10px' }} />
                </div>
            ) : (
                <div id='home-body'>
                    <img src={b1} alt="Banner" id='home-body-img' />
                    <ExploreByCategories />

                    <ProductSection pincode={pincode} title="Exclusive Gadgets" keyword="phone" />
                    <ProductSection pincode={pincode} title="Earbuds" keyword="earbuds" />
                    <ProductSection pincode={pincode} title="New Arrival" keyword="phone" />

                    {loading && <p>Loading more products...</p>}
                    {error && <p>{error}</p>}
                    {!hasMoreProducts && <p>No more products to load.</p>}
                </div>
            )}

            <div id='home-footer'>
                <div id='home-footer-shop' onClick={() => navigate('/')}>
                    <RiSunCloudyLine size={30} />
                    Home
                </div>
                <div id='home-footer-shop' onClick={() => navigate('/search')}>
                    <TbCategoryPlus size={30} />
                    Products
                </div>
                <div id='home-footer-shop' onClick={() => navigate('/shop')}>
                    <MdOutlineStore size={30} />
                    Shop
                </div>
                <div id='home-footer-shop' onClick={() => navigate('/retailer')}>
                    <MdOutlineAdminPanelSettings size={30} />
                    Retailer
                </div>
            </div>
        </div>
    );
}

export default Home;
