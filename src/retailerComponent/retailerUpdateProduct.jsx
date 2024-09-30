import React, { useState } from 'react';
import axios from 'axios';
import { RiImageAddLine } from 'react-icons/ri'; // Icon for image upload
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RETAILER_SERVER } from '../../public/constant.js'; // Backend server URL

const UploadProduct = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const maxImages = 5;

    // Handle file input change for image upload
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > maxImages) {
            toast.error(`You can only upload a maximum of ${maxImages} images.`);
            return;
        }

        setImages((prevImages) => [...prevImages, ...files]);
    };

    // Remove image from the selected images
    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Handle form submission to upload the product
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!productName || !description || !price || !category || !stock || images.length === 0) {
            toast.error('Please fill in all fields and upload at least one image.');
            return;
        }

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('stock', stock);
        images.forEach((image) => formData.append('images', image));

        setLoading(true);

        try {
            const response = await axios.post(`${RETAILER_SERVER}/product/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product uploaded successfully!');
            setProductName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setStock('');
            setImages([]);
        } catch (error) {
            console.error('Error uploading product:', error);
            toast.error('Error uploading product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-product-container">
            <ToastContainer />
            <h2>Upload Product</h2>
            <form onSubmit={handleSubmit} className="upload-product-form">
                <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter product description"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter product price"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Enter product category"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stock">Stock Quantity</label>
                    <input
                        type="number"
                        id="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Enter stock quantity"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="images">Product Images</label>
                    <div className="image-upload-container">
                        <input
                            type="file"
                            id="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <div className="image-preview-container">
                            {images.map((image, index) => (
                                <div key={index} className="image-preview">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Product ${index + 1}`}
                                        className="product-image-preview"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image-button"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {images.length < maxImages && (
                                <label htmlFor="images" className="image-upload-label">
                                    <RiImageAddLine size={50} className="image-add-icon" />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Product'}
                </button>
            </form>
        </div>
    );
};

export default UploadProduct;
