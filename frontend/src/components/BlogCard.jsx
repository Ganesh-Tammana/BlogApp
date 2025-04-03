import React from 'react';
import { Link } from 'react-router-dom';

// BlogCard Component: Displays individual blog details
const BlogCard = ({ blog }) => {
  return (
    <div className='p-5 border rounded-lg shadow-lg hover:shadow-xl transition duration-300 bg-white'>
      
      {/* Blog Title */}
      <h3 className='text-lg font-bold'>{blog.title}</h3>

      {/* Blog Content (limited to 3 lines using line-clamp) */}
      <p className="text-gray-600 mb-4 line-clamp-3 break-words flex-grow">
        {blog.content}
      </p>
      
      {/* Link to open full blog details */}
      <Link to={`/blogs/${blog._id}`} className='text-indigo-500 font-medium'>
        Open Blog
      </Link>

    </div>
  );
};

export default BlogCard;
