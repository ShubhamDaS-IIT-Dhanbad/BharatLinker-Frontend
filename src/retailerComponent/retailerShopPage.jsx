import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { BiSearchAlt } from 'react-icons/bi';
import { TbChevronDown, TbCategoryPlus } from "react-icons/tb";
import { MdOutlineStore, MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiSunCloudyLine } from "react-icons/ri";
import { ToastContainer } from 'react-toastify';
import axios from 'axios'; // Import axios
import RETAILER_SERVER from '../../public/constant.js';

function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Function to get cookie value by name
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

    // Function to get BharatLinkerRetailer cookie and parse it to JSON
    const getBharatLinkerRetailerCookie = () => {
        const cookieName = 'BharatLinkerRetailer=';
        const cookieArray = document.cookie.split('; ');
        const foundCookie = cookieArray.find(row => row.startsWith(cookieName));
      
        const data = foundCookie ? JSON.parse(decodeURIComponent(foundCookie.split('=')[1])) : null;
     
        return data;
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            const bharatLinkerRetailerValue = getBharatLinkerRetailerCookie();
            if (!bharatLinkerRetailerValue) {
                setError("Retailer not found in cookies.");
                return;
            }

            try {
                setLoading(true);
                console.log(bharatLinkerRetailerValue)
                const response = await axios.post(`http://localhost:3001/shop/getdetail?shopId=${bharatLinkerRetailerValue.id}`);
                console.log("ko",response)
                setCurrentProducts(response.data.shop || []); // Adjust based on the API response structure
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchSubmit = () => {
        // Implement your search functionality
        console.log('Search:', searchInput);
    };

    return (
        <div className="home">
            <div className="header-div">
                <div className="header-div-user">
                    <HiOutlineUserCircle id="header-div-ham" size={35} />
                    <div id="header-div-user-location-div">
                        <p id="header-div-user-location">Location</p>
                        <div id="header-div-user-location-name" onClick={() => navigate('/pincode')}>
                            City Postcode
                            <TbChevronDown size={15} />
                        </div>
                    </div>
                </div>

                <div id="header-div-search-div">
                    <div id="header-div-search-div-1">
                        <BiSearchAlt id="header-div-search-div-search" onClick={handleSearchSubmit} />
                        <input
                            id="header-div-input"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                        />
                    </div>
                </div>

                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    closeOnClick
                    draggable
                    pauseOnHover
                    style={{ position: "fixed", top: "87vh" }}
                />
            </div>

            <div id="home-div" ref={containerRef}>
                {loading ? (
                    <div>
                        <Skeleton height={400} width={'100%'} />
                        <Skeleton height={30} width={200} style={{ margin: '20px 0' }} />
                        <Skeleton count={3} height={200} width={300} style={{ margin: '10px' }} />
                    </div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                   <>ji</>
                )}

                <div id="home-footer">
                    <div id="home-footer-shop" onClick={() => navigate('/')}>
                        <RiSunCloudyLine size={30} />
                        Shop
                    </div>
                    <div id="home-footer-shop" onClick={() => navigate('/search')}>
                        <TbCategoryPlus size={30} />
                        Update Retailer
                    </div>
                    <div id="home-footer-shop" onClick={() => navigate('/shop')}>
                        <MdOutlineStore size={30} />
                        Update Shop
                    </div>
                    <div id="home-footer-shop" onClick={() => navigate('/products')}>
                        <MdOutlineAdminPanelSettings size={30} />
                        Products
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
