import { useState } from 'react';
import { toast } from 'react-toastify';
import { reupdateProduct, reupdateShop,reupdateRefurbish } from '../redux/features/pincodeUpdatedSlice';
import { useDispatch } from 'react-redux';

export const useUserPincode = () => {
  const dispatch = useDispatch();

  const getPincodesFromCookie = () => {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('userpincodes='));
    if (cookieValue) {
      const pincodes = decodeURIComponent(cookieValue.split('=')[1]);
      return JSON.parse(pincodes);
    }
    return [];
  };

  const [userPincodes, setUserPincodes] = useState(getPincodesFromCookie());
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value.length <= 6) {
      setInputValue(value);
    }
  };

  const handleAddPincode = () => {
    if (inputValue.trim() === '') {
      toast.error("Pincode cannot be empty!");
      return;
    }

    if (userPincodes.some(pincode => pincode.pincode === inputValue)) {
      toast.error(`Pincode ${inputValue} already exists!`);
      return;
    }

    const newPincode = { pincode: inputValue, selected: true };

    setUserPincodes(prevPincodes => {
      const updatedPincodes = [...prevPincodes, newPincode];
      updateCookies(updatedPincodes);
      return updatedPincodes;
    });

    toast.success(`Pincode ${inputValue} added successfully!`);
  };

  const togglePincodeSelection = (pincode) => {
    setUserPincodes(prevPincodes => {
      const updatedPincodes = prevPincodes.map(pin =>
        pin.pincode === pincode ? { ...pin, selected: !pin.selected } : pin
      );

      updateCookies(updatedPincodes);
      return updatedPincodes;
    });
  };

  const handleDeletePincode = (pincode) => {
    setUserPincodes(prevPincodes => {
      const updatedPincodes = prevPincodes.filter(pin => pin.pincode !== pincode);
      updateCookies(updatedPincodes);
      toast.success(`Pincode ${pincode} deleted successfully!`);

      return updatedPincodes;
    });
  };

  const updateCookies = (pincodes) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 1000); // 1 hour expiration
    dispatch(reupdateProduct());
    dispatch(reupdateShop());
    dispatch(reupdateRefurbish());
    document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(pincodes))}; expires=${expires.toUTCString()}; path=/`;
  };

  return {
    userPincodes,
    inputValue,
    handleInputChange,
    handleAddPincode,
    togglePincodeSelection,
    handleDeletePincode,
  };
};
