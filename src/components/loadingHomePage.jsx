import React from 'react';
import '../styles/loadingHomePage.css';

const LoadingHomePage = () => {
    return (
        <div id="loading-home-page-container">
             <div  id="loading-home-body-img" />
            <div id="loading-home-page-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div className="loading-page-product-card" key={index}>
                        <div className="loading-page-product-card-top">
                            {/* Loading placeholder */}
                            <div className="loading-placeholder" />
                        </div>
                        <div className='loading-page-product-card-bottom'>
                            {/* Optionally add loading text here */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LoadingHomePage;
