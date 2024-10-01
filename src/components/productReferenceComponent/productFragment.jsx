import React, { useState, useEffect, useRef } from 'react';
import '../../styles/productFragment.css';
import { RETAILER_PRODUCT_SERVER } from '../../../public/constant.js';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ReferenceCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="product-fragment-reference-card" onClick={() => navigate(`/product/${product._id}`)}>
            <div className="product-fragment-reference-card-top">
                <img className="product-fragment-reference-card-top-image" src={product.images[0]} alt={product.title} />
            </div>
            <div className="product-fragment-reference-card-bottom">
                <div className="product-fragment-reference-card-shop-price">
                    <span className="product-fragment-reference-card-shop-name">
                        {product.title.length > 45 ? `${product.title.substr(0, 30)}...` : product.title}
                    </span>
                    <span className="product-fragment-reference-card-shop">
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

const ReferenceProductCard = ({ keyword, brand, category, pincode, shopId }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [loading, setLoading] = useState(true); // State for loading
    const productsPerPage = 3;
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchProductsShop = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const keywordString = Array.isArray(keyword) ? keyword.join(',') : keyword; // Convert array to a string
                const response = await fetch(
                    `${RETAILER_PRODUCT_SERVER}/product/getproducts?keyword=${keywordString}&page=${page}&limit=${productsPerPage}`
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
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchProductsShop();
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
        <div className="product-fragment-reference-product-container" ref={containerRef}>
            {loading ? (
                // Show skeletons while loading
                <>
                    <Skeleton height={250} style={{ width: "40vw" }} />
                    <Skeleton height={250} style={{ width: "40vw" }} />
                    <Skeleton height={250} style={{ width: "40vw" }} />
                </>
            ) : (
                products.length > 0 ? (
                    products.map((product) => (
                        <ReferenceCard key={`${product._id}-${product.title}`} product={product} />
                    ))
                ) : (
                    <p>No similar products found.</p>
                )
            )}
        </div>
    );
};

export default ReferenceProductCard;
