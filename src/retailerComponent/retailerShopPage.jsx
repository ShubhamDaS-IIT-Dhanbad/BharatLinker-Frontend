import React, { useState, useEffect, Fragment } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { RiImageAddLine } from 'react-icons/ri';
import { FiEdit, FiSave } from 'react-icons/fi'; // Icons for edit/save
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'; // Icons for address/contact toggle
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../retailerStyles/retailerShopPage.css';

import { RETAILER_SERVER } from '../../public/constant.js';
import { IoPlaySkipBackOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

const RetailerShopFragment = () => {
    const inputRef = useRef(null);

    const [shop, setShop] = useState(null);
    const [shopImages, setShopImages] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedShop, setUpdatedShop] = useState({});
    const [pincodes, setPincodes] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [loading,setLoading]=useState(true);

    const maxImages = 5;
    const maxPincodes = 5;

    const getBharatLinkerRetailerCookie = () => {
        const cookieName = 'BharatLinkerRetailer=';
        const cookieArray = document.cookie.split('; ');
        const foundCookie = cookieArray.find(row => row.startsWith(cookieName));
        const data = foundCookie ? JSON.parse(decodeURIComponent(foundCookie.split('=')[1])) : null;
        return data;
    };

    const setBharatLinkerRetailerCookie = (shopData) => {
        const cookieName = 'BharatLinkerRetailer';
        const cookieValue = JSON.stringify(shopData);
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // Set cookie to expire in 7 days
        document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${expiryDate.toUTCString()}; path=/`;
    };

    const fetchShopData = async () => {
        const loadingToast = toast.loading('Fetching shop Data...');
        const retailerData = getBharatLinkerRetailerCookie();
        if (retailerData) {

            const shopId = retailerData.id;
            try {
                const response = await axios.get(`${RETAILER_SERVER}/shop/getshopdetails?shopId=${shopId}`);
                const shopData = response.data.shop;
                setShop(shopData);
                setShopImages(shopData.shopImages || []);
                setPincodes(shopData.pinCodes || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shop details:', error);
                toast.dismiss(loadingToast); // Dismiss loading toast
            }
        }
    };

    useEffect(() => {
        fetchShopData();
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && shop) {
            setLoadingUpload(true);
            const formData = new FormData();
            formData.append('shopId', shop._id);
            formData.append('images', file);

            axios.post(`${RETAILER_SERVER}/shop/uploadshopimage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setShopImages(prevImages => [...prevImages, response.data.images[0]]);
                    toast.success('Image uploaded successfully!');
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                    toast.error('Error uploading image.');
                })
                .finally(() => {
                    setLoadingUpload(false);
                });
        }
    };

    const handleImageDelete = (index) => {

        const imageToDelete = shopImages[index];
        const deleteUrl = `${RETAILER_SERVER}/shop/deleteshopimage?shopId=${shop?._id}&imageUrl=${encodeURIComponent(imageToDelete)}`;

        setLoadingDelete(true);

        axios.delete(deleteUrl)
            .then(response => {
                setShopImages(prevImages => prevImages.filter((_, i) => i !== index));
                toast.success('Image deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting image:', error);
                toast.error('Error deleting image.');
            })
            .finally(() => {
                setLoadingDelete(false);
            });
    };

    const triggerFileInput = (inputId) => {
        document.getElementById(inputId).click();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedShop({ ...updatedShop, [name]: value });
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setUpdatedShop(shop);
    };

    const handleSaveChanges = async () => {
        // Validate fields
        const requiredFields = ['shopName', 'email', 'address', 'phoneNumber', 'pinCodes'];
        for (const field of requiredFields) {
            if (!updatedShop[field] || (Array.isArray(updatedShop[field]) && updatedShop[field].length === 0)) {
                toast.error(`${field} cannot be empty.`);
                return; // Exit the function if a required field is empty
            }
        }

        setLoadingUpdate(true);
        try {
            const response = await axios.post(`${RETAILER_SERVER}/shop/updateshopdata?shopId=${shop?._id}`, updatedShop);
            setShop(response.data.shop);
            setBharatLinkerRetailerCookie(response.data.shop);
            toast.success('Shop details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating shop details:', error);
            toast.error('Error updating shop details.');
        } finally {
            setLoadingUpdate(false);
        }
    };


    const handleAddPincode = (newPincode) => {
        if (newPincode && pincodes.length < maxPincodes) {
            setPincodes(prevPincodes => [...prevPincodes, newPincode]);
            setUpdatedShop({ ...updatedShop, pinCodes: [...pincodes, newPincode] });
        }
    };

    const handleRemovePincode = (index) => {
        const updatedPincodes = pincodes.filter((_, i) => i !== index);
        setPincodes(updatedPincodes);
        setUpdatedShop({ ...updatedShop, pinCodes: updatedPincodes });
    };

    const toggleAddress = () => setShowAddress(!showAddress);
    const toggleContact = () => setShowContact(!showContact);

    return (
        <div className="retailer-shop-fragment">
            <ToastContainer />
            <div className="retailer-shop-images">
                {shopImages.length > 0 && (
                    shopImages.slice(0, maxImages).map((image, index) => (
                        <div className="retailer-image-container" key={index}>
                            <img src={image} alt={`Shop Image ${index + 1}`} className="retailer-shop-image" />
                            <div className="delete-icon" onClick={() => handleImageDelete(index)}>
                                {loadingDelete ? 'Deleting...' : 'Delete'}
                            </div>
                        </div>
                    ))
                )}
                {shopImages.length < maxImages && (
                    Array.from({ length: maxImages - shopImages.length }).map((_, index) => (
                        <div className="retailer-image-upload-container" key={index}>
                            <div
                                className="shop-image-empty"
                                style={{ cursor: 'pointer' }}
                                onClick={() => triggerFileInput('image-upload')}
                            >
                                <RiImageAddLine size={50} className="shop-image-empty-icon" />
                            </div>
                            <div className="delete-icon" onClick={() => triggerFileInput('image-upload')}>
                                {loadingUpload ? 'uploading...' : 'upload'}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
            />

            <div className="retailer-shop-details">
                <div className="retailer-details-info">
                    <div className="retailer-shop-verification">Verified Shop</div>
                    <p className="retailer-shop-id">Shop # {shop?._id}</p>
                    {!isEditing ? (
                        <div className="retailer-shop-title">SHOP: {shop?.shopName}</div>
                    ) : (
                        <input
                            type="text"
                            name="shopName"
                            value={updatedShop.shopName || ''}
                            onChange={handleInputChange}
                            placeholder="Shop Name"
                            className="retailer-input"
                        />
                    )}
                </div>

                <div className='retailer-page-email'>
                    {!isEditing ? (
                        <div className="retailer-email-title">Email: {shop?.email}</div>
                    ) : (
                        <input
                            type="email"
                            name="email"
                            value={updatedShop.email || ''}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="retailer-input"
                        />
                    )}
                </div>
                <div className="retailer-shop-divider"></div>

                <div className="retailer-shop-toggle-section" onClick={toggleAddress} style={{ cursor: 'pointer' }}>
                    <p>Address</p>
                    {showAddress ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                </div>
                {showAddress && (
                    <div className="retailer-shop-address">
                        {!isEditing ? (
                            <p style={{ padding: "10px", fontWeight: "900" }}>{shop?.address}</p>
                        ) : (
                            <textarea
                                name="address"
                                value={updatedShop.address || ''}
                                onChange={handleInputChange}
                                placeholder="Address"
                                className="retailer-input-address"
                            />
                        )}
                    </div>
                )}

                <div className="retailer-shop-divider"></div>

                <div className="retailer-shop-toggle-section" onClick={toggleContact} style={{ cursor: 'pointer' }}>
                    <p>Contact</p>
                    {showContact ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                </div>
                {showContact && (
                    <div className="retailer-shop-contact">
                        {!isEditing ? (
                            <p style={{ padding: "10px", fontWeight: "900" }}>{shop?.phoneNumber}</p>
                        ) : (
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={updatedShop.phoneNumber || ''}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className="retailer-input-contact"
                            />
                        )}
                    </div>
                )}
                <div className="retailer-shop-divider"></div>



                <div className="retailer-pincode-section">
                    <div className="retailer-pincode-title">Pincodes:</div>
                    {pincodes.map((pincode, index) => (
                        <div key={index} className="retailer-pincode-item">
                            <span>{pincode}</span>
                            {isEditing && (
                                <button className='retailer-pincode-item-remove-button' onClick={() => handleRemovePincode(index)}>Remove</button>
                            )}
                        </div>
                    ))}
                    {isEditing && pincodes.length < maxPincodes && (
                        <div>
                            <div className='retailer-pincode-section-add-pincode'>
                                <input
                                    type="text"
                                    className='retailer-pincode-section-add-pincode-input'
                                    placeholder="Add Pincode"
                                    ref={inputRef}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddPincode(e.target.value);
                                            e.target.value = ''; // Clear input after adding
                                        }
                                    }}
                                />
                                <FaPlus onClick={() => {
                                    if (inputRef.current) {
                                        handleAddPincode(inputRef.current.value);
                                        inputRef.current.value = ''; // Clear input after adding
                                    }
                                }} size={30} />
                            </div>
                        </div>
                    )}
                </div>



                <div className="retailer-shop-action-buttons">
                    {isEditing ? (
                        <div style={{ display: "flex", widthL: "100vw" }}
                            className='retailer-save-discard'
                        >
                            <div className='retailer-shop-action-buttons-close' onClick={() => setIsEditing(!isEditing)} >
                                close
                                {/* <IoClose size={30} className="retailer-discard-button" /> */}
                            </div>
                            <div className='retailer-shop-action-buttons-save' onClick={handleSaveChanges}>
                                Save
                            </div>
                        </div>
                    ) : (
                        <FiEdit onClick={toggleEditMode} className="retailer-edit-button" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RetailerShopFragment;

