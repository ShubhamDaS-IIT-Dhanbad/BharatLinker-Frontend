import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/singleProduct.css";

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import ProductFragment from './productReferenceComponent/productFragment.jsx';
import { RETAILER_PRODUCT_SERVER, RETAILER_SERVER } from '../../public/constant.js';

import LoadingSingleProduct from "./loadingComponents/loadingSingleProduct.jsx";


import { BiSearchAlt } from "react-icons/bi";
import { TbHomeMove } from "react-icons/tb";
import { MdOutlineStore } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";

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
                const response = await fetch(`${RETAILER_PRODUCT_SERVER}/product/getproductdetails?productId=${productId}`);
                const data = await response.json();
                setProductDetails(data.product);
                if (data.product.images && data.product.images.length > 0) {
                    setSelectedImage(data.product.images[0]);
                }
                setLoading(false);
                if (data.product.shop) {
                    const shopResponse = await fetch(`${RETAILER_SERVER}/shop/getshopdetails?shopId=${data.product.shop}`);
                    const shopData = await shopResponse.json();
                    setShopDetail(shopData.shop);
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

    return (
        <Fragment>
            {/* <div id="product-details-search-container-top">
                <div id='product-details-search-container-top-div'>
                    <MdOutlineKeyboardArrowLeft size={'20px'} style={{marginLeft:"5px"}} onClick={()=>navigate('/search')}/>
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
             */}
            <div id='product-details-search-container-top'>
                <div id='product-details-search-container-top-div'>
                    <BiSearchAlt size={40} id='header-div-search-div-search' />
                    <input
                        id='product-details-search-bar'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Products"
                        onKeyDown={handleEnter}
                    />
                    < TbCategoryPlus onClick={() => { navigate('/search') }} size={35} style={{ paddingRight: "10px" }} />
                </div>
            </div>





            {loading ? (
                <LoadingSingleProduct />
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
                                <div id={`product-details-price-${productDetail.quantityAvailable > 0 ? 'instock' : 'outofstock'}`}>
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
                                <ProductFragment brand={productDetail.brand} keyword={productDetail.keywords} />
                            </div>
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
