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
        const existingAddressCookie = document.cookie.split('; ').find(row => row.startsWith('address='));
        const userPincodesCookie = document.cookie.split('; ').find(row => row.startsWith('userpincodes='));

        if (!userPincodesCookie || !existingAddressCookie) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                            );
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            const data = await response.json();
                            const locationPincode = data.address.postcode || 'Add Pincode';

                            setAddress({ city: data.address.city || data.address.town || 'Unknown City', postcode: locationPincode });

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

                            toast.success(`Location updated to ${data.address.city || data.address.town} (${locationPincode})!`);

                        } catch (error) {
                            console.error("Error fetching pincode:", error);
                            toast.error(`Failed to fetch location: ${error.message}`, { 
                                position: "bottom-center", 
                                autoClose: 5000 
                            });
                        }
                    },
                    (error) => {
                        console.error("Geolocation error:", error.message);
                        toast.error(`Geolocation error: ${error.message}`, { 
                            position: "bottom-center", 
                            autoClose: 5000 
                        });
                    }
                );
            } else {
                console.error("Geolocation is not available in this browser.");
                toast.error("Geolocation is not available in this browser.", { 
                    position: "bottom-center", 
                    autoClose: 5000 
                });
            }
        } else {
            try {
                const addressCookie = decodeURIComponent(existingAddressCookie.split('=')[1]);
                if (addressCookie) {
                    const data = JSON.parse(addressCookie);
                    setAddress({ city: data.city || data.town || 'Unknown City', postcode: data.postcode || 'Pincode' });
                }
                
                toast.success(`Location updated`);

            } catch (error) {
                console.error("Error parsing address cookie", error);
            }

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
                position="bottom-center" // Set position to bottom-center
                autoClose={5000} // Auto close after 5 seconds
                hideProgressBar={false} // Show progress bar
                closeOnClick // Close on click
                draggable // Enable dragging
                pauseOnHover // Pause on hover
                style={{
                    position:"fixed",
                    top:"97vh"
                }}
            />
        </div>
    );
}

export default Navbar;
