import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams to get the query from URL
import ProductCard from './productCard.jsx';
import '../styles/searchPage.css'

import REACT_APP_API_URL from '../../public/constant.js'; 
const SearchPage = () => {
    const [searchParams] = useSearchParams(); // Hook to access query parameters
    const query = searchParams.get('query'); // Get the 'query' parameter
    const [products, setProducts] = useState([]);
    const pincodeArray = [742136, 123456]; // Example array of pincodes

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${REACT_APP_API_URL}/api/v1/product/products?pincode=742136&keyword=${query}`);

                if (!response.ok) {
                    // Handle non-2xx responses
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }
        
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        

        if (query) {
            fetchProducts();
        }
    }, [query]); // Fetch new products whenever the query changes

    return (
        <div id="search-product-page-container">
            <div id="search-product-page-grid">
                {products.map((product) => (
                    <div key={product?._id}>
                        {product?.images && product?.title && product?.price && (
                            <ProductCard
                                id={product?._id}
                                image={product?.images[0]}
                                title={product?.title.length > 45 ? `${product.title.substr(0, 45)}..` : product.title}
                                price={product?.price}
                                quantity={product?.quantityAvailable}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
