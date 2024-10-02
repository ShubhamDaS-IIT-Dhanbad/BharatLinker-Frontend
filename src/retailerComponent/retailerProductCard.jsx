import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../retailerStyles/retailerProductCard.css";

function RetailerProductCard({ id, image, title, price, quantity }) {
    const navigate = useNavigate();

    const imageUrl = image || 'http://res.cloudinary.com/dicsxehfn/image/upload/v1715907822/p6yehdqg0uwnl3jmpxmt.jpg'; // Provide a default image URL
    const productName = title ? (title.length > 45 ? title.substr(0, 45) + '..' : title) : 'Product Name'; // Provide a default product name
    const productPrice = price || '0';

    return (
        <div className="retailer-product-card">
            <div className="retailer-product-card-image" onClick={() => navigate(`/retailer/updateproduct/${id}`)}>
                <img className="retailer-product-card-img" src={imageUrl} alt="Product Image" />
            </div>
            <div className="retailer-product-card-details">
                <div className="retailer-product-card-header">
                    <span className="retailer-product-card-title">{productName}</span>
                    <span className="retailer-product-card-price">₹{productPrice}</span>
                </div>
                <div className={`retailer-product-card-stock ${quantity > 0 ? 'retailer-instock' : 'retailer-outofstock'}`}>
                    {quantity > 0 ? (
                        <span>IN STOCK</span>
                    ) : (
                        <span>OUT OF STOCK</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RetailerProductCard;
