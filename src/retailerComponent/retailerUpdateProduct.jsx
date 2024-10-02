import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../retailerStyles/retailerUpdateProduct.css";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { RETAILER_PRODUCT_SERVER } from '../../public/constant.js';
import LoadingSingleProduct from "../components/loadingComponents/loadingSingleProduct.jsx";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const RetailerSingleProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetail] = useState(null);
    const [imageArray, setImageArray] = useState(Array(3).fill(null));
    const [uploadingIndexes, setUploadingIndexes] = useState(new Set());
    const [deletingIndexes, setDeletingIndexes] = useState(new Set());

    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        title: "",
        description: "",
        price: "",
        quantityAvailable: "",
        brand: "",
        category: ""
    });

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`${RETAILER_PRODUCT_SERVER}/product/getproductdetails?productId=${productId}`);
                const data = await response.json();
                setProductDetail(data.product);
                setEditedProduct({
                    title: data.product.title,
                    description: data.product.description,
                    price: data.product.price,
                    quantityAvailable: data.product.quantityAvailable,
                    brand: data.product.brand,
                    category: data.product.category||""
                });

                if (data.product.images && data.product.images.length > 0) {
                    setImageArray((prev) => {
                        const newArray = [...prev];
                        data.product.images.forEach((image, index) => {
                            if (index < 3) newArray[index] = image;
                        });
                        return newArray;
                    });
                }
            } catch (err) {
                console.error("Error while fetching product details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleArrayChange = (e, key) => {
        const { value } = e.target;
        setEditedProduct({
            ...editedProduct,
            [key]: value
        });
    };

    const handleSaveChanges = async () => {
        console.log("ko", editedProduct)
        try {
            await axios.put(`${RETAILER_PRODUCT_SERVER}/product/updateproductdata?productId=${productId}`, {

                ...editedProduct
            });
            toast.success("Product details updated successfully!");
            setProductDetail(editedProduct);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Error updating product.");
        }
    };

    const handleImageUpload = async (event, index) => {
        const file = event.target.files[0];
        if (file && productDetail) {
            setUploadingIndexes((prev) => new Set(prev).add(index));

            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('images', file);
            try {
                toast.loading("Uploading image...");
                const response = await axios.put(`${RETAILER_PRODUCT_SERVER}/product/uploadproductimage`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.dismiss();
                const uploadedImage = response.data.images[0];

                setImageArray((prev) => {
                    const newArray = [...prev];
                    newArray[index] = uploadedImage;
                    return newArray;
                });

                toast.success('Image uploaded successfully!');
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Error uploading image.');
            } finally {
                setUploadingIndexes((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(index);
                    return newSet;
                });
            }
        }
    };

    const handleImageDelete = async (index) => {
        if (uploadingIndexes.size > 0) {
            toast.error('Please wait for the upload to finish before deleting images.');
            return;
        }

        setDeletingIndexes((prev) => new Set(prev).add(index));
        try {
            toast.loading("Deleting image...");
            const response = await axios.delete(`${RETAILER_PRODUCT_SERVER}/product/deleteproductimage`, {
                data: { productId, imageUrl: imageArray[index] }
            });
            toast.dismiss();
            if (response.data) {
                setImageArray((prev) => {
                    const newArray = [...prev];
                    newArray[index] = null;
                    const filteredArray = newArray.filter(image => image !== null);
                    const updatedArray = [...filteredArray, ...Array(3 - filteredArray.length).fill(null)];
                    return updatedArray;
                });

                toast.success('Image deleted successfully!');
            }
        } catch (error) {

            console.error('Error deleting image:', error);
            toast.error('Error deleting image.');

        } finally {

            setDeletingIndexes((prev) => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
            });
        }

    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                toast.loading("Fetching Product...");
                const response = await fetch(`${RETAILER_PRODUCT_SERVER}/product/getproductdetails?productId=${productId}`);
                const data = await response.json();
                setProductDetail(data.product);
                setEditedProduct({
                    title: data.product.title,
                    description: data.product.description,
                    price: data.product.price,
                    quantityAvailable: data.product.quantityAvailable,
                    brand: data.product.brand,
                    category: data.product.category
                });

                if (data.product.images && data.product.images.length > 0) {
                    setImageArray((prev) => {
                        const newArray = [...prev];
                        data.product.images.forEach((image, index) => {
                            if (index < 3) newArray[index] = image;
                        });
                        return newArray;
                    });
                }
                toast.dismiss();
            } catch (err) {
                console.error("Error while fetching product details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [productId]);

    const handleDeleteProduct = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            try {
                // Show "Deleting..." status
                toast.loading("Deleting product...");

                // Send request to delete product
                await axios.post(`${RETAILER_PRODUCT_SERVER}/product/deleteproduct?productId=${productId}`);

                // Show success message after deletion
                toast.dismiss();  // Remove the "Deleting..." loader
                toast.success("Product deleted successfully!");

                // Redirect to another page after 1 second
                setTimeout(() => {
                    navigate('/retailer/product');
                }, 1000); // 1-second delay
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.dismiss();  // Remove the "Deleting..." loader
                toast.error("Error deleting product.");
            }
        }
    };


    const handleRemoveBrand = (index) => {
        setEditedProduct(prev => {
            const updatedbrand = [...prev.brand];
            updatedbrand.splice(index, 1); // Remove the brand at the specified index
            return { ...prev, brand: updatedbrand };
        });
    };

    const handleRemoveCategory = (index) => {
        setEditedProduct(prev => {
            const updatedCategories = [...prev.category];
            updatedCategories.splice(index, 1); // Remove the category at the specified index
            return { ...prev, category: updatedCategories };
        });
    };


    return (
        <Fragment>
            <Toaster
                style={{
                    width: '100vw',
                    margin: 0,
                    position: 'fixed', // Optional: keeps it fixed at the top
                    top: 0,
                    left: 0
                }}
            />

            <div id="retailer-single-product-search-container-top">
                <div id='retailer-single-product-search-container-top-div'>
                    <MdOutlineKeyboardArrowLeft size={'20px'} style={{ marginLeft: "5px" }} />
                    <input
                        style={{ borderRadius: "5px" }}
                        id="retailer-single-product-search-bar"
                        placeholder="Search"
                    />
                </div>
            </div>
            {loading ? (
                <LoadingSingleProduct />
            ) : (
                <Fragment>
                    {productDetail && (
                        <div id="retailer-single-product-details-container">
                            <div id="retailer-single-product-details-img">
                                {/* Image Upload/Delete Section */}
                                <div className="existing-images-scrollable">
                                    {imageArray.map((image, index) => (
                                        <div key={index} className="image-container">
                                            {uploadingIndexes.has(index) ? (
                                                <div className="uploading-indicator">Uploading...</div>
                                            ) : deletingIndexes.has(index) ? (
                                                <div className="uploading-indicator">Deleting...</div>
                                            ) : image ? (
                                                <Fragment>
                                                    <img src={image} alt={`Product Image ${index + 1}`} className="existing-product-image" />
                                                    <button onClick={() => handleImageDelete(index)} className="delete-image-button">
                                                        Delete
                                                    </button>
                                                </Fragment>
                                            ) : (
                                                <div className="upload-image-container" onClick={() => document.getElementById(`image-upload-${index}`).click()}>
                                                    <p>Upload Image</p>
                                                </div>
                                            )}
                                            <input
                                                id={`image-upload-${index}`}
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleImageUpload(e, index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div id="retailer-single-product-details-info">
                                <span id="retailer-single-product-details-trending-deals">Update Product</span>
                                <p id="retailer-single-product-details-pid">Product # {productDetail._id}</p>

                                {/* Edit Product Details */}
                                {isEditing ? (
                                    <div className="retailer-product-edit-mode">
                                    <div className="retailer-product-headings">Title</div>
                                    <textarea
                                        type="text"
                                        name="title"
                                        value={editedProduct.title}
                                        onChange={handleInputChange}
                                        placeholder="Product Title"
                                        className="retailer-product-input-title"
                                    />
                                    <label className="retailer-product-headings">Description</label>
                                    <textarea
                                        name="description"
                                        value={editedProduct.description}
                                        onChange={handleInputChange}
                                        placeholder="Product Description"
                                        className="retailer-product-input-description"
                                    />
                                    <label className="retailer-product-headings">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editedProduct.price}
                                        onChange={handleInputChange}
                                        placeholder="Product Price"
                                        className="retailer-product-input-title"
                                    />
                                    <label className="retailer-product-headings">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantityAvailable"
                                        value={editedProduct.quantityAvailable}
                                        onChange={handleInputChange}
                                        placeholder="Quantity Available"
                                        className="retailer-product-input-title"
                                    />
                                    <label className="retailer-product-headings">Brand</label>
                                    <input
                                        type="text"
                                        name="brands"
                                        value={editedProduct.brand}
                                        onChange={(e) => handleArrayChange(e, 'brand')}
                                        placeholder="Brands"
                                        className="retailer-product-input-title"
                                    />
                                    <label className="retailer-product-headings">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={editedProduct.category}
                                        onChange={(e) => handleArrayChange(e, 'category')}
                                        placeholder="Category"
                                        className="retailer-product-input-title"
                                    />
                                    <button onClick={handleSaveChanges} className="retailer-save-button">Save Changes</button>
                                    <button onClick={() => setIsEditing(!isEditing)} className="retailer-discard-button">Discard</button>
                                </div>
                                ) : (
                                    <div className="retailer-view-mode">
                                        <h3 className="retailer-product-title">{productDetail.title}</h3>
                                        <p className="retailer-product-description">Description: {productDetail.description}</p>
                                        <p className="retailer-product-price">₹{productDetail.price}</p>
                                        <p className="retailer-product-quantity">Quantity Available: {productDetail.quantityAvailable}</p>
                                        <p className="retailer-product-brands">Brand: {productDetail?.brand}</p>
                                        <p className="retailer-product-category">Category: {productDetail?.category}</p>
                                        <div className="category-cards-container">
                                            {/* {productDetail.category.map((cat, index) => (
                                                <div key={index} className="category-card">
                                                    {cat}
                                                </div>
                                            ))} */}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <button onClick={() => setIsEditing(true)} className="retailer-product-edit-button">Edit</button>
                                            <button onClick={handleDeleteProduct} className="retailer-product-delete-button">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>)}
                </Fragment>)}
        </Fragment>
    );
};

export default RetailerSingleProduct;
