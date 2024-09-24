import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLocationArrow1 } from "react-icons/ci";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "../styles/shopCard.css";

function ShopCard({ shop }) {
    const navigate = useNavigate();
    const [showAddress, setShowAddress] = useState(false);

    const shopImageUrl = shop.images && shop.images[0] ? shop.images[0] : 'https://via.placeholder.com/300x180';
    const shopDisplayName = shop.shopName || 'Shop Name';

    const toggleAddress = () => {
        setShowAddress(!showAddress);
    };

    return (
        <div className="shop-card-container">
            <div className="shop-card-header" onClick={() => navigate(`/shop/${shop._id}`)}>
                <img className="shop-card-image" src={shopImageUrl} alt={shopDisplayName} />
            </div>

            <div className='shop-card-details'>
                <span className='shop-card-name'>{shopDisplayName}</span>

                <div className="shop-card-info">

                    <div className="shop-card-divider"></div>
                    <div className="shop-card-address-toggle" onClick={toggleAddress} style={{ cursor: 'pointer' }}>
                        <p>Category</p>
                        {showAddress ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </div>

                    {showAddress && (
                        <div className="shop-card-address">
                            <p>Shop Address here</p> {/* Replace with actual address from shop data */}
                        </div>
                    )}

                    <div className="shop-card-divider"></div>
                </div>
            </div>
        </div>
    );
}

export default ShopCard;
