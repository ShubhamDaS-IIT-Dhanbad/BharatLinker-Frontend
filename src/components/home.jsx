import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import REACT_APP_API_URL from '../../public/constant.js';
import b1 from '../assets/b1.jpg';
import ProductCard from './productCard.jsx';

import { MdFilterList } from "react-icons/md";
import { LiaSortSolid } from "react-icons/lia";


function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const productsPerPage = 4; // Set the number of products per page
    const [pincode, setPinCode] = useState('742136'); // Default pincode
    const containerRef = useRef(null); // Reference for the container

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${REACT_APP_API_URL}/api/v1/product/products?pincode=${pincode}&page=${page}&limit=${productsPerPage}`);
                const data = await response.json();

                if (data.products && data.products.length > 0) {
                    setCurrentProducts((prevProducts) => {
                        if (page === 1) {
                            return data.products; // Replace with new data
                        }
                        return [...prevProducts, ...data.products]; // Append new products
                    });
                } else {
                    setHasMoreProducts(false); // No more products to load
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pincode, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const lastCard = containerRef.current.lastChild;
                if (lastCard) {
                    const lastCardRect = lastCard.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();

                    
                    if (lastCardRect.bottom <= containerRect.bottom && hasMoreProducts) {
                        setPage((prevPage) => prevPage + 1);
                    }
                }
            }
        };

        const currentContainer = containerRef.current;
        currentContainer.addEventListener('scroll', handleScroll);
        return () => {
            currentContainer.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreProducts]);

    return (
        <div id='home-div' ref={containerRef} style={{ overflowY: 'auto', maxHeight: '80vh' }}>
            <div id='home-body'>
                <img src={b1} alt="Banner" id='home-body-img' />

                <div className="all-product-page-grid">
                    {currentProducts.map(product => (
                        <div key={product._id}>
                            {product.images && product.title && product.price && (
                                <ProductCard
                                    id={product._id}
                                    image={product.images[0]}
                                    title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                                    price={product.price}
                                    quantity={product.quantityAvailable}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {loading && <p>Loading more products...</p>}
                {!hasMoreProducts && <p>No more products to load.</p>}
            </div>

            <div id='home-footer'>
                <div id='home-footer-sortby'>
                    <LiaSortSolid size={25} />
                    SORT BY
                </div>
                <div id='home-footer-filterby'>
                    <MdFilterList size={25} />
                    FILTER BY
                </div>
            </div>
        </div>
    );
}

export default Home;
