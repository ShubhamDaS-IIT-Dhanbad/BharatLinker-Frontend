import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Added missing import
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_PRODUCT_SERVER } from '../../public/constant.js';
import '../retailerStyles/retailerUploadProduct.css';
import { RiImageAddLine } from 'react-icons/ri';
import { HiOutlineUserCircle } from 'react-icons/hi'; // Added missing import
import { IoHomeOutline } from 'react-icons/io5'; // Added missing import
import { TbShieldMinus } from 'react-icons/tb'; // Added missing import
import { BiSearchAlt } from 'react-icons/bi'; // Added missing import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/refurbishedproductupload.css';
import { IoIosCloseCircleOutline } from "react-icons/io";
const UploadProduct = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [pincodes, setPincodes] = useState('');
    const [keywords, setKeywords] = useState('');
    const [shop, setShop] = useState('');
    const [images, setImages] = useState([null, null, null]);
    const [isUploading, setIsUploading] = useState(false);
    const { displayName, email } = useSelector(state => state.user);

    const getBharatLinkerUserCookie = () => {
        const cookieName = 'BharatLinkerUser=';
        const cookieArray = document.cookie.split('; ');
        const foundCookie = cookieArray.find(row => row.startsWith(cookieName));
        return foundCookie ? JSON.parse(decodeURIComponent(foundCookie.split('=')[1])) : null;
    };

    useEffect(() => {
        const userData = getBharatLinkerUserCookie();
        if (userData) {
            setShop(userData.uid);
        }
    }, []); // Added empty dependency array

    const handleImageChange = (index, files) => {
        if (files && files[0]) {
            const updatedImages = [...images];
            updatedImages[index] = files[0];
            setImages(updatedImages);
        }
    };

    const handleDrop = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        handleImageChange(index, files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setIsUploading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('uid', shop);
        formData.append('keywords', keywords);
        formData.append('pincodes', pincodes);

        images.forEach((image) => {
            if (image) {
                formData.append('images', image);
            }
        });

        try {
            await axios.post(`${USER_PRODUCT_SERVER}/product/uploadproduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product uploaded successfully!');
            setTitle('');
            setDescription('');
            setPrice('');
            setPincodes('');
            setKeywords('');
            setImages([null, null, null]);
        } catch (error) {
            toast.error(`Error uploading product: ${error.response ? error.response.data.message : 'Please try again.'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = (index) => {
        document.getElementById(`image-upload-${index}`).click();
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages[index] = null;
        setImages(updatedImages);
    };

    return (
        <>
            <div className='refurbished-upload-product-header-show'>
                < HiOutlineUserCircle id='dashboard-header-ham' size={35} onClick={() => { navigate('/dashboard') }} />
                <div className='refurbished-upload-product-header-show-section'>
                    REFURBISHED
                </div>
                <IoIosCloseCircleOutline size={35} className='dashboard-header-parent-refurbished' onClick={() => navigate('/')} />
            </div>

            <div className="refurbished-upload-container">
                <form className="upload-form" onSubmit={handleSubmit}>
                    <div className="image-upload-section">
                        <div className="refurbished-image-upload-container">
                            {images.map((image, idx) => (
                                <div
                                    key={idx}
                                    className="refurbished-image-upload-box"
                                    onDrop={(e) => handleDrop(idx, e)}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    {image ? (
                                        <>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${idx + 1}`}
                                                className="refurbished-image-preview"
                                            />
                                            <button className="image-remove-button" type="button" onClick={() => removeImage(idx)}>Remove</button>
                                        </>
                                    ) : (
                                        <div className="refurbished-image-input" onClick={() => triggerFileInput(idx)}>
                                            <RiImageAddLine size={80} className="shop-image-empty-icon" />
                                        </div>
                                    )}
                                    <input
                                        style={{ display: 'none' }}
                                        type="file"
                                        accept="image/*"
                                        id={`image-upload-${idx}`}
                                        className="image-input"
                                        onChange={(e) => handleImageChange(idx, e.target.files)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="refurbished-form-group-title-div">
                        <input
                            type="text"
                            value={title} // Use the state variable instead of a hardcoded string
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Product Title'
                            required
                        />
                    </div>

                    <div className="refurbished-form-group-description-div">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Product Description'
                        />
                    </div>
                    <div className="refurbished-form-group-price-div">
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                             placeholder='Product Price'
                            required
                        />
                        
                    </div>

                    <div className="refurbished-form-group-price-div">
                        <input
                            type="text"
                            value={pincodes}
                            onChange={(e) => setPincodes(e.target.value)}
                             placeholder='Pincode'
                            required
                        />
                    </div>
                    <div className="refurbished-form-group-price-div">
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                             placeholder='keywords [seperated by comma]'
                            required
                        />
                    </div>
                    <button type="submit" id='refurbished-upload-product-footer' disabled={isUploading}>
                        <div id='refurbished-footer-item'>
                            {isUploading ? 'Uploading...' : 'Submit Refurbished'}
                        </div>
                    </button>
                </form>
                <ToastContainer />
            </div>
        </>
    );
};

export default UploadProduct;
