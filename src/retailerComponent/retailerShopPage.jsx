import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShopData, updateShopData, uploadShopImage, deleteShopImage, addPincode, removePincode, getBharatLinkerRetailerCookie, selectShop, selectShopImages, selectPincodes, selectLoading, selectError } from '../redux/features/retailerDataSlice'; // Adjust path as per your structure
import { RiImageAddLine } from 'react-icons/ri';
import { FiEdit, FiSave } from 'react-icons/fi';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';

import { FaPlus } from "react-icons/fa";

import 'react-toastify/dist/ReactToastify.css';
import '../retailerStyles/retailerShopPage.css';
const RetailerShopFragment = () => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    const shop = useSelector(selectShop);
    const shopImages = useSelector(selectShopImages);
    const pincodes = useSelector(selectPincodes);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    const [isEditing, setIsEditing] = useState(false);
    const [updatedShop, setUpdatedShop] = useState({});
    const [showAddress, setShowAddress] = useState(false);
    const [showContact, setShowContact] = useState(false);

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const maxImages = 5;
    const maxPincodes = 5;

    useEffect(() => {
        if (shop === null) {
            const retailerData = getBharatLinkerRetailerCookie();
            if (retailerData) {
                dispatch(fetchShopData(retailerData.id));
            }
        }
    }, []);

    const [isInitialRender, setIsInitialRender] = useState(true);
    useEffect(() => {
        if (shop && !isInitialRender) {
            setUpdatedShop(shop);
        } else {
            setIsInitialRender(false);
        }
    }, [shop]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && shop) {
            setLoadingUpload(true);
            dispatch(uploadShopImage({ shopId: shop._id, file }))
                .then(() => {
                    toast.success('Image uploaded successfully!');
                })
                .catch(() => {
                    toast.error('Error uploading image.');
                })
                .finally(() => {
                    setLoadingUpload(false);
                });
        }
    };

    const handleImageDelete = (index) => {
        const imageToDelete = shopImages[index];
        setLoadingDelete(true);
        dispatch(deleteShopImage({ shopId: shop._id, imageUrl: imageToDelete }))
            .then(() => toast.success('Image deleted successfully!'))
            .catch(() => toast.error('Error deleting image.'))
            .finally(() => setLoadingDelete(false));
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = () => {
        setLoadingUpdate(true);
        const updatedData = { shopId: shop._id, updatedShop };
        dispatch(updateShopData(updatedData))
            .then(() => {
                // Fetch the latest shop data after successful update
                dispatch(fetchShopData(shop._id));
                setUpdatedShop(shop);
                toast.success('Shop details updated successfully!');
                setIsEditing(false);
            })
            .catch(() => {
                toast.error('Error updating shop details.');
            })
            .finally(() => setLoadingUpdate(false));
    };


    const handleAddPincode = (newPincode) => {
        if (newPincode && pincodes.length < 5) {
            dispatch(addPincode(Number(newPincode)));
            inputRef.current.value = ''; // Clear input
            setUpdatedShop(shop);
        }
    };

    const handleRemovePincode = (index) => {
        dispatch(removePincode(index));
        setUpdatedShop(shop);
    };

    // Input change handler for controlled inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedShop((prevShop) => ({
            ...prevShop,
            [name]: value,
        }));
    };

    const toggleAddress = () => setShowAddress(!showAddress);
    const toggleContact = () => setShowContact(!showContact);

    if (!shop || loading) return <div style={{
        width: "100vw", height: "100vh",
        display: "flex", justifyContent: "center", alignItems: "center"
    }}>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="retailer-shop-fragment">
            <ToastContainer />
            <div className="retailer-shop-images">
                {(shopImages?.length > 0 ? shopImages.slice(0, maxImages) : [])?.map((image, index) => (
                    <div className="retailer-image-container" key={index}>
                        <img src={image} alt={`Shop Image ${index + 1}`} className="retailer-shop-image" />
                        <div className="delete-icon" onClick={() => handleImageDelete(index)}>
                            {loadingDelete ? 'Deleting...' : 'Delete'}
                        </div>
                    </div>
                ))}
                {shopImages?.length < maxImages && (
                    <div className="retailer-image-upload-container">
                        <div
                            className="shop-image-empty"
                            onClick={() => document.getElementById('image-upload').click()}
                        >
                            {loadingUpload ? 'Uploading...' : <RiImageAddLine size={50} />}
                        </div>
                    </div>
                )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="image-upload" />

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
                            value={updatedShop?.shopName || ''}  // Use updatedShop for value
                            onChange={handleInputChange}          // Controlled input
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
                                    onKeyPress={(e) => { if (e.key === 'Enter') { handleAddPincode(e.target.value); } }} />

                                <FaPlus size={30} className='retailer-pincode-section-add-pincode-button' onClick={() => handleAddPincode(inputRef.current.value)} />

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
                            </div>
                            <div className='retailer-shop-action-buttons-save' onClick={handleSaveChanges}>
                                {loadingUpdate ? <>saving...</> : <>save</>}
                            </div>
                        </div>
                    ) : (
                        <div onClick={toggleEditMode} className="retailer-edit-button" >
                            <FiEdit />Edit
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RetailerShopFragment;
