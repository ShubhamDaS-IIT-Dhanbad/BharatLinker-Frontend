import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import '../retailerStyles/retailerHome.css';
import bharatlinker from '../retailerAssets/bharatlinker.png';
import {RETAILER_SERVER} from '../../public/constant.js'
const RetailerHome = () => {
    const [shopStatus, setShopStatus] = useState('closed'); // Default shop status

    // Helper function to get retailer data from the cookie
    const getBharatLinkerRetailerCookie = () => {
        const cookieName = 'BharatLinkerRetailer=';
        const cookieArray = document.cookie.split('; ');
        const foundCookie = cookieArray.find(row => row.startsWith(cookieName));
        const data = foundCookie ? JSON.parse(decodeURIComponent(foundCookie.split('=')[1])) : null;
        return data;
    };

    // Helper function to update the cookie with fresh shop data
    const setBharatLinkerRetailerCookie = (updatedShop) => {
        const cookieName = 'BharatLinkerRetailer';
        const cookieValue = JSON.stringify(updatedShop);
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // Set cookie to expire in 7 days
        document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${expiryDate.toUTCString()}; path=/`;
    };

    // On mount, load the shop status from the cookie
    useEffect(() => {
        const retailerData = getBharatLinkerRetailerCookie();
        if (retailerData) {
            setShopStatus(retailerData.status === 'opened' ? 'opened' : 'closed');
        }
    }, []);

    // Function to handle changing the shop status (open or closed)
    const handleShopStatusChange = async (newStatus) => {
        const retailerData = getBharatLinkerRetailerCookie();
        if (retailerData) {
            const shopId = retailerData.id;

            try {
                // Send request to update the shop status in the backend
                await axios.put(`${RETAILER_SERVER}/shop/openclosed?shopId=${shopId}&number=${newStatus === 'opened' ? '1' : '0'}`);

                // Update the status locally
                setShopStatus(newStatus);

                // Update the cookie with the new status
                const updatedShopData = {
                    ...retailerData,
                    status: newStatus
                };
                setBharatLinkerRetailerCookie(updatedShopData);

                // Show success toast
                toast.success(`Shop is now ${newStatus.toUpperCase()}`);
            } catch (error) {
                console.error('Error updating shop status:', error);
                toast.error('Error updating shop status.');
            }
        }
    };

    return (
        <div className='retailer-home'>
            <ToastContainer /> {/* Toast container to display notifications */}
            <img className='retailer-home-png' src={bharatlinker} alt="Bharat Linker" />
            <div className='retailer-open-closed-div'>
                YOUR SHOP IS {shopStatus.toUpperCase()}
            </div>
            <button onClick={() => handleShopStatusChange('opened')}>
                OPEN
            </button>
            <button onClick={() => handleShopStatusChange('closed')}>
                CLOSED
            </button>
        </div>
    );
};

export default RetailerHome;
