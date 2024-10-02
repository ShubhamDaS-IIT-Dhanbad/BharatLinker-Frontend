import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { RETAILER_PRODUCT_SERVER } from '../../public/constant.js';
import '../retailerStyles/retailerUploadProduct.css';
import { RiImageAddLine } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const UploadProduct = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [pincodes, setPincodes] = useState('');
    const [shop,setShop] = useState('');
    const [images, setImages] = useState([null, null, null]);
    const [isUploading, setIsUploading] = useState(false); // State for tracking upload status



    const getBharatLinkerRetailerCookie = () => {
        const cookieName = 'BharatLinkerRetailer=';
        const cookieArray = document.cookie.split('; ');
        const foundCookie = cookieArray.find(row => row.startsWith(cookieName));
        const data = foundCookie ? JSON.parse(decodeURIComponent(foundCookie.split('=')[1])) : null;
        return data;
    };

    useEffect(() => {
        const retailerData = getBharatLinkerRetailerCookie();
        if (retailerData) {
            setShop(retailerData.id);
            setPincodes(retailerData.pincodes);
        }
    }, []);


    
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
        formData.append('quantityAvailable', quantityAvailable);
        formData.append('shop', shop);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('pincodes',pincodes);

        // Append images
        images.forEach((image) => {
            if (image) {
                formData.append('images', image);
            }
        });

        try {
            await axios.post(`${RETAILER_PRODUCT_SERVER}/product/uploadproduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product uploaded successfully!');
            // Reset form fields after successful submission
            setTitle('');
            setDescription('');
            setPrice('');
            setQuantityAvailable('');
            setBrand('');
            setCategory('');
            setImages([null, null, null]);
        } catch (error) {
            toast.error('Error uploading product. Please try again.');
        } finally {
            setIsUploading(false);
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
                    <label>Brand</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-brand-div">
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="upload-button-div">
                    <button className="upload-button" type="submit" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload Product'}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default UploadProduct;
