import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes
import RetailerLogin from './retailerLogin.jsx'; // Ensure this path is correct
import RetailerSignup from './retailerSignup.jsx'; // Ensure this path is correct
import ProtectedRoute from '../components/protectedRouteRetailer.jsx'; // Adjust if necessary
import RetailerHome from './retailerHome.jsx'; // Ensure this path is correct
import RetailerShop from './retailerShopPage.jsx'; // Ensure this path is correct
import RetailerProduct from './retailerProductPage.jsx'; // Ensure this path is correct
import UploadProduct from './retailerUploadProduct.jsx'; // Ensure this path is correct
import UpdateProduct from './retailerUpdateProduct.jsx'; // Ensure this path is correct

const RetailerRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/retailer/login" element={<RetailerLogin />} />
      <Route path="/retailer/signup" element={<RetailerSignup />} />
      
      {/* Protected Routes */}
      <Route path="/retailer/home" element={<ProtectedRoute element={<RetailerHome />} />} />
      <Route path="/retailer/shop" element={<ProtectedRoute element={<RetailerShop />} />} />
      {/* <ProtectedRoute path="/retailer/data" element={<RetailerData />} /> */}
      <Route path="/retailer/product" element={<ProtectedRoute element={<RetailerProduct />} />} />
      <Route path="/retailer/uploadproduct" element={<ProtectedRoute element={<UploadProduct />} />} />
      <Route path="/retailer/updateproduct/:productId" element={<ProtectedRoute element={<UpdateProduct />} />} />
    </Routes>
  );
};

export default RetailerRoutes;
