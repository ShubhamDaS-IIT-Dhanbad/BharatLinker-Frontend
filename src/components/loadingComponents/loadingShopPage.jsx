import React from 'react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingShopPage = () => {
    return (
        <div id="search-shop-grid">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="shop-card-skeleton">
                    <Skeleton height={190} width={'100%'} borderRadius={8} />

                    {/* Skeleton for shop title */}
                    <Skeleton height={60} width={'100%'} style={{ margin: '10px 0' }} />

                    {/* Skeleton for shop details */}
                    <Skeleton height={15} width={'80%'} />
                </div>
            ))}
        </div>
    );
}

export default LoadingShopPage;
