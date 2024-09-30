import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
    const [searchInput, setSearchInput] = useState('');
    const [hideHeader, setHideHeader] = useState(false);
    const [address, setAddress] = useState({ city: "Enter", postcode: "Pincode" });
    const navigate = useNavigate();

    useEffect(() => {
        const savedAddress = document.cookie.split('; ').find(row => row.startsWith('address='));
        
        if (savedAddress) {
            const data = JSON.parse(decodeURIComponent(savedAddress.split('=')[1]));
            const locationPincode = data.postcode || 'Add Pincode';
            const locationCity = data.city || data.town || data.village || data.state_district || data.state || 'Unknown City';
            setAddress({ city: locationCity, postcode: locationPincode });
        } else {
            fetchLocation();
        }
    }, []);

    const fetchLocation = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            const locationPincode = data.address.postcode || 'Add Pincode';
            const locationCity = data.address.city || data.address.town || data.address.village || data.address.state_district || data.address.state || 'Unknown City';

            setAddress({ city: locationCity, postcode: locationPincode });

            // Set cookies with the new location data
            const expirationTime = new Date();
            expirationTime.setTime(expirationTime.getTime() + (60 * 60 * 1000)); // 1 hour expiry
            const expires = `expires=${expirationTime.toUTCString()}`;
            document.cookie = `address=${encodeURIComponent(JSON.stringify(data.address))}; ${expires}; path=/`;

            const userPincodes = [
                {
                    pincode: locationPincode,
                    selected: true,
                },
            ];

            document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(userPincodes))}; ${expires}; path=/`;

            // Show success toast
            toast.success(`Location updated to ${locationCity} (${locationPincode})!`);

        } catch (error) {
            console.error("Error fetching location or geolocation not available:", error);
            toast.error(`Failed to fetch location: ${error.message}`, {
                position: "bottom-center",
                autoClose: 5000
            });
        }
    };

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

            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                draggable
                pauseOnHover
                style={{
                    position: "fixed",
                    top: "87vh"
                }}
            />
        </div>
    );
}

export default Navbar;
