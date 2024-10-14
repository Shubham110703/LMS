// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from '../config';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('trainer'); // 'trainer' or 'admin'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const endpoint = role === 'admin' ? 'http://localhost:4000/api/v1/auth/login/admin' : 'http://localhost:4000/api/v1/auth/login/trainer';
            const response = await axios.post(endpoint, { email, password },{
                withCredentials: true
              });
            console.log(response.data);
            toast.success("Logged in successfully!");
            onLogin(role , response.data.id); // Pass the role to the App component
            navigate(`/${role}`); // Redirect based on role
        } catch (error) {
            setError('Login failed: ' + (error.response?.data?.message || 'Internal server error'));
            toast.error('Login failed: ' + (error.response?.data?.message || 'Internal server error'));
        }
    };

    return (
        <div className='h-full w-full relative bg-gray-200'>
            <div className='h-80 pb-8 w-1/4 absolute inset-0 left-1/3 top-60 border-2 bg-white shadow-lg rounded-lg p-8'>
                <h2 className='text-xl font-bold mb-4 text-center'>Login</h2>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded'
                            required
                        />
                    </div>
                    <select onChange={(e) => setRole(e.target.value)} className='mb-4 w-full p-2 border border-gray-300 rounded'>
                        <option value='trainer'>Trainer</option>
                        <option value='admin'>Admin</option>
                    </select>
                    <button
                        type='submit'
                        className='w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    >
                        Login
                    </button>
                </form>
                <div className='mt-2 mb-4 text-center'>
                    <p>
                        Don't have an account? <a href='/signup' className='text-blue-600'>Sign up</a>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginPage;
