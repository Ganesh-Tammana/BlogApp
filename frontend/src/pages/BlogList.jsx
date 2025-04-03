import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]); // State to store blog list
    const [totalPages, setTotalPages] = useState(0); // State to track total pages
    const [currentPage, setCurrentPage] = useState(1); // State to track current page
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage
    const isLoggedIn = localStorage.getItem("token"); // Check if user is logged in

    // Redirect to login page if user is not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    // Fetch user blogs when component mounts or when currentPage changes
    useEffect(() => {
        if (!isLoggedIn) return; // Prevent API call if not logged in

        const fetchUserBlogs = async () => {
            try {
                // API request to get user's blogs with pagination
                const res = await axios.get(`http://localhost:5000/api/blogs/user/${userId}?page=${currentPage}&limit=6`);
                setBlogs(res.data.blogs); // Set blog data
                setTotalPages(res.data.totalPages || 0); // Set total pages
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load blogs'); // Handle error
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchUserBlogs();
    }, [currentPage, isLoggedIn, userId]);

    // Display loading state while fetching data
    if (loading) return <div className='text-center text-gray-500'>Loading blogs...</div>;

    // Display error message if fetching fails
    if (error) return <div className='text-center text-red-500'>{error}</div>;

    return (
        <div className='container p-6 mx-auto'>
            {/* Page title */}
            <h2 className="text-2xl font-bold text-center mb-4">My Blogs</h2>

            {/* Create Blog Button */}
            <div className='flex justify-end mb-4'>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    onClick={()=> navigate('/blogCreation')} // Navigate to blog creation page
                >
                    <AiOutlinePlusCircle size={24} />
                    Create Blog
                </button>
            </div>
            
            {/* Display message if no blogs are available */}
            {blogs.length === 0 ? 
                ( <div className='text-center text-gray-500'>No blogs available</div> ) :
                ( 
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} /> // Render blog cards
                        ))}
                    </div> 
                )
            }

            {/* Pagination controls */}
            { blogs.length > 0 && (
                <div className='flex justify-center mt-6'>
                    {/* Previous page button */}
                    <button 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1} // Disable if on first page
                        className='px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-400 disabled:pointer-events-none'
                    >
                        Prev
                    </button>

                    {/* Current page indicator */}
                    <span className="px-4 py-2 text-xl">
                        Page {currentPage} of {totalPages}
                    </span>

                    {/* Next page button */}
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0} // Disable if on last page
                        className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-400 disabled:pointer-events-none"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogList;
