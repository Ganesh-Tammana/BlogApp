import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  // State variables for form inputs and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect to home if the user is already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    // Password length validation
    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Password alphanumeric validation (must contain letters and numbers)
    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    if (!alphanumericRegex.test(trimmedPassword)) {
      setError("Password must contain both letters and numbers.");
      return;
    }

    // Passwords match validation
    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send signup request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email: trimmedEmail,
        password: trimmedPassword
      });

      alert(response.data.message); // Show success message
      navigate("/login"); // Redirect to login page
    } catch (err) {
      // Handle error response from the backend
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className='container mx-auto p-6'>
        <h2 className='text-3xl font-bold text-center mb-6'>Sign Up</h2>

        <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
            {/* Email Input Field */}
            <div className='mb-4'>
                <label className='block text-gray-700'>Email</label>
                <input 
                    type='email'
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                />
            </div>

            {/* Password Input Field */}
            <div className='mb-4'>
                <label className='block text-gray-700'>Password</label>
                <input 
                    type='password'
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    required
                />
            </div>

            {/* Confirm Password Input Field */}
            <div className='mb-4'>
                <label className='block text-gray-700'>Confirm Password</label>
                <input 
                    type='password'
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.trim())}
                    required
                />
            </div>

            {/* Display Error Message */}
            {error && <div className='text-red-500 mb-4'>{error}</div> }

            {/* Signup Button */}
            <button type="submit" className="w-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
                Sign Up
            </button>

            {/* Redirect to Login Page */}
            <p className="text-center mt-4 text-gray-700">
                Already have an account? 
                <Link to="/login" className="text-gray-700 font-semibold underline ml-1">
                    Login
                </Link>
            </p>
        </form>
    </div>
  );
};

export default SignUp;
