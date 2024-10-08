import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { HiOutlineUserCircle } from 'react-icons/hi';
import { BiSearchAlt } from 'react-icons/bi';
import { MdOutlineStore, MdOutlineAdminPanelSettings } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { resetRetailerData } from '../redux/features/retailerDataSlice'; // Adjust the path as necessary


import 'react-loading-skeleton/dist/skeleton.css';
import '../retailerStyles/retailerHomePageHeaderFooter.css';

import { LuLayoutDashboard } from 'react-icons/lu';
import { HiOutlineCreditCard } from 'react-icons/hi2';
import { IoIosCloseCircleOutline } from "react-icons/io";

function RetailerHomePageHeaderFooter() {
    const [searchInput, setSearchInput] = useState('');
    const [shopDetails, setShopDetail] = useState({});
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    // Function to get retailer data from the cookie
    const getBharatLinkerRetailerCookie = () => {
        const cookieName = 'BharatLinkerRetailer=';
        const cookieArray = document.cookie.split('; ');
        const foundCookie = cookieArray.find(row => row.startsWith(cookieName));
        const data = foundCookie ? JSON.parse(decodeURIComponent(foundCookie.split('=')[1])) : null;
        return data;
    };

    // Fetch shop details from the cookie on component mount
    useEffect(() => {
        const retailerData = getBharatLinkerRetailerCookie();
        if (retailerData) {
            setShopDetail(retailerData);
        }
    }, []);

    const handleSearchSubmit = () => {
        if (searchInput.trim()) {
            // Add your search functionality here
        }
    };

    const dispatch = useDispatch(); 
    const handleLogout = () => {
        document.cookie = "BharatLinkerRetailer=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        dispatch(resetRetailerData());
        navigate('/');
    };

    // Define active class for current route
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div>
            <div className="headerDiv">
                <div className="headerDivUser">
                    <div style={{ display: "flex" }}>
                        <HiOutlineUserCircle className="headerDivUserIcon" size={35} />
                        <div className="headerDivUserLocationDiv">
                            <p className="headerDivUserLocation">Retailer</p>
                            <div className="headerDivUserLocationName">
                                Hi, <span className='headerDivUserLocationName-shop-name'>{shopDetails?.shopName || 'Retailer'}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{marginRight:"20px"}} onClick={()=>navigate('/')}>
                        <IoIosCloseCircleOutline size={30} />
                    </div>
                </div>

                <div className="headerDivSearchDiv">
                    <div className="headerDivSearchDivInput">
                        <BiSearchAlt style={{ color: "white" }} className="headerDivSearchIcon" onClick={handleSearchSubmit} />
                        <input
                            className="headerDivSearchInput"
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
                    style={{ position: "fixed", top: "87vh" }}
                />
            </div>

            <div className="homeFooter">
                <div
                    className={`homeFooterShop ${isActive('/retailer/home')}`}
                    onClick={() => navigate('/retailer/home')}
                >
                    <LuLayoutDashboard size={30} />
                    Home
                </div>
                <div
                    className={`homeFooterShop ${isActive('/retailer/shop')}`}
                    onClick={() => navigate('/retailer/shop')}
                >
                    <MdOutlineStore size={30} />
                    Shop
                </div>
                <div
                    className={`homeFooterShop ${isActive('/retailer/product')}`}
                    onClick={() => navigate('/retailer/product')}
                >
                    <HiOutlineCreditCard size={30} />
                    Product
                </div>

                <div
                    className={`homeFooterShop ${isActive('/logout')}`} // Update path as per your requirement
                    onClick={handleLogout}
                >
                    <MdOutlineAdminPanelSettings size={30} />
                    LogOut
                </div>
            </div>
        </div>
    );
}

export default RetailerHomePageHeaderFooter;
