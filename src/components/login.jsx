import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from '../firebase/firebase.js';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/features/userSlice.jsx';
import '../styles/login.css'; // Importing the CSS file for styling

import l1 from '../assets/bharatlinkerlogin.png';
import g1 from '../assets/googlepng.png';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;

            // Store user information in cookie
            Cookies.set('BharatLinkerUser', JSON.stringify({
                displayName: user.displayName,
                email: user.email,
                uid: user.uid
            }), { expires: 7 }); // Cookie expires in 7 days

            // Dispatch the setUserData action to update the Redux store
            dispatch(setUserData({
                displayName: user.displayName,
                email: user.email,
                uid: user.uid
            }));

            // Redirect to the dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error("Error during Google login", error);
        }
    };

    return (
        <div className="login-container">
            <img src={l1} className='login-container-img' />
            <div className="login-container-desc">
                UNITING COMMUNITIES, IGNITING OPPORTUNITIES
                <div className="login-container-google-login-button" onClick={handleGoogleLogin}>
                    <img src={g1} />
                    LOG IN WITH GOOGLE
                </div>
            </div>

        </div>
    );
}
export default Login;
