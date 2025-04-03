import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const Home = () => {
    // State to store blogs
    const [blogs, setBlogs] = useState([]);
    // State to track loading state
    const [loading, setLoading] = useState(true);
    // State to handle errors
    const [error, setError] = useState(null);
    // State to store total number of pages
    const [totalPages, setTotalPages] = useState(0);
    // State to track the current page
    const [currentPage, setCurrentPage] = useState(1);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
    const navigate = useNavigate();

    // Fetch blogs when the component mounts or when the current page changes
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // API request to fetch blogs with pagination
                const res = await axios.get(`${BASE_URL}/api/blogs?page=${currentPage}&limit=6`);
                setBlogs(res.data.blogs); // Store fetched blogs
                setTotalPages(res.data.totalPages || 0); // Store total pages
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load blogs'); // Handle errors
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchBlogs();
    }, [currentPage]);

    // Show loading state while fetching data
    if (loading) return <div>Loading blogs...</div>;

    // Show error message if fetching fails
    if (error) return <div>{error}</div>;

    // Function to handle page change in pagination
    const handlePageChange = (page) => {
        if (page < 1) return; // Prevent negative page numbers
        if (totalPages > 0 && page > totalPages) return; // Prevent exceeding total pages
        setCurrentPage(page); // Update current page
    };

    return (
        <div className='container mx-auto p-6'>
            {/* Page Title */}
            <h1 className='text-3xl font-bold text-center mb-6'>Welcome to My Blog Hub</h1>

            {/* Create Blog Button */}
            <div className='flex justify-end mb-4'>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    onClick={()=> navigate('/login')} // Navigate to login page
                >
                    <AiOutlinePlusCircle size={24} />
                    Create Blog
                </button>
            </div>
           
            {/* Display Blog Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <BlogCard key={blog?._id} blog={blog} /> // Render each blog card
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                {/* Previous Page Button */}
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1} // Disable if on the first page
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-400 disabled:pointer-events-none"
                >
                    Prev
                </button>

                {/* Current Page Indicator */}
                <span className="px-4 py-2 text-xl">
                    Page {currentPage} of {totalPages}
                </span>

                {/* Next Page Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0} // Disable if on the last page
                    className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-400 disabled:pointer-events-none"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
