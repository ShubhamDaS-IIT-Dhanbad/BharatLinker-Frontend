import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { AiOutlineProduct } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import { LuStepBack } from "react-icons/lu";
import { ToastContainer } from 'react-toastify';

import 'react-loading-skeleton/dist/skeleton.css';
import '../retailerStyles/retailerHomePageHeaderFooter.css';
import '../retailerStyles/retailerProductHeaderFooter.css';

function RetailerHomePageHeaderFooter() {
    const [searchInput, setSearchInput] = useState('');
    const [shopDetails, setShopDetail] = useState({});
    const navigate = useNavigate();
    const location = useLocation();  // Get current location

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
            // Perform search logic
        }
    };

    // Conditionally set the color based on current route
    const getActiveStyle = (path) => {
        return location.pathname === path ? { color: 'rgb(42, 255, 67)' } : { color: 'white' };
    };

    return (
        <div>
            <div className="headerDiv">
                <div className="headerDivSearchDiv" style={{ marginTop: "10px" }}>
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

            <div className="homeFooter" style={{zIndex:"90000"}}>
                <div
                    className="homeFooterShop"
                    onClick={() => navigate('/retailer/product')}
                    style={getActiveStyle('/retailer/product')}
                >
                    <AiOutlineProduct size={30} />
                    Product
                </div>
                <div
                    className="homeFooterShop"
                    onClick={() => navigate('/retailer/uploadproduct')}
                    style={getActiveStyle('/retailer/uploadproduct')}
                >
                    <FiUploadCloud size={30} />
                    Upload
                </div>
                <div
                    className="homeFooterShop"
                    onClick={() => navigate('/retailer/home')}
                    style={getActiveStyle('/retailer/shop')}
                >
                    <LuStepBack size={30} />
                    Back
                </div>
            </div>
        </div>
    );
}

export default RetailerHomePageHeaderFooter;
