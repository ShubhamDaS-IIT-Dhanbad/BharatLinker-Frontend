import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import '../styles/header.css';

import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosSearch } from 'react-icons/io';
import { CiDeliveryTruck } from 'react-icons/ci';
import { CiShoppingCart } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';

function Navbar() {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchInput, setSearchInput] = useState(''); // For handling search input
    const navigate = useNavigate(); // Hook for navigation

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

    return (
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
    );
}

export default Navbar;

