import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../productCard.jsx';
import LoadingSearchPage from '../loadingComponents/loadingSearchPage.jsx';
import { TbClockSearch } from 'react-icons/tb';
import { RETAILER_PRODUCT_SERVER } from '../../../public/constant.js';
import '../../styles/homePageProducts.css';

const HomePageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [pincodeArray, setPincodeArray] = useState([]);
    const [searchByPincode, setSearchNyPincode] = useState([]);
    const [pincodesLoaded, setPincodesLoaded] = useState(false);
    const [pincodeLoading, setPincodeLoading] = useState(true);

    // Fetch the pincode from cookies
    const getCookieValue = (cookieName) => {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let cookie of cookieArray) {
            cookie = cookie.trim();
            if (cookie.startsWith(name)) {
                return cookie.substring(name.length);
            }
        }
        return null;
    };

    useEffect(() => {
        const pincodesCookie = getCookieValue('userpincodes');
        if (pincodesCookie) {
            try {
                const pincodesData = JSON.parse(pincodesCookie);
                setPincodeArray(pincodesData);
                setPincodesLoaded(true); // Set pincodes as loaded
            } catch (error) {
                console.error("Error parsing userpincodes cookie", error);
            }
        } else {
            console.log("No pincodes found in cookie.");
        }
        setPincodeLoading(false);
    }, []);

    const fetchProducts = async (page) => {
        try {
            setLoading(true);
            
            setSearchNyPincode(pincodeArray.filter(pin => pin.selected).map(pin => pin.pincode));
            console.log("ji",searchByPincode)
            const response = await axios.get(`${RETAILER_PRODUCT_SERVER}/product/gethomepageproducts?pincodes=742136&page=${page}&limit=10`);
            console.log(response);
            const { products, totalPages, currentPage } = response.data;
            setProducts(products);
            setTotalPages(totalPages);
            setCurrentPage(currentPage);
            setHasMoreProducts(products.length > 0);
        } catch (error) {
            console.error('Error fetching products:', error.response?.data?.message || error.message);
            setHasMoreProducts(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchProducts(currentPage);
    }, [currentPage,pincodeArray,setPincodeArray]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div id="search-product-page-container">
            {loading ? (
                <LoadingSearchPage />
            ) : (
                <>
                    {products.length > 0 ? (
                        <div id="search-product-page-grid">
                            {products.map((product) => (
                                <div key={product?._id}>
                                    {product?.images && product?.title && product?.price && (
                                        <ProductCard
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
                        !hasMoreProducts && (
                            <div className='no-shop-found'>
                                <TbClockSearch size={60} />
                                <p>No Product Found</p>
                            </div>
                        )
                    )}
                </>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePageProducts;
