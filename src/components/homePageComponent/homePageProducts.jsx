import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setCurrentPage } from '../../redux/features/homeProductSlice.jsx';
import ProductCard from '../productCard.jsx';
import LoadingSearchPage from '../loadingComponents/loadingSearchPage.jsx';

import { TbClockSearch } from 'react-icons/tb';
import { useUserPincode } from '../../hooks/useUserPincode.jsx';
import { IoIosArrowDown } from "react-icons/io";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/homePageProducts.css';

const HomePageProducts = () => {
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const { userPincodes } = useUserPincode();

    // Redux state
    const { products, loading, hasMoreProducts, currentPage, error } = useSelector((state) => state.homepageproducts);
    const selectedPincodes = userPincodes.filter(pin => pin.selected).map(pin => pin.pincode);

    // Fetch products when component mounts, if no products are loaded
    useEffect(() => {
        if (products.length === 0 && !loading && currentPage === 1) {
            setFetching(true);
            dispatch(fetchProducts({ selectedPincodes, page: 1 })).finally(() => {
                setFetching(false);
            });
        }
    }, []);

    // Handle "Load More" button click
    const handleLoadMore = () => {
        if (!loading && hasMoreProducts && !fetching) {
            setFetching(true);
            dispatch(setCurrentPage(currentPage + 1));
            dispatch(fetchProducts({ selectedPincodes, page: currentPage + 1 })).finally(() => {
                setFetching(false);
            });
        }
    };

    // Error handling
    if (error) return <div>Error: {error}</div>;

    return (
        <div id="search-product-home-page-container">
            {loading && <LoadingSearchPage />}

            {!loading && products.length > 0 ? (
                <div id="search-product-home-page-grid">
                    {products.map((product) => (
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

            {/* Load More Button */}
            {hasMoreProducts && !loading && (
                <div className='load-more-container'>
                    < IoIosArrowDown size={30} className="load-more-container" onClick={handleLoadMore} />
                </div>
            )}

            <ToastContainer
                position="bottom-center"
                closeOnClick
                autoClose={2000}
                hideProgressBar={true}
                pauseOnHover={false}
                toastStyle={{ marginBottom: '67px' }}
            />
        </div>
    );
};

export default HomePageProducts;
