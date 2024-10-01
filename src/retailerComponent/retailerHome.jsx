import React from 'react';
import '../retailerStyles/retailerHome.css'
import bharatlinker from '../retailerAssets/bharatlinker.png'
const RetailerHome = () => {
    return (
        <div className='retailer-home'>
            <img className='retailer-home-png' src={bharatlinker}/>
        </div>
    );
};

export default RetailerHome;
