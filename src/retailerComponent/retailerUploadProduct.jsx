import React, { useState } from 'react';
import axios from 'axios';
import { RETAILER_PRODUCT_SERVER } from '../../public/constant.js';
import '../retailerStyles/retailerUploadProduct.css';
import { RiImageAddLine } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const UploadProduct = () => {
    const [title, setTitle] = useState('shubha das');
    const [description, setDescription] = useState('helow boys');
    const [price, setPrice] = useState('999');
    const [discountedPrice, setDiscountedPrice] = useState('99');
    const [quantityAvailable, setQuantityAvailable] = useState('100');
    const [brand, setBrand] = useState(['levus', 'lavus']);
    const [shop, setShop] = useState('66f6ce446dbd4fe3597bf30d');
    const [keywords, setKeywords] = useState(['742136', '742138']);
    const [images, setImages] = useState([null, null, null]);
    const [isUploading, setIsUploading] = useState(false); // State for tracking upload status

    // Handle image change
    const handleImageChange = (index, files) => {
        if (files && files[0]) {
            const updatedImages = [...images];
            updatedImages[index] = files[0];
            setImages(updatedImages);
        }
    };

    // Handle drag and drop
    const handleDrop = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        handleImageChange(index, files);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true); // Set uploading state to true

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('discountedPrice', discountedPrice);
        formData.append('quantityAvailable', quantityAvailable);
        formData.append('shop', '66f6ce446dbd4fe3597bf30d');

        // Append brand and keywords arrays
        brand.forEach((brandItem, idx) => formData.append(`brand[${idx}]`, brandItem));
        keywords.forEach((keyword, idx) => formData.append(`keywords[${idx}]`, keyword));

        // Append images
        images.forEach((image) => {
            if (image) {
                formData.append('images', image);
            }
        });

        try {
            const response = await axios.post(`${RETAILER_PRODUCT_SERVER}/product/uploadproduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product uploaded successfully!'); // Show success toast
            // Reset form fields after successful submission
            setTitle('');
            setDescription('');
            setPrice('');
            setQuantityAvailable('');
            setDiscountedPrice('');
            setBrand([]);
            setShop('');
            setKeywords([]);
            setImages([null, null, null]);
        } catch (error) {
            toast.error('Error uploading product. Please try again.'); // Show error toast
        } finally {
            setIsUploading(false); // Reset uploading state
        }
    };

    // Trigger file input click
    const triggerFileInput = (index) => {
        document.getElementById(`image-upload-${index}`).click();
    };

    // Remove selected image
    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages[index] = null;
        setImages(updatedImages);
    };

    return (
        <div className="upload-product-container">
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="image-upload-section">
                    <div className="image-upload-container">
                        {images.map((image, idx) => (
                            <div
                                key={idx}
                                className="image-upload-box"
                                onDrop={(e) => handleDrop(idx, e)}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {image ? (
                                    <>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${idx + 1}`}
                                            className="image-preview"
                                        />
                                        <button className="image-remove-button" type="button" onClick={() => removeImage(idx)}>Remove</button>
                                    </>
                                ) : (
                                    <div className="image-input" onClick={() => triggerFileInput(idx)}>
                                        <RiImageAddLine size={80} className="shop-image-empty-icon" />
                                    </div>
                                )}
                                <input
                                    style={{ display: "none" }} // Use 'none' instead of 'hidden' to hide the input
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
                <div className="form-group-title-div">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-description-div">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-price-div">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-discountedprice-div">
                    <label>Discounted Price:</label>
                    <input
                        type="number"
                        value={discountedPrice}
                        onChange={(e) => setDiscountedPrice(e.target.value)}
                    />
                </div>
                <div className="form-group-quantity-div">
                    <label>Quantity Available:</label>
                    <input
                        type="number"
                        value={quantityAvailable}
                        onChange={(e) => setQuantityAvailable(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-brand-div">
                    <label>Brand (comma-separated):</label>
                    <input
                        type="text"
                        value={brand.join(',')}
                        onChange={(e) => setBrand(e.target.value.split(','))}
                        required
                    />
                </div>
                <div className="form-group-keywords-div">
                    <label>Keywords (comma-separated):</label>
                    <input
                        type="text"
                        value={keywords.join(',')}
                        onChange={(e) => setKeywords(e.target.value.split(','))}
                        required
                    />
                </div>

                <div className="upload-button-div">
                    <button className="upload-button" type="submit" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload Product'}
                    </button>
                </div>
            </form>
            <ToastContainer /> {/* Include ToastContainer for toast notifications */}
        </div>
    );
};

export default UploadProduct;
