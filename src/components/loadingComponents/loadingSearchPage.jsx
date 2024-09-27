import React from 'react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const LoadingSearchPage = () => {
    const numberOfCards = 6; // Number of loading cards to display
    const loadingCards = Array.from({ length: numberOfCards }); // Create an array of undefined values

    return (
        <div id='loading-search-product-page-grid'>

            {
                loadingCards.map((_, ind) => (
                    <div className="loading-product-skeleton" key={ind}>
                        <Skeleton height={200} />
                        <Skeleton height={30} style={{ marginTop: '10px' }} />
                        <Skeleton height={20} width={100} style={{ marginTop: '5px' }} />
                    </div>
                ))
            }
        </div>
    );
}

export default LoadingSearchPage;
