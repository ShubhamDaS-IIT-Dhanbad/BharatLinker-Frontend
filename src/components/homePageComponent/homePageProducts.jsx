import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../productCard.jsx';
import LoadingSearchPage from '../loadingComponents/loadingSearchPage.jsx';
import { TbClockSearch } from 'react-icons/tb';
import { RETAILER_PRODUCT_SERVER } from '../../../public/constant.js';
import { useUserPincode } from '../../hooks/useUserPincode.jsx'; // Import your custom hook
import '../../styles/homePageProducts.css';

const HomePageProducts = () => {
    const {userPincodes } = useUserPincode(); // Use custom hook for pincodes
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);

    const fetchProducts = async (page) => {
        try {
            setLoading(true);
            // Get selected pincodes from the hook
            const selectedPincodes =userPincodes.filter(pin => pin.selected).map(pin => pin.pincode);
            console.log("Fetching products for pincodes", selectedPincodes);
            const response = await axios.get(`${RETAILER_PRODUCT_SERVER}/product/gethomepageproducts?pincodes=${selectedPincodes}&page=${page}&limit=10`);
            
            const { products, totalPages } = response.data;
            setProducts(prevProducts => (page === 1 ? products : [...prevProducts, ...products]));
            setTotalPages(totalPages);
            setCurrentPage(page);
            setHasMoreProducts(products.length > 0);
        } catch (error) {
            console.error('Error fetching products:', error.response?.data?.message || error.message);
            setHasMoreProducts(false);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchProducts(newPage);
    };

    // Fetch products on initial load or when pincodes change
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage,userPincodes]); // Run effect when currentPage oruserPincodes changes

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
