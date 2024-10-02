import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';

import '../styles/home.css';
import b1 from '../assets/b1.jpg';
import bh1 from '../../public/bharatlinkerlogo.png'
import bh2 from '../../public/bh2.jpg'
import { MdOutlineStore } from "react-icons/md";
import { RiSunCloudyLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import ExploreByCategories from './homePageComponent/exploreByCategory.jsx';
import HomePageProducts from './homePageComponent/homePageProducts.jsx';
const Home = () => {
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

    const handleRetailerClick = useCallback(() => {
        const retailerCookie = getCookieValue('BharatLinkerRetailer');
        if (retailerCookie) {
            navigate('/retailer/home');
        } else {
            navigate('/retailer');
        }
    }, [navigate]);

    return (
        <div id='home-div' ref={containerRef}>
            <div id='home-body'>
                <img src={bh2} alt="Banner" id='home-body-img' />
                <ExploreByCategories />
                <HomePageProducts/>
            </div>

            <div id='home-footer'>
                <div id='home-footer-shop' onClick={() => navigate('/')}>
                    <RiSunCloudyLine size={40} />
                    Home
                </div>
                <div id='home-footer-shop' onClick={() => navigate('/search')}>
                    <TbCategoryPlus size={40} />
                    Products
                </div>
                <div id='home-footer-shop' onClick={() => navigate('/shop')}>
                    <MdOutlineStore size={40} />
                    Shop
                </div>
                <div id='home-footer-shop' onClick={handleRetailerClick}>
                    <MdOutlineAdminPanelSettings size={40} />
                    Retailer
                </div>
            </div>
        </div>
    );
}

export default memo(Home);
