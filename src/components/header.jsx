import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import '../styles/header.css';

import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosSearch } from 'react-icons/io';
import { CiDeliveryTruck } from 'react-icons/ci';
import { CiShoppingCart } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';

import { BsShop } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";

function Navbar() {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchInput, setSearchInput] = useState(''); // For handling search input
    const [hideHeader, setHideHeader] = useState(false); // For controlling header visibility
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Adjust the value as needed
                setHideHeader(true);
            } else {
                setHideHeader(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSearchClick = () => {
        setSearchVisible(true);
    };

    const handleCloseClick = () => {
        setSearchVisible(false);
    };

    const handleSearchSubmit = () => {
        if (searchInput.trim()) {
            navigate(`/search?query=${searchInput}`); // Navigate to the search page with the search query
        }
    };

    const handleShopRedirect = () => {
        navigate('/shop'); // Redirect to the Shop page
    };
    
    return (
        <div style={{ position: 'fixed', top: '0px', display: 'flex', flexDirection: 'column', width: '100vw' }}>
            {/* Search Bar and Icons */}
            <div id='header-div'>
                {!searchVisible && <RxHamburgerMenu id='header-div-ham' />}
                {!searchVisible && (
                    <div id='header-div-right-div'>
                        <IoIosSearch id='header-div-search' onClick={handleSearchClick} />
                        <CiDeliveryTruck id='header-div-truck' />
                        <CiShoppingCart id='header-div-cart' />
                    </div>
                )}
                {searchVisible && (
                    <div id='header-div-search-div'>
                        <IoIosSearch id='header-div-search-div-search' onClick={handleSearchSubmit} />
                        <input
                            id='header-div-input'
                            placeholder="Search..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)} // Update search input value
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()} // Trigger search on Enter key
                        />
                        <IoClose id='header-div-search-div-cross' onClick={handleCloseClick} />
                    </div>
                )}
            </div>
            
            {/* Home Div Header (below search bar) */}
            <div 
                id='home-div-header' 
                style={{ 
                    transform: hideHeader ? 'translateY(-100%)' : 'translateY(0)', 
                    transition: 'transform 0.3s ease', 
                    position: 'relative',  // Changed to relative so it appears below the search bar
                    top: '0',
                    width: '100vw' ,
                    zIndex:"-11111"
                }}
            >
                <div className='home-div-header-divs'>
                    <BsShop className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
                <div className='home-div-header-divs'>
                    <RiAdminLine className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
                <div className='home-div-header-divs'>
                    <BsShop className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
                <div className='home-div-header-divs'>
                    <BsShop className='home-div-header-divs-icon' onClick={handleShopRedirect} />
                    <p>SHOP</p>
                </div>
                <div className='home-div-header-divs' style={{ borderRightStyle: "none" }}>
                    <RiAdminLine className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
