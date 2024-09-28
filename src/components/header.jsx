import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";

function Navbar() {
    const [searchInput, setSearchInput] = useState('');
    const [hideHeader, setHideHeader] = useState(false);
    const [address, setAddress] = useState({ city: "Enter", postcode: "Pincode" });
    const navigate = useNavigate();

    // Retrieve address from cookie
    useEffect(() => {
        const existingAddressCookie = document.cookie.split('; ').find(row => row.startsWith('address='));
        const userPincodesCookie = document.cookie.split('; ').find(row => row.startsWith('userpincodes='));

        if (!userPincodesCookie || !existingAddressCookie) {
            // Ensure geolocation is available in the browser
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                            );
                            const data = await response.json();
                            const locationPincode = data.address.postcode || 'Add Pincode';

                            // Set the address to the state
                            setAddress({ city: data.address.city || data.address.town || 'Unknown City', postcode: locationPincode });

                            const expirationTime = new Date();
                            expirationTime.setTime(expirationTime.getTime() + (60 * 60 * 1000)); // 1 hour expiry
                            const expires = `expires=${expirationTime.toUTCString()}`;

                            // Store address and pincode as cookies with expiration
                            document.cookie = `address=${encodeURIComponent(JSON.stringify(data.address))}; ${expires}; path=/`;

                            const userPincodes = [
                                {
                                    pincode: locationPincode,
                                    selected: true,
                                },
                            ];

                            document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(userPincodes))}; ${expires}; path=/`;
                        } catch (error) {
                            console.error("Error fetching pincode:", error);
                        }
                    },
                    (error) => {
                        console.error("Geolocation error:", error.message);
                    }
                );
            } else {
                console.error("Geolocation is not available in this browser.");
            }
        } else {
            try {
                // Extract and decode the cookie value
                const addressCookie = decodeURIComponent(existingAddressCookie.split('=')[1]);
                if (addressCookie) {
                    try {
                        const data = JSON.parse(addressCookie);
                        setAddress({ city: data.city || data.town || 'Unknown City', postcode: data.postcode || 'Pincode' });
                    } catch (error) {
                        console.error("Error parsing address cookie", error);
                    }
                }
            } catch (error) {
                console.error("Error parsing userpincodes cookie", error);
            }

            // Handle userPincodes cookie safely
            if (userPincodesCookie) {
                try {
                    const pincodesCookie = decodeURIComponent(userPincodesCookie.split('=')[1]);
                    if (pincodesCookie) {
                        const pincodesData = JSON.parse(pincodesCookie);
                    }
                } catch (error) {
                    console.error("Error parsing userpincodes cookie", error);
                }
            }
        }
    }, []);

    // Hide header on scroll
    useEffect(() => {
        const handleScroll = () => {
            setHideHeader(window.scrollY > 80);
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
    );
}

export default Navbar;
