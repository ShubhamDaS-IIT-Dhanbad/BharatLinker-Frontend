import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBackLine } from "react-icons/ri";
import { toast, ToastContainer } from 'react-toastify';
import { useUserPincode } from '../hooks/useUserPincode.jsx';
import locationi1 from '../assets/turnonlocation.png';
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
    const {
        userPincodes, 
        inputValue, 
        handleInputChange, 
        handleAddPincode, 
        togglePincodeSelection, 
        handleDeletePincode 
    } = useUserPincode();

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
                        type='number'
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
                    <div style={{height:"70vh",display:"flex",justifyContent:"center"
                        ,alignItems:"center"
                    }}>
                        <img src={locationi1}/>
                    </div>
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
