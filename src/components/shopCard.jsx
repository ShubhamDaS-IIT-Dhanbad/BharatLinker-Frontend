import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLocationArrow1 } from "react-icons/ci";
import "../styles/shopCard.css"; // Make sure to use the appropriate CSS file

function ShopCard({ shop }) {
    const navigate = useNavigate();

    // Fallback values for the shop's image and name if missing
    const shopImageUrl = shop.images && shop.images[0] ? shop.images[0] : 'https://via.placeholder.com/300x180'; 
    const shopDisplayName = shop.shopName || 'Shop Name'; // Default shop name
    const shopPincode = shop.pincode || 'Pincode'; // Default pincode
    const shopCategory = shop.category || 'Grocery'; // Default category

    return (
        <div className="shop-card" onClick={() => navigate(`/shop/${shop._id}`)}>
            <div className="shop-card-top">
                <img className="shop-card-top-image" src={shopImageUrl} alt={shopDisplayName} />
            </div>
            
            <div className='shop-card-bottom-container'>
                <div id="shop-card-shop-info">
                    <span className='shop-card-shop-name'>{shopDisplayName}</span>
                    <span className='shop-card-shop-category'>{shopCategory}</span>
                    <span className='shop-card-shop-pincode'>{shopPincode}</span>
                </div>
                <div id='shop-card-bottom-icons'>
                    <div id='shop-card-bottom-location-icon'>
                        <CiLocationArrow1 size={25} />
                        <span>{shopPincode}</span>
                    </div>
                    <div id='shop-card-bottom-status'>
                        {shop.isOpen ? 'OPENED' : 'CLOSED'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopCard;
