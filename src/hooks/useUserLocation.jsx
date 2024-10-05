import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const useUserLocation = () => {
  const [address, setAddress] = useState({ city: "Enter", postcode: "Pincode" });
  const [userPincodes, setUserPincodes] = useState([]);

  useEffect(() => {
    const savedAddress = document.cookie.split('; ').find(row => row.startsWith('address='));

    if (savedAddress) {
      const data = JSON.parse(decodeURIComponent(savedAddress.split('=')[1]));
      const locationPincode = data.postcode || 'Add Pincode';
      const locationCity = data.city || data.town || data.village || data.state_district || data.state || 'Unknown City';
      setAddress({ city: locationCity, postcode: locationPincode });

      // Set user pincodes from cookies
      const savedPincodes = document.cookie.split('; ').find(row => row.startsWith('userpincodes='));
      if (savedPincodes) {
        const pincodesData = JSON.parse(decodeURIComponent(savedPincodes.split('=')[1]));
        setUserPincodes(pincodesData);
      }
    } else {
      fetchLocation();
    }
  }, []);

  const fetchLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const locationPincode = data.address.postcode || 'Add Pincode';
      const locationCity = data.address.city || data.address.town || data.address.village || data.address.state_district || data.address.state || 'Unknown City';

      // Validate pincode to ensure it's a number
      if (!isNaN(locationPincode)) {
        setAddress({ city: locationCity, postcode: locationPincode });

        // Set user pincodes based on fetched location
        const userPincodes = [{ pincode: locationPincode, selected: true }];
        setUserPincodes(userPincodes);

        // Set cookies for address and user pincodes
        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + (60 * 60 * 1000)); // 1 hour expiry
        const expires = `expires=${expirationTime.toUTCString()}`;
        document.cookie = `address=${encodeURIComponent(JSON.stringify(data.address))}; ${expires}; path=/`;
        document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(userPincodes))}; ${expires}; path=/`;

        // Show success toast with autoClose and onClick properties
        toast.success(`Location updated to ${locationCity} (${locationPincode})!`, {
          autoClose: 1500, // Close after 1.5 seconds
          onClick: () => toast.dismiss() // Dismiss on click
        });
      } 
    } catch (error) {
      toast.error(`Failed to fetch location: ${error.message}`, {
        autoClose: 1500,
        onClick: () => toast.dismiss() // Dismiss on click
      });
    }
  };

  return { address, userPincodes, setUserPincodes, fetchLocation };
};
