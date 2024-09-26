import React from 'react';
import '../styles/loadingSingleProduct.css'; // Make sure the file name matches

const LoadingSingleProductPage = () => {
    return (
        <div id="loading-single-product-page-container">
            <div id='loading-single-product-body-img' />
            <div id='loading-single-product-body-down-1' />
            
            <div className="product-fragment-reference-product-container-loading">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div className="product-fragment-reference-card-loading" key={index}>
                        {/* Loading placeholder for reference card */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LoadingSingleProductPage;
