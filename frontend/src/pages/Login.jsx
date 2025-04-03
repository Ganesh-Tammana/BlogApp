import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  // State for storing email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for handling login errors
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

  // Redirect user if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/blogs"); // Redirect to blogs if token exists
    }
  }, [navigate]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password
      });

      // Store token and user ID in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);

      // Dispatch storage event to update other components
      window.dispatchEvent(new Event("storage"));

      // Show success message and redirect to blogs page
      alert(response.data.message);
      navigate("/blogs");
      
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed. Please try again.");
    }
  };

  return (
    <div className='container mx-auto p-6'>
        {/* Page Title */}
        <h2 className='text-3xl font-bold text-center mb-6'>Login</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className='max-w-xs mx-auto'>
            {/* Email Input */}
            <div className='mb-4'>
                <label className='block text-gray-700'>Email</label>
                <input 
                    type='email'
                    className='w-full p-2 border rounded focus:outline-none focus:ring-0'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            {/* Password Input */}
            <div className='mb-4'>
                <label className='block text-gray-700'>Password</label>
                <input 
                    type='password'
                    className='w-full p-2 border rounded focus:outline-none focus:ring-0'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {/* Display Error Message */}
            {error && <div className='text-red-500 mb-4'>{error}</div>}

            {/* Login Button */}
            <button type="submit" className="w-full p-2 bg-orange-500 hover:bg-orange-600 text-white rounded">
                Login
            </button>

            {/* Signup Redirect */}
            <p className='mt-4 text-center'>
              New here? Create an account! <Link to='/signup' className='text-gray-700 font-semibold underline'>Sign up</Link>
            </p>
        </form>
    </div>
  );
};

export default Login;
