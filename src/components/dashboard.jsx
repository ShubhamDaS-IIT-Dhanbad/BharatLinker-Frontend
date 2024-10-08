import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { BiSearchAlt } from 'react-icons/bi';
import { TbShieldMinus } from "react-icons/tb";
import Cookies from 'js-cookie';
import { setUserData, clearUserData, fetchProductsByUserId, setError } from '../redux/features/userSlice.jsx';
import { updateUserRefurbish } from '../redux/features/pincodeUpdatedSlice';
import '../styles/dashboard.css';
import { TbClockSearch } from "react-icons/tb";
import w1 from '../assets/welcome.png';
import { ToastContainer, toast } from 'react-toastify'; // Import toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { displayName, currentPage, email, uid, products, hasMoreProducts, loading } = useSelector(state => state.user);
    const [searchInput, setSearchInput] = useState('');
    const [fetching, setFetching] = useState(false);
    const [hideHeader, setHideHeader] = useState(false);
    const { isUpdatedUserProduct } = useSelector((state) => state.pincodestate);
    const [showToast, setShowToast] = useState(true); // Add state for toast visibility
    
    const MAX_PRODUCTS = 3; // Set the maximum products allowed

    useEffect(() => {
        const userCookie = Cookies.get('BharatLinkerUser');
        if (userCookie) {
            try {
                const user = JSON.parse(decodeURIComponent(userCookie));
                dispatch(setUserData(user));
                dispatch(fetchProductsByUserId(user.uid, 1, '')); // Default to an empty search
                dispatch(updateUserRefurbish());
            } catch (error) {
                console.error('Error parsing user cookie:', error);
                dispatch(clearUserData());
            }
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setHideHeader(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSearchSubmit = () => {
        if (searchInput.trim() === '') {
            // Fetch all products if the search query is empty
            dispatch(fetchProductsByUserId(uid, 1, ''));
        } else {
            // Fetch products matching the search input
            dispatch(fetchProductsByUserId(uid, 1, searchInput));
        }
    };

    const handleUploadClick = () => {
        if (!displayName) {
            navigate('/login');
        } else if (products.length >= MAX_PRODUCTS) {
            toast.error(`You can only upload up to ${MAX_PRODUCTS} products!`); // Show toast message
        } else {
            navigate('/refurbished/product/upload');
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            Cookies.remove('BharatLinkerUser');
            dispatch(clearUserData());
            toast.success('Successfully logged out!'); // Show toast message on logout
            navigate('/', { replace: true });
        }
    };

    const handleLoadMore = () => {
        if (!fetching && uid && hasMoreProducts) {
            setFetching(true);
            const nextPage = currentPage + 1;

            dispatch(fetchProductsByUserId(uid, nextPage, searchInput))
                .then(() => {
                    setFetching(false);
                })
                .catch((error) => {
                    console.error("Error loading more products:", error);
                    dispatch(setError('Failed to load more products.'));
                    setFetching(false);
                });
        }
    };

    return (
        <div>
            {showToast && (
                <ToastContainer
                    style={{ position: "fixed", top: '0px', zIndex: "10000000" }}
                    onClick={() => setShowToast(false)} // Hide on click
                />
            )}
            <div className={`dashboard-header-show ${hideHeader ? 'hide' : ''}`}>
                <div className='dashboard-header-parent'>
                    <div className='dashboard-header-user'>
                        <TbShieldMinus id='dashboard-header-ham' size={35} onClick={handleLogout} />
                        <div id='dashboard-header-user-location-div'>
                            <p id='dashboard-header-user-location'>{displayName || 'User'}</p>
                            <p id='dashboard-header-user-email'>{email || 'Email not provided'}</p>
                        </div>
                    </div>
                    <IoHomeOutline size={25} className='dashboard-header-parent-refurbished' onClick={() => navigate('/')} />
                </div>

                <div id='dashboard-header-search-div'>
                    <div id='dashboard-header-search-div-1'>
                        <BiSearchAlt id='dashboard-header-search-div-search' onClick={handleSearchSubmit} />
                        <input
                            id='dashboard-header-input'
                            placeholder="Search Your Refurbished"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                        />
                    </div>
                </div>
            </div>
            <div className='dashboard-welcome-img-div'>
                <img className='dashboard-welcome-img' src={w1} alt="Welcome" />
            </div>
            <div className="dashboard-product-list">
                {products.length > 0 ? (
                    products.map(product => (
                        <div className="user-dashboard-product-card" key={product._id}>
                            <div className="user-dashboard-product-card-top">
                                <img className="user-dashboard-product-card-top-image" src={product.images[0]} alt={product.title} />
                            </div>
                            <div className="user-dashboard-product-card-bottom">
                                <span className='user-dashboard-product-card-shop-name'>{product.title}</span>
                                <span className='user-dashboard-product-card-shop'>₹{product.price}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && <div className='no-product-found'>
                        <TbClockSearch size={60} />
                        <div>You Refurbished Is Empty</div>
                        <div style={{ fontWeight: "900" }}>Upload Refurbished</div>
                    </div>
                )}
            </div>

            {fetching && <p>Loading more products...</p>}
            {loading && <p>Loading more products...</p>}

            {hasMoreProducts && !loading && !fetching && (
                <div className='load-more-container'>
                    <IoIosArrowDown size={30} onClick={handleLoadMore} />
                </div>
            )}

            <div id='dashboard-refurbished-footer'>
                <div id='refurbished-footer-item' onClick={handleUploadClick}>
                    Upload Refurbished
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
