import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";

const BlogCreation = () => {
    // State variables for handling form inputs and UI feedback
    const [title, setTitle] = useState(''); // Stores blog title input
    const [content, setContent] = useState(''); // Stores blog content input
    const [error, setError] = useState(''); // Stores error messages
    const [loading, setLoading] = useState(false); // Handles loading state during form submission

    // Hook for navigating between routes
    const navigate = useNavigate();

    // Function to handle blog submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validate that both title and content fields are not empty
        if (!title.trim() || !content.trim()) {
            setError('Both title and content are required.');
            return;
        }

        try {
            setLoading(true); // Start loading state
            const token = localStorage.getItem('token'); // Retrieve authentication token
            
            // Send a POST request to the backend API to create a new blog
            const response = await axios.post('http://localhost:5000/api/blogs/',
                { title, content }, // Sending blog data
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include authentication token in request headers
                    }
                }
            );
            
            // Redirect user to the newly created blog's details page
            navigate(`/blogs/${response.data._id}`);
        } catch (err) {
            // Handle errors and set error message
            setError(err.response?.data?.message || 'Error creating blog post. Please try again later.');
        } finally {
            setLoading(false); // Stop loading state
        }
    };
  
    return (
        <div className='container mx-auto p-6'>
            {/* Header Section with Back Button */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/blogs')} // Navigate back to blog list page
                    className="flex items-center text-blue-950 px-2 py-1 rounded-xl flex-1 md:flex-none"
                >
                    <FaArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
                    Create a New Blog
                </h1>
                <div className="flex-1 md:hidden"></div>
            </div>

            {/* Display error message if any */}
            {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

            {/* Blog Creation Form */}
            <form onSubmit={handleSubmit} className='max-w-xl mx-auto bg-white p-6 border rounded-lg shadow-md'>
                {/* Blog Title Input Field */}
                <div className='mb-4'>
                    <label htmlFor="title" className='block text-sm font-semibold text-gray-700'> Blog Title </label>
                    <input 
                        type='text'
                        value={title}
                        id='title'
                        onChange={(e) => { 
                            setTitle(e.target.value); // Update title state
                            if (error) setError(''); // Clear error message on input change
                        }}
                        placeholder="Enter blog title"             
                        className='w-full mt-2 p-3 border rounded-md focus:outline-none focus:ring-0'
                    />
                </div>

                {/* Blog Content Input Field */}
                <div className='mb-4'>
                    <label htmlFor="content" className='block text-sm font-semibold text-gray-700'>  Blog Content </label>
                    <textarea
                        id='content'
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value); // Update content state
                            if (error) setError(''); // Clear error message on input change
                        }}
                        className='w-full mt-2 p-3 border rounded-md focus:outline-none focus:ring-0' 
                        placeholder="Write your blog content here..."
                        rows="10"
                    />
                </div>

                {/* Submit Button */}
                <div className='text-center'>
                    <button
                        type='submit'
                        disabled={loading} // Disable button when loading
                        className='bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400'
                    >
                        {loading ? 'Creating..' : 'Create Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogCreation;
