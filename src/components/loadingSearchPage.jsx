import React from 'react';
import '../styles/loadingSearchPage.css';

const LoadingSearchPage = () => {
    const numberOfCards = 6; // Number of loading cards to display
    const loadingCards = Array.from({ length: numberOfCards }); // Create an array of undefined values

    return (
        <div id="loading-search-page-container">
            <div id="loading-search-page-grid">
                {loadingCards.map((_, index) => (
                    <div key={index} className="loading-page-product-card">
                        <div className="loading-page-product-card-top">
                            {/* Loading placeholder */}
                            <div className="loading-placeholder" />
                        </div>
                        <div className='loading-page-product-card-bottom'>
                            {/* Optionally, you can add loading text or any other placeholder content */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LoadingSearchPage;
