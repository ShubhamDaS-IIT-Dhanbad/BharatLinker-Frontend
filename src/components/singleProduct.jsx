import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/singleProduct.css";

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import ProductFragment from './productReferenceComponent/productFragment.jsx';
import REACT_APP_API_URL from '../../public/constant.js';
import LoadingSingleProductPage from "./loadingSingleProduct.jsx";

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetails] = useState(null);
    const [shopDetail, setShopDetail] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`${REACT_APP_API_URL}/api/v1/product/productsdetail/${productId}`);
                const data = await response.json();
                setProductDetails(data.product);
                if (data.product.images && data.product.images.length > 0) {
                    setSelectedImage(data.product.images[0]);
                }
                console.log(data.product)
                if (data.product.shop) {
                    const shopResponse = await fetch(`${REACT_APP_API_URL}/api/v1/shop/shopdetail/${data.product.shop}`);
                    const shopData = await shopResponse.json();
                    setShopDetail(shopData.shop);
                    console.log(shopData.shop)
                }
            } catch (err) {
                console.error("Error while fetching product or shop details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [productId]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    const handleShopClick = () => {
        if (shopDetail) {
            navigate(`/shop/${shopDetail._id}`);
        }
    };
    // return <LoadingSingleProductPage/>;
    return (
        <Fragment>
            <div id="product-details-search-container-top">
                <div id='product-details-search-container-top-div'>
                    <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { navigate('/') }} />
                    <input
                        style={{ borderRadius: "5px" }}
                        id="product-details-search-bar"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search"
                        onKeyDown={handleEnter}
                    />
                </div>
            </div>

            {loading ? (
                <LoadingSingleProductPage />
            ) : (
                <Fragment>
                    {productDetail && (
                        <div id="product-details-container">
                            <div id="product-details-img">
                                <img src={selectedImage} alt="Selected Product" id="product-details-img-selected" />
                            </div>

                            <div id="product-details-info">
                                <span id="product-details-trending-deals">Trending deal</span>
                                <p id="product-details-pid">Product # {productDetail._id}</p>
                                <div id="product-details-title">{productDetail.title}</div>
                            </div>

                            <div id="product-details-see-all-brand-product">
                                See All {productDetail.brand} Products <MdOutlineKeyboardArrowRight size={11} />
                            </div>

                            <div 
                                id="product-details-shop" 
                                onClick={handleShopClick} 
                                style={{ cursor: 'pointer' }}
                            >
                                Shop: {shopDetail ? shopDetail.shopName : 'Loading...'}
                                <HiOutlineArrowRightStartOnRectangle />
                            </div>

                            <div id="product-details-price-button">
                                <p>₹{productDetail.price}</p>
                                <div id="product-details-price-instock">
                                    {productDetail.quantityAvailable > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                                </div>
                            </div>

                            <div id="product-details-hr"></div>

                            <div 
                                id="product-details-about" 
                                onClick={toggleDescription} 
                                style={{ cursor: 'pointer' }}
                            >
                                <p>About Product</p>
                                {showDescription ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            {showDescription && (
                                <div id="product-details-description">
                                    Description: {productDetail.description}
                                </div>
                            )}

                            <div id="product-details-hr"></div>

                            <div id="product-details-similar">
                                <p>Similar products</p>
                                <ProductFragment brand={productDetail.brand} />
                            </div>
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
