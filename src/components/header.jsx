import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";

function Navbar() {
    const [searchInput, setSearchInput] = useState('');
    const [hideHeader, setHideHeader] = useState(false);
    const [address, setAddress] = useState({city:"Enter",postcode:"Pincode"});
    const navigate = useNavigate();

    // Retrieve address from cookie
    useEffect(() => {
        const getCookieValue = (name) => {
            const value = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
            return value ? decodeURIComponent(value.split('=')[1]) : null;
        };

        const addressCookie = getCookieValue('address');
        if (addressCookie) {
            const addressData = JSON.parse(addressCookie);
            setAddress(addressData);
        }
    }, []);

    // Hide header on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
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



    const handleSearchSubmit = () => {
        if (searchInput.trim()) {
            navigate(`/search?query=${searchInput}`);
        }
    };

    return (
        <>
            <div className={hideHeader ? 'header-div-hide' : 'header-div-show'}>
                <div className='header-div-user'>
                    <HiOutlineUserCircle id='header-div-ham' size={35} />
                    <div id='header-div-user-location-div'>
                        <p id='header-div-user-location'>Location</p>
                        <div id='header-div-user-location-name' onClick={() => navigate('/pincode')}>
                            {address.city} {address.postcode}
                            <TbChevronDown size={15} />
                        </div>
                    </div>
                </div>

                <div id='header-div-search-div'>
                    <div id='header-div-search-div-1'>
                        <BiSearchAlt id='header-div-search-div-search' onClick={handleSearchSubmit} />
                        <input
                            id='header-div-input'
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
