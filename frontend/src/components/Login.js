import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading animation
import { ToggleContext } from '../context/ToggleContext';
import { toast } from 'react-toastify';
import { baseurl } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [name, setName] = useState("");
    const { isToggled } = useContext(ToggleContext);
    const [password, setPassword] = useState(""); 
    const [issignupform, setIssignupform] = useState(false);
    const [email, setEmail] = useState("");
    const [showpassword, setShowpassword] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        setIssignupform(isToggled);
    }, [isToggled]);

    const handlesubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        // Validate inputs
        if (issignupform && !name) {
            toast.error('Name field cannot be empty');
            setLoading(false); // Stop loading
            return;
        }
        if (!email) {
            toast.error('Email field cannot be empty');
            setLoading(false); // Stop loading
            return;
        }
        const validemail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        if (!validemail) {
            toast.error('Email should be in a valid format');
            setLoading(false); // Stop loading
            return;
        }
        if (!password) {
            toast.error('Password field cannot be empty');
            setLoading(false); // Stop loading
            return;
        }

        // Register or login based on form type
        try {
            const endpoint = issignupform ? '/api/auth/signup' : '/api/auth/login';
            const res = await fetch(`${baseurl}${endpoint}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: issignupform ? name : undefined,
                    email,
                    password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success(issignupform ? 'Account created successfully' : 'Login successful');
                navigate('/dashboard');
            } else {
                toast.error(data.message || 'An error occurred. Please try again.');
            }
        } catch (e) {
            toast.error(`An unexpected error occurred: ${e.message}`);
        } finally {
            setLoading(false); // Stop loading after request is complete
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mt-16'>
            <div className='bg-white p-8 rounded-lg shadow-md w-80'>
                <span className='font-bold text-3xl mb-8 text-center block'>
                    {issignupform ? 'Sign Up' : 'Login'}
                </span>

                <div className="space-y-6">
                    {issignupform && (
                        <TextField
                            label="User Name"
                            variant="outlined"
                            fullWidth
                            className='transition-all duration-300 focus:shadow-lg outline-none'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    )}
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        className='transition-all duration-300 focus:shadow-lg outline-none'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />

                    <TextField
                        label="Password"
                        type={!showpassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        className='transition-all duration-300 focus:shadow-lg'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    {showpassword ? (
                        <VisibilityOffIcon
                            className={issignupform ? 'absolute cursor-pointer ml-[-30px] top-[397px]' : 'absolute cursor-pointer ml-[-30px] top-[318px]'}
                            onClick={() => setShowpassword(prev => !prev)}
                        />
                    ) : (
                        <VisibilityIcon
                            className={issignupform ? 'absolute cursor-pointer ml-[-30px] top-[397px]' : 'absolute cursor-pointer ml-[-30px] top-[318px]'}
                            onClick={() => setShowpassword(prev => !prev)}
                        />
                    )}

                    <div className='text-end cursor-pointer'>
                        <span
                            className='text-blue-500'
                            onClick={() => setIssignupform(prev => !prev)}
                        >
                            {issignupform ? 'Already have an account?' : 'Don\'t have an account?'}
                        </span>
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        className='transition-transform transform duration-300 relative'
                        onClick={handlesubmit}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" /> // Show spinner while loading
                        ) : (
                            issignupform ? 'Sign Up' : 'Login'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
