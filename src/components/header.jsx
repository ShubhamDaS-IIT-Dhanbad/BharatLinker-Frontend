import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserPincode } from '../hooks/useUserPincode.jsx';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, resetProducts, setCurrentPage } from '../redux/features/searchProductSlice.jsx';

function Navbar({ address }) {
    const dispatch = useDispatch();

    const [searchInput, setSearchInput] = useState('');
    const [hideHeader, setHideHeader] = useState(false);
    const navigate = useNavigate();

    const {
        userPincodes,
        inputValue,
        handleInputChange,
        handleAddPincode,
        togglePincodeSelection,
        handleDeletePincode
    } = useUserPincode();


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
        const trimmedInput = searchInput.trim();
        if (trimmedInput) {
            const params = {
                inputValue: trimmedInput,
                page: 1,
                productsPerPage: 20,
                selectedPincodes: userPincodes.filter(pin => pin.selected).map(pin => Number(pin.pincode)),
                selectedCategories: [],
                selectedBrands: [],
                showSortBy: ''
            };
            dispatch(resetProducts());
            dispatch(fetchProducts(params));
            navigate(`/search?query=${encodeURIComponent(trimmedInput)}`);
        }
    };


    return (
        <div className={hideHeader ? 'header-div-hide' : 'header-div-show'}>
            <div className='header-div-user'>
                <HiOutlineUserCircle id='header-div-ham' size={35} />
                <div id='header-div-user-location-div'>
                    <p id='header-div-user-location'>Location</p>
                    <div id='header-div-user-location-name' onClick={() => navigate('/pincode')}>
                        {address.city} {address.postcode}
                        <TbChevronDown size={15} />
                    </div>
                </div>
            </div>

            <div id='header-div-search-div'>
                <div id='header-div-search-div-1'>
                    <BiSearchAlt id='header-div-search-div-search' onClick={handleSearchSubmit} />
                    <input
                        id='header-div-input'
                        placeholder="Search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    />
                </div>
            </div>

          

        </div>
    );
}

export default Navbar;
