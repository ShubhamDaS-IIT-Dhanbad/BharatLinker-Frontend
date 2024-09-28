import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBackLine } from "react-icons/ri";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/pincode.css';

const PinCodeCard = ({ pincodeObj, togglePincodeSelection, handleDeletePincode }) => {
    return (
        <div className="pincode-item">
            <div
                onClick={() => togglePincodeSelection(pincodeObj.pincode)}
                className={pincodeObj.selected ? 'pincode-item-selected' : 'pincode-item-unselected'}>
            </div>
            <p className="pincode-item-pincode">{pincodeObj.pincode}</p>
            <RiDeleteBackLine
                size={25}
                className="pincode-item-pincode-delete"
                onClick={() => handleDeletePincode(pincodeObj.pincode)}
            />
        </div>
    );
};

const Pincode = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [userPincodes, setUserPincodes] = useState([]);

    useEffect(() => {
        const getCookieValue = (name) => {
            const value = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
            return value ? decodeURIComponent(value.split('=')[1]) : null;
        };

        const pincodesCookie = getCookieValue('userpincodes');
        if (pincodesCookie) {
            try {
                const pincodesData = JSON.parse(pincodesCookie);
                setUserPincodes(pincodesData);
            } catch (error) {
                console.error("Error parsing userpincodes cookie", error);
            }
        }
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleAddPincode = () => {
        if (inputValue.trim() === '') {
            toast.error("Pincode cannot be empty!"); // Show error if input is empty
            return;
        }

        if (userPincodes.some(pincode => pincode.pincode === inputValue)) {
            toast.error(`Pincode ${inputValue} already exists!`); // Show error if pincode exists
            return;
        }

        const newPincode = { pincode: inputValue, selected: true };

        setUserPincodes(prevPincodes => {
            const updatedPincodes = [...prevPincodes, newPincode];
            const expires = new Date();
            expires.setTime(expires.getTime() + 60 * 60 * 1000);
            document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(updatedPincodes))}; expires=${expires.toUTCString()}; path=/`;
            return updatedPincodes;
        });

        setInputValue(''); // Clear input after adding
        toast.success(`Pincode ${inputValue} added successfully!`); // Show success toast
    };

    const togglePincodeSelection = (pincode) => {
        setUserPincodes(prevPincodes => {
            const updatedPincodes = prevPincodes.map(pin =>
                pin.pincode === pincode ? { ...pin, selected: !pin.selected } : pin
            );
            const expires = new Date();
            expires.setTime(expires.getTime() + 15 * 60 * 1000);
            document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(updatedPincodes))}; expires=${expires.toUTCString()}; path=/`;
            return updatedPincodes;
        });
    };

    const handleDeletePincode = (pincode) => {
        setUserPincodes(prevPincodes => {
            const updatedPincodes = prevPincodes.filter(pin => pin.pincode !== pincode);
            const expires = new Date();
            expires.setTime(expires.getTime() + 15 * 60 * 1000);
            document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(updatedPincodes))}; expires=${expires.toUTCString()}; path=/`;
            toast.success(`Pincode ${pincode} deleted successfully!`); // Show success toast on deletion
            return updatedPincodes;
        });
    };

    return (
        <div>
            <div id='pincode-you-location'>
                <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { navigate('/') }} />
                ADD PINCODES
            </div>

            <div id="pincode-search-container-top">
                <div id='pincode-search-container-top-div'>
                    <input
                        id="pincode-search-bar-home"
                        placeholder="Add Pincode"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <IoMdAdd size={35} onClick={handleAddPincode} />
                </div>
            </div>

            <div id="pincode-list">
                {userPincodes.length > 0 ? (
                    userPincodes.map((pincodeObj, index) => (
                        <PinCodeCard
                            pincodeObj={pincodeObj}
                            key={index}
                            togglePincodeSelection={togglePincodeSelection}
                            handleDeletePincode={handleDeletePincode}
                        />
                    ))
                ) : (
                    <div>No pincodes available</div>
                )}
            </div>
            <ToastContainer
                position="bottom-center" // Set position to bottom-center
                autoClose={5000} // Auto close after 5 seconds
                hideProgressBar={false} // Show progress bar
                closeOnClick // Close on click
                draggable // Enable dragging
                pauseOnHover // Pause on hover
            /> 
        </div>
    );
};

export default Pincode;
