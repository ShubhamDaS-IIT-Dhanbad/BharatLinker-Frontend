import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import '../../styles/shopFragment.css';
import { RETAILER_PRODUCT_SERVER } from '../../../public/constant.js';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ShopFragmentCard = ({ product, lastElementRef }) => {
    const navigate = useNavigate();

    return (
        <div className="shop-fragment-card" onClick={() => navigate(`/product/${product._id}`)} ref={lastElementRef}>
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

const ShopFragment = ({ shopId }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [loading, setLoading] = useState(true);
    const productsPerPage = 6;

    // Fetch products on page load and when page changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${RETAILER_PRODUCT_SERVER}/product/getproductbyshopid?shopId=${shopId}&page=${page}&limit=${productsPerPage}`);
                const { products: newProducts } = response.data;
                if (newProducts && newProducts.length > 0) {
                    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
                } else {
                    setHasMoreProducts(false); // No more products to load
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (hasMoreProducts) {
            fetchProducts();
        }
    }, [shopId, page, hasMoreProducts]);

    // Create an intersection observer to observe the last product card
    const observer = useRef();
    const lastProductCardRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMoreProducts) {
                setPage((prevPage) => prevPage + 1); // Load more products
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMoreProducts]);

    return (
        <div className='shop-fragment-container'>
            {products.length > 0 ? (
                products.map((product, index) => {
                    if (products.length === index + 1) {
                        // Attach the ref to the last product card
                        return <ShopFragmentCard key={`${product._id}-${product.title}`} product={product} lastElementRef={lastProductCardRef} />;
                    } else {
                        return <ShopFragmentCard key={`${product._id}-${product.title}`} product={product} />;
                    }
                })
            ) : (
                <p>Empty</p>
            )}

            {loading && (
                <div className="skeleton-container">
                    <Skeleton height={250} style={{ width: "40vw" }} />
                    <Skeleton height={250} style={{ width: "40vw" }} />
                    <Skeleton height={250} style={{ width: "40vw" }} />
                </div>
            )}

            {/* {!hasMoreProducts && products.length > 0 && <p>Reached end of products.</p>} */}
        </div>
    );
};

export default ShopFragment;
