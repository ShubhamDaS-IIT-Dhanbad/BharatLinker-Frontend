import React from 'react';
import { Navigate } from 'react-router-dom';

// Helper function to get cookie value by name
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

const ProtectedRoute = ({ element }) => {
  const retailerCookie = getCookieValue('BharatLinkerRetailer');

  // If the cookie exists, return the element (allow access), otherwise redirect to login
  return retailerCookie ? element : <Navigate to="/retailer/login" />;
};

export default ProtectedRoute;
