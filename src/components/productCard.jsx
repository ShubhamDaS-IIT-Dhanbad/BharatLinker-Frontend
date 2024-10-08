import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/productCard.css";

import { CiLocationArrow1 } from "react-icons/ci";
function ProductCard({ id, image, title, price, quantity }) {
    const navigate = useNavigate();

    const imageUrl = image || 'http://res.cloudinary.com/dicsxehfn/image/upload/v1715907822/p6yehdqg0uwnl3jmpxmt.jpg'; // Provide a default image URL
    const productName = title ? (title.length > 45 ? title.substr(0, 45) + '..' : title) : 'Product Name'; // Provide a default product name
    const productPrice = price || '0';

    return (
        <div className="product-card">
            <div className="product-card-top" onClick={() => navigate(`/product/${id}`)}>
                <img className="product-card-top-image" src={imageUrl} />
            </div>
            <div className='product-card-bottom'>
                <div id="product-card-shop-price">
                    <span className='product-card-shop-name'>{productName}</span>
                    <span className='product-card-shop'>
                        ₹{productPrice}
                    </span>
                </div>
                
                    <div className={`product-card-bottom-stock ${quantity > 0 ? 'instock' : 'outofstock'}`}>
                        {quantity > 0? (
                            <span>IN STOCK</span>
                        ) : (
                            <span>OUT OF STOCK</span>
                        )}
                    </div>
            </div>
        </div>
    );
}

export default ProductCard;
