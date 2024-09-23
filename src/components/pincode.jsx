import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import { RiDeleteBackLine } from "react-icons/ri";

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
    const [address, setAddress] = useState(null);
    const [userPincodes, setUserPincodes] = useState([]);

    // Fetch cookies on initial load
    useEffect(() => {
        const getCookieValue = (name) => {
            const value = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
            return value ? decodeURIComponent(value.split('=')[1]) : null;
        };

        // Get the address from the 'address' cookie
        const addressCookie = getCookieValue('address');
        if (addressCookie) {
            try {
                const addressData = JSON.parse(addressCookie);
                setAddress(addressData);
            } catch (error) {
                console.error("Error parsing address cookie", error);
            }
        }

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
        if (inputValue.trim() !== '' && !userPincodes.some(pincode => pincode.pincode === inputValue)) {
            const newPincode = { pincode: inputValue, selected: true };
            setUserPincodes(prevPincodes => {
                const updatedPincodes = [...prevPincodes, newPincode];
                const expires = new Date();
                expires.setTime(expires.getTime() + 15 * 60 * 1000);
                document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(updatedPincodes))}; expires=${expires.toUTCString()}; path=/`;
                return updatedPincodes;
            });
            setInputValue(''); // Clear input after adding
        }
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
            return updatedPincodes;
        });
    };

    return (
        <div>
            <div id='pincode-you-location'>
                <MdOutlineKeyboardArrowLeft size={'27px'} onClick={() => { navigate('/') }} />
                YOUR LOCATION
            </div>

            <div id="pincode-search-container-top">
                <div id='pincode-search-container-top-div'>
                    <input
                        id="pincode-search-bar"
                        placeholder="Enter Pincode"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <IoMdAdd size={35}

                        onClick={handleAddPincode} />
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
        </div>
    );
};

export default Pincode;
