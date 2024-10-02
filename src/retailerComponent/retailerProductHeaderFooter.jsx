import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { BiSearchAlt } from 'react-icons/bi';
import { TbChevronDown } from "react-icons/tb";
import { MdOutlineStore, MdOutlineAdminPanelSettings } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import { FiUploadCloud } from "react-icons/fi";
import { LuArrowBigUpDash } from "react-icons/lu";

import 'react-loading-skeleton/dist/skeleton.css';
import '../retailerStyles/retailerHomePageHeaderFooter.css'

import { AiOutlineProduct } from "react-icons/ai";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { LuStepBack } from "react-icons/lu";

function RetailerHomePageHeaderFooter() {
    const [searchInput, setSearchInput] = useState('');
    const [shopDetails, setShopDetail] = useState({});
    const navigate = useNavigate();

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
        }
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

            <div className="homeFooter">

                <div className="homeFooterShop" onClick={() => navigate('/retailer/product')}>
                    <AiOutlineProduct size={30} />
                    Product
                </div>
                <div className="homeFooterShop" onClick={() => navigate('/retailer/uploadproduct')}>
                    <FiUploadCloud size={30} />
                    Upload
                </div>
                {/* <div className="homeFooterShop" onClick={() => navigate('/retailer/productupdate')}>
                    <LuArrowBigUpDash size={30} />
                    Update
                </div> */}
                <div className="homeFooterShop" onClick={() => navigate('/retailer/shop')}>
                    <LuStepBack size={30} />
                    Back
                </div>
            </div>
        </div>
    );
}

export default RetailerHomePageHeaderFooter;
