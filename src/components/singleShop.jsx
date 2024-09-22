import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/singleShop.css";

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

import ReferenceProduct from './shopReferenceComponent/shopFragment.jsx';
import REACT_APP_API_URL from '../../public/constant.js';

const ShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [shopDetails, setShopDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showAddress, setShowAddress] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${REACT_APP_API_URL}/api/v1/shop/shopdetail/${shopId}`);
                const data = await response.json();
                setShopDetails(data.shop);
                console.log("Fetched shop details:", data.shop);
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
            {loading ? (
                <>Loading...</>
            ) : (
                shopDetails && (
                    <Fragment>
                        <div id="shop-details-search-container-top">
                            <div id='shop-details-search-container-top-div'>
                                <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { navigate('/') }} />
                                <input
                                    id="shop-details-search-bar"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search"
                                    onKeyDown={handleEnter}
                                />
                            </div>
                        </div>

                        <div id="shop-details-container">
                            <div id="shop-details-img">
                                {shopDetails.images.map((image, index) => (
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
                                <p></p>
                                <div className={`shop-details-status-button ${1 < 0 ? 'opened' : 'closed'}`}>
                                    {1 < 0 ? 'OPENED' : 'CLOSED'}
                                </div>
                            </div>

                            <div id="shop-details-hr"></div>

                            <div id="shop-details-about" onClick={toggleAddress} style={{ cursor: 'pointer' }}>
                                <p>Address</p>
                                {showAddress ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            {showAddress && (
                                <div id="shop-details-description">
                                    helow
                                </div>
                            )}
                            <div id="shop-details-hr"></div>

                            <div id="shop-details-contact" onClick={toggleContact} style={{ cursor: 'pointer' }}>
                                <p>Contact</p>
                                {showContact ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            {showContact && (
                                <div id="shop-details-description">
                                   helow
                                </div>
                            )}
                            <div id="shop-details-hr"></div>

                            <div id="shop-details-similar-products">
                                <p>Product Available</p>
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
