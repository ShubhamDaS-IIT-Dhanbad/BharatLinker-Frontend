import React, { useState, useEffect, useRef } from 'react';
import '../../styles/homeProductFragment.css';
import REACT_APP_API_URL from '../../../public/constant.js';
import { useNavigate } from 'react-router-dom';

const HomePageProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="home-page-product-fragment-card" onClick={() => navigate(`/product/${product._id}`)}>
            <div className="home-page-product-fragment-card-top">
                <img className="home-page-product-fragment-card-top-image" src={product.images[0]} alt={product.title} />
            </div>
            <div className="home-page-product-fragment-card-bottom">
                <div className="home-page-product-fragment-card-shop-price">
                    <span className="home-page-product-fragment-card-shop-name">
                        {product.title.length > 45 ? `${product.title.substr(0, 30)}...` : product.title}
                    </span>
                    <span className="home-page-product-fragment-card-shop">
                        ₹{product.price}
                    </span>
                </div>
                <div className={`home-page-product-fragment-card-bottom-stock ${product.quantityAvailable > 0 ? 'instock' : 'outofstock'}`}>
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

const HomePageProductFragment = ({ keyword,brand, category, pincode, shopId }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const productsPerPage = 3;
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchProductsShop = async () => {
            try {
                const response = await fetch(
                    `${REACT_APP_API_URL}/api/v1/product/products?keyword=${keyword}&page=${page}&limit=${productsPerPage}`
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                const data = await response.json();

                if (data.products && data.products.length > 0) {
                    setProducts((prevProducts) => {
                        if (page === 1) {
                            return data.products;
                        }
                        return [...prevProducts, ...data.products];
                    });
                } else {
                    setHasMoreProducts(false);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (true) fetchProductsShop();
    }, [shopId, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const lastCard = containerRef.current.lastChild;
                if (lastCard) {
                    const lastCardRect = lastCard.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();

                    if (lastCardRect.right <= containerRect.right && hasMoreProducts) {
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
        <div className="home-page-product-fragment-container" ref={containerRef}>
            {products.length > 0 ? (
                products.map((product) => (
                    <HomePageProductCard key={`${product._id}-${product.title}`} product={product} />
                ))
            ) : (
                <p>No similar products found.</p>
            )}
        </div>
    );
};

export default HomePageProductFragment;
