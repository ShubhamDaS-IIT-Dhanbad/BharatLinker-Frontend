import React, { useState } from 'react';
import '../retailerStyles/retailerSignup.css';
import r1 from '../retailerAssets/signup.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RETAILER_SERVER } from '../../public/constant.js';

const RetailerSignup = () => {
    const [currentStep, setCurrentStep] = useState(1);

    // Retailer Info states
    const [retailerFirstName, setRetailerFirstName] = useState('');
    const [retailerMiddleName, setRetailerMiddleName] = useState('');
    const [retailerLastName, setRetailerLastName] = useState('');
    const [retailerPhoneNumber, setRetailerPhoneNumber] = useState('');
    const [retailerEmail, setRetailerEmail] = useState('');

    // Shop Info states
    const [shopName, setShopName] = useState('');
    const [shopPhoneNumber, setShopPhoneNumber] = useState('');
    const [shopPassword, setShopPassword] = useState('');
    const [shopConfirmPassword, setShopConfirmPassword] = useState('');
    const [shopPinCodes, setShopPinCodes] = useState(''); // For up to 5 pin codes
    const [shopAddress, setShopAddress] = useState('');

    const handlePinCodeChange = (index, value) => {
        const updatedPinCodes = [...shopPinCodes];
        updatedPinCodes[index] = value;
        setShopPinCodes(updatedPinCodes);
    };

    const handleSignupSubmit = async (e) => {
        // Check if passwords match
        if (shopPassword !== shopConfirmPassword) {
            toast.error('Passwords do not match.'); // Show error toast
            return;
        }

        const retailerInfo = {
            firstName: retailerFirstName,
            middleName: retailerMiddleName,
            lastName: retailerLastName,
            phoneNumber: retailerPhoneNumber,
            email: retailerEmail,
        };

        // Show "Registering" toast
        const registeringToastId = toast.loading('Registering...');

        try {
            const response = await axios.post(`${RETAILER_SERVER}/shop/signup`, {
                owner: retailerInfo,
                shopName,
                shopAddress,
                shopPinCodes,
                email: retailerEmail,
                shopPhoneNumber,
                password: shopPassword,
            });

            toast.update(registeringToastId, { render: 'We will contact you within 24 hours.', type: 'success', isLoading: false, autoClose: 5000 });
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            if (error.response) {
                toast.update(registeringToastId, { render: 'Error during signup: ' + error.response.data.message, type: 'error', isLoading: false, autoClose: 5000 });
                console.error('Error during signup:', error.response.data);
            } else if (error.request) {
                toast.update(registeringToastId, { render: 'Error during signup: No response from server', type: 'error', isLoading: false, autoClose: 5000 });
                console.error('Error during signup:', error.request);
            } else {
                toast.update(registeringToastId, { render: 'Error during signup: ' + error.error.message, type: 'error', isLoading: false, autoClose: 5000 });
                console.error('Error during signup:', error.error.message);
            }
        }
    };

    // Validate Retailer Info
    const validateRetailerInfo = () => {
        if (!retailerFirstName || !retailerLastName || !retailerPhoneNumber) {
            toast.error('Please fill in all required fields.'); // Show error toast
            return false;
        }
        return true;
    };

    // Validate Shop Info
    const validateShopInfo = () => {
        if (!shopName || !shopAddress || !shopPhoneNumber || !shopPassword || !shopConfirmPassword) {
            toast.error('Please fill in all required fields.'); // Show error toast
            return false;
        }
        return true;
    };

    // Render Retailer Info section
    const renderRetailerInfo = () => (
        <div className="retailer-data-signup-form">
            <p className="retailer-data-signup-section-title">Retailer Information</p>
            <img className="retailer-data-signup-form-img" src={r1} alt="Signup" />

            <div className="retailer-data-signup-form-inputs">
                <input
                    type="text"
                    placeholder="First Name"
                    className="retailer-signup-input"
                    value={retailerFirstName}
                    onChange={(e) => setRetailerFirstName(e.target.value)}
                    required
                />

                <div className="name-row">
                    <input
                        type="text"
                        placeholder="Middle Name (optional)"
                        className="retailer-signup-input-name"
                        value={retailerMiddleName}
                        onChange={(e) => setRetailerMiddleName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="retailer-signup-input-name"
                        value={retailerLastName}
                        onChange={(e) => setRetailerLastName(e.target.value)}
                        required
                    />
                </div>

                <input
                    type="text"
                    placeholder="Phone Number"
                    className="retailer-signup-input"
                    value={retailerPhoneNumber}
                    onChange={(e) => setRetailerPhoneNumber(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email (optional)"
                    className="retailer-signup-input"
                    value={retailerEmail}
                    onChange={(e) => setRetailerEmail(e.target.value)}
                />
            </div>

            <button
                className="retailer-signup-button"
                onClick={() => {
                    if (validateRetailerInfo()) {
                        setCurrentStep(2);
                    }
                }}
            >
                Next
            </button>
        </div>
    );

    // Render Shop Info section
    const renderShopInfo = () => (
        <div className="shop-signup-form">
            <p className="shop-data-signup-section-title">Shop Information</p>

            <div className="shop-data-signup-form-inputs">
                <input
                    type="text"
                    placeholder="Shop Name"
                    className="shop-signup-input"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Shop Address"
                    className="shop-signup-input"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder={`Pin Code`}
                    className="shop-signup-input"
                    onChange={(e) => handlePinCodeChange(0, e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Shop Phone Number (For Login)"
                    className="shop-signup-input"
                    value={shopPhoneNumber}
                    onChange={(e) => setShopPhoneNumber(e.target.value)}
                    required
                    style={{ marginTop: "20px" }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="shop-signup-input"
                    value={shopPassword}
                    onChange={(e) => setShopPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="shop-signup-input"
                    value={shopConfirmPassword}
                    onChange={(e) => setShopConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <div className="button-group">
                <button className="retailer-signup-button-next" onClick={() => setCurrentStep(1)}>
                    Back
                </button>
                <button
                    className="retailer-signup-button-next"
                    onClick={() => {
                        if (validateShopInfo()) {
                            handleSignupSubmit();
                        }
                    }}
                >
                    Submit
                </button>
            </div>
        </div>
    );

    return (
        <>
            {currentStep === 1 ? renderRetailerInfo() : renderShopInfo()}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={true} rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover />
        </>
    );
};

export default RetailerSignup;
