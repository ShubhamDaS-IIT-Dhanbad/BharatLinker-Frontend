import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/singleShop.css";

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

import ReferenceProduct from './shopReferenceComponent/shopFragment.jsx';
import { RETAILER_SERVER } from '../../public/constant.js';
import axios from 'axios';
import LoadingSingleShop from './loadingComponents/loadingSingleShop.jsx';

import { BiSearchAlt } from "react-icons/bi";
import { TbHomeMove } from "react-icons/tb";
import { MdOutlineStore } from "react-icons/md";

const ShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [shopDetails, setShopDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showContact, setShowContact] = useState(false);
    const [showAddress, setShowAddress] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${RETAILER_SERVER}/shop/getshopdetails?shopId=${shopId}`);
                setShopDetails(response.data.shop);
                setLoading(false);
            } catch (err) {
                console.error("Error while fetching shop details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shopId]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const toggleContact = () => {
        setShowContact(!showContact);
    };
    const toggleAddress = () => {
        setShowAddress(!showAddress);
    };

    return (
        <Fragment>

            <div id='shop-details-search-container-top'>
                <div id='shop-details-search-container-top-div'>
                    <BiSearchAlt size={40} id='header-div-search-div-search' />
                    <input
                        id='shop-details-search-bar'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Products"
                        onKeyDown={handleEnter}
                    />
                    < MdOutlineStore   onClick={() => { navigate('/shop') }}  size={35} style={{ paddingRight: "10px" }} />
                </div>
            </div>

            {loading ? (
                <LoadingSingleShop />
            ) : (
                shopDetails && (
                    <Fragment>
                        <div id="shop-details-container">
                            <div id="shop-details-img">
                                {shopDetails.shopImages.map((image, index) => (
                                    <div id="shop-details-img-div" key={index}>
                                        <img src={image} id="shop-details-img-selected" />
                                    </div>
                                ))}
                            </div>

                            <div id="shop-details-info">
                                <div id="shop-details-trending">Verified Shop</div>
                                <p id="shop-details-id">Shop # {shopDetails._id}</p>
                                <div id="shop-details-title">{shopDetails.shopName}</div>
                            </div>

                            <div id="shop-details-see-all-products">
                                See All {shopDetails.brand} Products <MdOutlineKeyboardArrowRight size={11} />
                            </div>

                            <div id="shop-details-location" style={{ cursor: 'pointer' }}>
                                Location:
                                <IoLocationOutline size={20} />
                            </div>

                            <div id="shop-details-status">
                                <p></p>{console.log(shopDetails.status)}
                                <div className={`shop-details-status-button ${shopDetails.status === 'opened' ? 'opened' : 'closed'}`}>
                                    {shopDetails.status === 'opened' ? 'OPENED' : 'CLOSED'}
                                </div>
                            </div>

                            <div id="shop-details-hr"></div>

                            <div id="shop-details-about" onClick={toggleAddress} style={{ cursor: 'pointer' }}>
                                <p style={{ fontSize: "19px", fontWeight: "900" }}>Address</p>
                                {showAddress ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            {showAddress && (
                                <div id="shop-details-description">
                                    {shopDetails.address}
                                </div>
                            )}

                            <div id="shop-details-hr"></div>

                            <div id="shop-details-contact" onClick={toggleContact} style={{ cursor: 'pointer' }}>
                                <p style={{ fontSize: "19px", fontWeight: "900" }}>Contact</p>
                                {showContact ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            {showContact && (
                                <div id="shop-details-description">
                                    {shopDetails?.phoneNumber ? `PHN ${shopDetails?.phoneNumber}` : ""}
                                    <br />
                                    {shopDetails?.email ? `Email ${shopDetails?.email}` : ""}
                                </div>
                            )}

                            <div id="shop-details-hr"></div>

                            <div id="shop-details-similar-products">
                                <p>Available Products</p>
                                <ReferenceProduct shopId={shopDetails._id} />
                            </div>
                        </div>
                    </Fragment>
                )
            )}
        </Fragment>
    );
};

export default ShopDetails;
