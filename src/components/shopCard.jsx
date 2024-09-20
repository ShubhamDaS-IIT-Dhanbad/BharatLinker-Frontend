import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/shopCard.css"; // Make sure to use the appropriate CSS file

import { CiLocationArrow1 } from "react-icons/ci";

function ShopCard({ shop }) {
    const navigate = useNavigate();

    const shopImageUrl = shop.images[0] || 'http://res.cloudinary.com/dicsxehfn/image/upload/v1715907822/p6yehdqg0uwnl3jmpxmt.jpg'; // Provide a default image URL
    const shopDisplayName = shop.shopName || 'Shop Name'; // Provide a default shop name

    return (
        <div className="shop-card" onClick={() => navigate(`/shop/${shop._id}`)}>
            <div className="shop-card-top">
                <img className="shop-card-top-image" src={shopImageUrl} alt={shopDisplayName} />
            </div>
            <div className='shop-card-bottom-container'>
                <div id="shop-card-shop-price">
                    <span className='shop-card-shop-name'>{shopDisplayName}</span>
                </div>
                <div id='shop-card-bottom-icons'>
                    <div id='shop-card-bottom-cart-icon'>
                        < CiLocationArrow1 size={30} />
                    </div>
                    <div id='shop-card-bottom-instock'>
                       OPENED
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopCard;
