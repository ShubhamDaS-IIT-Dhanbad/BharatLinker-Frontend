import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopCard from '../ShopCard.jsx'; // Assuming ShopCard is your component for displaying individual shops

const ShopFragmentCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="shop-fragment-card" onClick={() => navigate(`/product/${product._id}`)}>
            <div className="shop-fragment-card-top">
                <img className="shop-fragment-card-top-image" src={product.images[0]} />
            </div>
            <div className="shop-fragment-card-bottom">
                <div className="shop-fragment-card-shop-price">
                    <span className="shop-fragment-card-shop-name">
                        {/* {product.title.length > 45 ? `${product.title.substr(0, 30)}...` : product.title} */}
                    </span>
                    <span className="shop-fragment-card-shop">
                        {/* ₹{product.price} */}
                    </span>
                </div>
                <div className="shop-fragment-card-bottom-stock">
                    {1 > 0 ? (
                        <span>IN STOCK</span>
                    ) : (
                        <span>OUT OF STOCK</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ExploreNearbyShops = ({ pincodes }) => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredShops, setFilteredShops] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const pincodeQuery = '742136';
                const response = await fetch(`http://localhost:12000/api/v1/shop/shops?pincode=${pincodeQuery}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch shops');
                }

                const data = await response.json();
                console.log(data); // For debugging
                setShops(data.shops || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (1> 0) {
            fetchShops();
        }
    }, [pincodes]);

    useEffect(() => {
        setFilteredShops(shops); // You can implement further filtering logic here if needed
    }, [shops]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="shop-fragment-container" ref={containerRef}>
            {filteredShops.length > 0 ? (
                filteredShops.map((product) => (
                    <ShopFragmentCard key={`${product._id}-${product.title}`} product={product} />
                ))
            ) : (
                <p>No similar products found.</p>
            )}
        </div>
    );
};

export default ExploreNearbyShops;
