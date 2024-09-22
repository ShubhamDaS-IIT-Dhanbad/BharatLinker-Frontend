import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import '../styles/header.css';

import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoIosSearch } from 'react-icons/io';
import { BiSearchAlt } from "react-icons/bi";


import { CiDeliveryTruck } from 'react-icons/ci';
import { CiShoppingCart } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';

import { BsShop } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";

function Navbar() {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchInput, setSearchInput] = useState(''); // For handling search input
    const [hideHeader, setHideHeader] = useState(false); // For controlling header visibility
    const navigate = useNavigate(); 

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
        <>
            <div id='header-div'>
                {!searchVisible && <HiOutlineUserCircle  id='header-div-ham' />}
                {!searchVisible && (
                    <div id='header-div-right-div'>
                        <IoIosSearch id='header-div-search' onClick={handleSearchClick} />
                        <CiDeliveryTruck id='header-div-truck' />
                        <CiShoppingCart id='header-div-cart' />
                    </div>
                )}
                {searchVisible && (
                    <div id='header-div-search-div'>
                        <BiSearchAlt id='header-div-search-div-search' onClick={handleSearchSubmit} />
                        <input
                            id='header-div-input'
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)} // Update search input value
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()} // Trigger search on Enter key
                        />
                        <IoClose id='header-div-search-div-cross' onClick={handleCloseClick} />
                    </div>
                )}
            </div>
            
            {/* Home Div Header (below search bar) */}
            
        </>
    );
}

export default Navbar;
