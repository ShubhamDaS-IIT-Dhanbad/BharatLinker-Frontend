import React, { useState, useEffect, useRef } from 'react';
import '../../styles/shopFragment.css';
import REACT_APP_API_URL from '../../../public/constant.js';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ShopFragmentCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="shop-fragment-card" onClick={() => navigate(`/product/${product._id}`)}>
            <div className="shop-fragment-card-top">
                <img className="shop-fragment-card-top-image" src={product.images[0]} alt={product.title} />
            </div>
            <div className='shop-fragment-card-bottom'>
                <div className="shop-fragment-card-shop-price">
                    <span className='shop-fragment-card-shop-name'>
                        {product.title.length > 45 ? `${product.title.substr(0, 30)}...` : product.title}
                    </span>
                    <span className='shop-fragment-card-shop'>
                        ₹{product.price}
                    </span>
                </div>
                <div className={`product-card-bottom-stock ${product.quantityAvailable > 0 ? 'instock' : 'outofstock'}`}>
                    {product.quantityAvailable > 0 ? (
                        <span>IN STOCK</span>
                    ) : (
                        <span>OUT OF STOCK</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ShopFragment = ({ brand, shopId }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const productsPerPage = 5;
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Set loading to true when fetching starts
            try {
                const response = await fetch(
                    `${REACT_APP_API_URL}/api/v1/product/retailerproducts?shopId=${shopId}&page=${page}&limit=${productsPerPage}`
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                const data = await response.json();

                if (data.products && data.products.length > 0) {
                    setProducts((prevProducts) => {
                        if (page === 1) {
                            return data.products; // Replace with new data
                        }
                        return [...prevProducts, ...data.products]; // Append new products
                    });
                } else {
                    setHasMoreProducts(false); // No more products to load
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false); // Set loading to false when fetching completes
            }
        };

        fetchProducts();
    }, [shopId, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const lastCard = containerRef.current.lastChild;
                if (lastCard) {
                    const lastCardRect = lastCard.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();

                    // Check if the last card is visible in the viewport
                    if (lastCardRect.bottom <= containerRect.bottom && hasMoreProducts) {
                        setPage((prevPage) => prevPage + 1);
                    }
                }
            }
        };

        const currentContainer = containerRef.current;
        currentContainer.addEventListener('scroll', handleScroll);
        return () => {
            currentContainer.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreProducts]);

    return (
        <div className='shop-fragment-container' ref={containerRef}>
            {loading ? (
                // Show skeleton loaders while loading
                <>
                    <Skeleton height={250} style={{ width: "40vw" }} />
                    <Skeleton height={250} style={{ width: "40vw" }} />
                    <Skeleton height={250} style={{ width: "40vw" }} />
                </>
            ) : (
                products.length > 0 ? (
                    products.map((product) => (
                        <ShopFragmentCard key={`${product._id}-${product.title}`} product={product} />
                    ))
                ) : (
                    <p>No similar products found.</p>
                )
            )}
        </div>
    );
};

export default ShopFragment;
