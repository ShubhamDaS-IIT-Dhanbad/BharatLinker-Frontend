import React, { useState, useEffect } from 'react';
import { RETAILER_PRODUCT_SERVER } from '../../public/constant.js';
import RetailerProductCard from './retailerProductCard.jsx';
import LoadingSearchPage from '../components/loadingComponents/loadingSearchPage.jsx';
import { TbClockSearch } from 'react-icons/tb';
import axios from 'axios';
import '../retailerStyles/retailerProductPage.css'
const RetailerProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shopDetails, setShopDetail] = useState({});
    const [hasMoreProducts, setHasMoreProducts] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 10;

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
            setShopDetail(retailerData);
        }
    }, []);

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${RETAILER_PRODUCT_SERVER}/product/getproductbyshopid?shopId=${shopDetails.id}&page=${page}&limit=${productsPerPage}`
            );
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
            setHasMoreProducts(response.data.products.length === productsPerPage);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (shopDetails.id) {
            fetchProducts(currentPage);
        }
    }, [shopDetails, currentPage]);

    const handleNextPage = () => {
        if (hasMoreProducts) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="retailer-product-container">
            {loading ? (
                <LoadingSearchPage />
            ) : (
                <>
                    {products.length > 0 ? (
                        <div className="retailer-product-grid">
                            {products.map((product) => (
                                <div key={product?._id} className="product-card-wrapper">
                                    {product?.images && product?.title && product?.price && (
                                        <RetailerProductCard
                                            id={product._id || 'default-id'}
                                            image={product.images[0]}
                                            title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                                            price={product.price}
                                            quantity={product.quantityAvailable}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-product-found">
                            <TbClockSearch size={60} />
                            <p>No Product Found</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-btn">
                            Previous
                        </button>
                        <span className="page-number">Page {currentPage}</span>
                        <button onClick={handleNextPage} disabled={!hasMoreProducts} className="pagination-btn">
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RetailerProduct;
