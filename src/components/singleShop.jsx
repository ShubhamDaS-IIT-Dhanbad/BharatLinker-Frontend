import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/singleShop.css";

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

import ReferenceProduct from './shopReferenceComponent/referenceProduct.jsx';
import REACT_APP_API_URL from '../../public/constant.js';

const ShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [shopDetails, setShopDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDescription, setShowDescription] = useState(false);

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

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    return (
        <Fragment>
            {loading ? (
                <>Loading...</>
            ) : (
                shopDetails && (
                    <Fragment>
                        <div id="shop-search-container-top">
                            <div id='shop-search-container-top-div'>
                                <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { navigate('/') }} />
                                <input
                                    id="shop-search-bar"
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
                                            <img src={image}  id="shop-details-img-selected"  key={index} />
                                       </div>
                                    ))}
                            </div>

                            <div id="ShopDetails">
                                <div id="ShopDetails-trending">Verified Shop</div>
                                <p id="detailsBlock-1-pid">Shop # {shopDetails._id}</p>
                                <div id="detailsBlock-1-title">{shopDetails.shopName}</div>
                            </div>

                            <div id="shopDetails-see-all-brand-product">
                                See All {shopDetails.brand} Products <MdOutlineKeyboardArrowRight size={11} />
                            </div>

                            <div id="shopDetails-shop" style={{ cursor: 'pointer' }}>
                                Location: 
                                <IoLocationOutline size={20} />
                            </div>

                            <div id="shopDetails-price-button">
                                <p></p>
                                <div className={`shopDetails-button-status ${1 < 0 ? 'opened' : 'closed'}`}>
                                    {1 < 0 ? 'OPENED' : 'CLOSED'}
                                </div>
                            </div>

                            <div id="shopDetails-hr"></div>

                            <div id="shopDetails-about" onClick={toggleDescription} style={{ cursor: 'pointer' }}>
                                <p>Address</p>
                                {showDescription ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            {showDescription && (
                                <div id="shopDetails-description">
                                    {/* Description: {shopDetails.description} */}
                                </div>
                            )}
                            <div id="shopDetails-hr"></div>

                            <div id="shopDetails-about" onClick={toggleDescription} style={{ cursor: 'pointer' }}>
                                <p>Contact</p>
                                {showDescription ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            {showDescription && (
                                <div id="shopDetails-description">
                                    {/* Description: {shopDetails.description} */}
                                </div>
                            )}
                            <div id="shopDetails-hr"></div>

                            <div id="shopDetails-similar">
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
