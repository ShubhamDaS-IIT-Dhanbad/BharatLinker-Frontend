import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/features/homeProductSlice.jsx';
import ProductCard from '../productCard.jsx';
import LoadingSearchPage from '../loadingComponents/loadingSearchPage.jsx';
import { TbClockSearch } from 'react-icons/tb';
import { useUserPincode } from '../../hooks/useUserPincode.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/homePageProducts.css';

const HomePageProducts = () => {
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const { userPincodes } = useUserPincode();

    const { products, loading, hasMoreProducts, error } = useSelector((state) => state.homepageproducts);
    const [currentPage, setCurrentPage] = useState(1);
    const selectedPincodes = userPincodes.filter(pin => pin.selected).map(pin => pin.pincode);

    // Fetch products when component mounts or when page/pincode changes
    useEffect(() => {
        if (hasMoreProducts && !fetching && !loading) {
            setFetching(true);
            dispatch(fetchProducts({ selectedPincodes, page: currentPage })).finally(() => {
                setFetching(false);
            });
        }
    }, [currentPage, selectedPincodes, hasMoreProducts, fetching, loading, dispatch]);

    // Infinite scroll logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading && hasMoreProducts) {
                setCurrentPage((prev) => prev + 1);  // Load next page
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, hasMoreProducts]);

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
