import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import REACT_APP_API_URL from '../../public/constant.js'; 

import b1 from '../assets/b1.jpg';
import LocationLoading from './locationLoading.jsx';
import LocationError from './locationError.jsx';
import ProductCard from './productCard.jsx'; // Assuming you have a ProductCard component

import { BsShop } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";

function Home({ pinCode, setPinCode }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [categories, setCategories] = useState(''); // Update as necessary
    const [shopid, setShopId] = useState(''); // Update as necessary

    useEffect(() => {
        const fetchPincodeFromLocation = async () => {
            if (!pinCode) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;

                            try {
                                const response = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                                );
                                const data = await response.json();
                                const postcode = data.address.postcode;
                                setPinCode(postcode);
                            } catch (error) {
                                console.error('Error fetching pincode:', error);
                                setError('Failed to fetch pincode');
                            } finally {
                                setLoading(false);
                            }
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            setError('Failed to get location');
                            setLoading(false);
                        }
                    );
                } else {
                    setError('Geolocation is not supported by this browser.');
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchPincodeFromLocation();
    }, [pinCode, setPinCode]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${REACT_APP_API_URL}/api/v1/product/products?pincode=742136`
                );
                const data = await response.json();
                console.log(data);
                setCurrentProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
            }
        };
        fetchProducts();
    }, [pinCode, categories, shopid]);

    // if (loading) {
    //     return <LocationLoading />;
    // }

    // if (error) {
    //     return <LocationError message={error} />;
    // }

    return (
        <div id='home-div'>
            <div id='home-div-header'>
                <div className='home-div-header-divs'>
                    <BsShop className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
                <div className='home-div-header-divs'>
                    <RiAdminLine className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
                <div className='home-div-header-divs'>
                    <BsShop className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
                <div className='home-div-header-divs'>
                    <BsShop className='home-div-header-divs-icon' />
                    <p>SHOP</p>
                </div>
                <div className='home-div-header-divs' style={{ borderRightStyle: "none" }}>
                    <RiAdminLine className='home-div-header-divs-icon' />
                    <p>RETAILER</p>
                </div>
            </div>

            <div id='home-body'>
                <img src={b1} alt="Banner" id='home-body-img'/>
                <div className="all-product-page-grid">
                    {currentProducts.map(product => (
                        <div key={product?._id}>
                            {product?.images && product?.title && product?.price && (
                                <ProductCard
                                    id={product?._id}
                                    image={product?.images[0]}
                                    title={product?.title.length > 45 ? `${product.title.substr(0, 45)}..` : product.title}
                                    price={product?.price}
                                    quantity={product?.quantityAvailable}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div id='home-footer'>
                <div id='home-footer-sortby'>
                    <LiaSortSolid size={25} />
                    SORT BY
                </div>
                <div id='home-footer-filterby'>
                    <MdFilterList size={25} />
                    FILTER BY
                </div>
            </div>
        </div>
    );
}

export default Home;
