import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import '../../styles/loadingSingleShop.css';
const LoadingSingleShop = () => {
    return (
        <div id="loading-shop-details">
            <Skeleton height={300} style={{ width:"100vw",marginBottom: '20px' }} />
            <Skeleton height={30} width={200} style={{ marginBottom: '10px' }} />
            <Skeleton height={20} width={150} style={{ marginBottom: '10px' }} />
            <Skeleton height={20} width={250} style={{ marginBottom: '10px' }} />
            <Skeleton height={30} width={100} style={{ marginBottom: '20px' }} />

            <Skeleton height={70}style={{width:"100vw", marginTop: '50px' }} />
            <Skeleton height={70} style={{ width:"100vw",marginTop: '20px' }} />

            <Skeleton height={200} style={{ width:"100vw",marginTop: '20px' }} />
        </div>
    );
}

export default LoadingSingleShop;
