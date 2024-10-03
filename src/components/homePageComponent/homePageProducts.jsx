import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/features/homeProductSlice.jsx';
import ProductCard from '../productCard.jsx';
import LoadingSearchPage from '../loadingComponents/loadingSearchPage.jsx';
import { TbClockSearch } from 'react-icons/tb';
import { useUserPincode } from '../../hooks/useUserPincode.jsx';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import the toast CSS
import '../../styles/homePageProducts.css';

const HomePageProducts = () => {
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const { userPincodes } = useUserPincode();

    const { products, loading, hasMoreProducts, error, totalPages } = useSelector((state) => state.homepageproducts);
    const [currentPage, setCurrentPage] = useState(1);
    const selectedPincodes = userPincodes.filter(pin => pin.selected).map(pin => pin.pincode);

    useEffect(() => {
        if (hasMoreProducts && !products[currentPage] && !loading) {
            dispatch(fetchProducts({ selectedPincodes, page: currentPage }));
        }
    }, [currentPage, selectedPincodes, hasMoreProducts, products]);

    const handlePreviousClick = () => {
        if (currentPage === 1) {
            toast.warn('No previous page available', { autoClose: 2000 }); // Show toast
            return;
        }
        setCurrentPage((prev) => prev - 1);
    };

    const handleNextClick = () => {
        if (currentPage === totalPages) {
            toast.warn('No more products available', { autoClose: 2000 }); // Show toast
            return;
        }
        setCurrentPage((prev) => prev + 1);
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div id="search-product-home-page-container">
            {loading && <LoadingSearchPage />}
            {!loading && products[currentPage]?.length > 0 ? (
                <div id="search-product-home-page-grid">
                    {products[currentPage].map((product) => (
                        <div key={product._id}>
                            {product.images && product.title && product.price && (
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
                !loading && (
                    <div className='no-shop-found'>
                        <TbClockSearch size={60} />
                        <p>No Product Found</p>
                    </div>
                )
            )}

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    onClick={handlePreviousClick}
                    className="pagination-controls-previous"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextClick}
                    className="pagination-controls-next-button"
                >
                    Next
                </button>
            </div>
            <ToastContainer
                position="bottom-center"
                closeOnClick
                autoClose={2000}
                hideProgressBar={true}
                pauseOnHover={false}
                toastStyle={{ marginBottom: '67px' }}  // Adding margin from the bottom
            />
            {/* Toast container configured for bottom-center */}
        </div>
    );
};

export default HomePageProducts;
