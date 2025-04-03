import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const BlogDetails = () => {
  const { id } = useParams(); // Extract blog ID from URL parameters
  const [blog, setBlog] = useState(null); // State to store blog details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to store any errors
  const navigate = useNavigate(); // Hook for navigation
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Fetch blog data from API using the blog ID
        const response = await axios.get(`${BASE_URL}/api/blogs/${id}`);
        setBlog(response.data); // Store fetched blog details in state
      } catch (err) {
        setError('Error fetching blog data'); // Set error message if request fails
      } finally {
        setLoading(false); // Set loading to false after request completion
      }
    };

    fetchBlog();
  }, [id]); // Re-run effect if blog ID changes

  // Function to handle blog deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return; // Confirmation prompt before deletion

    try {
      const token = localStorage.getItem("token"); // Retrieve authentication token
      if (!token) {
        alert("Unauthorized. Please log in first."); // Alert if no token is found
        return;
      }
      // Send DELETE request to API
      await axios.delete(`${BASE_URL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Send authentication token
        }
      });

      alert("Blog deleted successfully"); // Show success message
      navigate('/blogs'); // Redirect to blogs list after deletion
    } catch (err) {
      alert("Failed to delete blog. Try again."); // Show error message if deletion fails
    }
  };

  // Display loading message while fetching data
  if (loading) {
    return <div className="text-center text-lg font-semibold mt-4">Loading...</div>;
  }

  // Display error message if fetching fails
  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 flex justify-center">
      
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6 border border-gray-200">
        
        {/* Blog title */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800 break-words">{blog.title}</h1>
        
        {/* Blog content */}
        <p className="text-gray-700 mb-4 break-words overflow-auto">{blog.content}</p>

        {/* Action buttons */}
        <div className="mt-4 flex gap-4">
          <button 
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Blog
          </button>

          <button 
            onClick={() => navigate(`/edit-blog/${id}`)} // Navigate to blog editing page
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Blog
          </button>

          <button 
            onClick={() => navigate('/blogs')} // Navigate back to blogs list
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
