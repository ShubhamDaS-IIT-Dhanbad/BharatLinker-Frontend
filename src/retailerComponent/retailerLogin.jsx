import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; // Import js-cookie

import '../retailerStyles/retailerLogin.css'; // Ensure this path is correct
import {RETAILER_SERVER} from '../../public/constant.js';

const RetailerLogin = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [shopContactNumber, setShopContactNumber] = useState(''); // Changed variable name
    const [userPassword, setUserPassword] = useState(''); // Changed variable name

    const handleRetailerLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await axios.post(`${RETAILER_SERVER}/shop/login`, {
                phoneNumber: shopContactNumber, // Updated variable name
                password: userPassword, // Updated variable name
            });

            // Check if the status is pending
            if (response.data.shop.registerStatus === 'pending') {
                toast.warn('Your Shop is not verified. Please wait until we verify.'); // Show pending status toast
            } else {
                // Store retailer data in cookies
                Cookies.set('BharatLinkerRetailer', JSON.stringify(response.data.shop), { expires: 7 }); // Add BharatLinkerRetailer cookie

                toast.success('Login successful!'); // Show success toast
                console.log(response.data.shop); // Handle the response if needed
                navigate('/retailer/home'); // Changed redirect path to /dashboard
            }
        } catch (error) {
            if (error.response) {
                toast.error('Login failed: ' + error.response.data.message); // Show error toast
            } else {
                toast.error('Login failed: ' + error.message); // Show error toast for other errors
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div className="retailer-login-container">
            <p className="retailer-login-title">Welcome Back to the Shop</p> {/* Changed title text */}
            <p className="retailer-login-title-sub">Please sign in to continue</p> {/* Added sub-title */}
            <div className="retailer-login-form">
                <input
                    type="text"
                    placeholder="Enter Shop Contact Number" // Updated placeholder
                    className="retailer-login-input"
                    value={shopContactNumber}
                    onChange={(e) => setShopContactNumber(e.target.value)} // Update state on change
                    required // Mark as required
                />
                <input
                    type="password"
                    placeholder="Enter Your Password" // Updated placeholder
                    className="retailer-login-input"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)} // Update state on change
                    required // Mark as required
                />
                <div className="retailer-login-forgot-password">
                    <a href="#">Forgot Password?</a>
                </div>

                <button className="retailer-login-button" onClick={handleRetailerLogin}>
                    Log In
                </button>

                <div className="retailer-login-register">
                    <span>Don't have an account?</span>
                    <a onClick={() => navigate('/retailer/signup')}>Create One Now</a> {/* Changed link text */}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover />
        </div>
    );
};

export default RetailerLogin;
