import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BlogEdit = () => {
    const { id } = useParams(); // Extract blog ID from URL parameters
    const [originalBlog, setOriginalBlog] = useState(null); // Store original blog details for comparison
    const navigate = useNavigate(); // Hook for navigation
    const [blog, setBlog] = useState({ title: '', content: '' }); // State for editable blog fields
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(""); // State to handle errors

    // Fetch the blog details when component mounts
    useEffect(() => {
        axios.get(`http://localhost:5000/api/blogs/${id}`)
            .then((res) => {
                setBlog(res.data); // Set blog details to state
                setOriginalBlog(res.data); // Store original details for change detection
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching blog:", err);
                setError("Failed to fetch blog details.");
                setLoading(false);
            });
    }, [id]);

    // Handle input field changes
    const handleChange = (e) => {
        setBlog({ ...blog, [e.target.name]: e.target.value });
    };

    // Check if the blog content has been modified
    const isModified = originalBlog && 
        (blog.title !== originalBlog.title || blog.content !== originalBlog.content);

    // Handle form submission (update blog)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isModified) return; // Prevent submission if no changes made
        try {
             await axios.put(`http://localhost:5000/api/blogs/${id}`, 
                { title: blog.title, content: blog.content }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Send auth token
                    "Content-Type": "application/json",
                },
            });
            alert("Blog updated successfully!");
            navigate(`/blogs/${id}`); // Redirect to the updated blog
        } catch (err) {
            console.log("Error updating blog:", err);
            setError("Failed to update blog.");
        }
    };

    // Display loading message while fetching data
    if (loading) return <p className="text-center text-gray-500">Loading blog...</p>;
    
    // Display error message if fetching fails
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6 max-w-xl bg-white shadow-md rounded-lg">

            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/blogs')} // Navigate back to blog list
                    className="flex items-center text-blue-950 px-2 py-1 rounded-xl flex-1 md:flex-none"
                >
                    <FaArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
                    Edit Blog
                </h1>
                <div className="flex-1 md:hidden"></div>
            </div>

            {/* Blog edit form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title input */}
                <input
                    type="text"
                    name="title"
                    value={blog.title}
                    onChange={handleChange}
                    placeholder="Blog Title"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-0"
                    required
                />

                {/* Content textarea */}
                <textarea
                    name="content"
                    value={blog.content}
                    onChange={handleChange}
                    placeholder="Blog Content"
                    className="w-full p-2 border rounded h-40 focus:outline-none focus:ring-0"
                    required
                />

                {/* Error message if update fails */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Submit button (disabled if no changes detected) */}
                <button 
                    type="submit" 
                    className={`px-4 py-2 rounded text-white ${
                        isModified ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isModified} // Disable button if no changes
                >
                    Update Blog
                </button>

            </form>
        </div>
    );
};

export default BlogEdit;
