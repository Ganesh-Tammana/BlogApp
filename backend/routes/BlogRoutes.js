import express from 'express';
import Blog from '../model/blog.js';
import { protectRoute } from '../middleware/authMiddleware.js'; // Middleware to protect routes with JWT authentication

const router = express.Router();

// Create a new blog (Protected Route)
router.post('/', protectRoute, async (req, res) => {
  const { title, content } = req.body;

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    // Create a new blog post with the logged-in user's ID as author
    const newBlog = new Blog({
      title,
      content,
      author: req.user._id, 
    });

    const savedBlog = await newBlog.save(); // Save the blog to the database
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating blog post' });
  }
});

// Get all blogs with pagination
router.get('/', async (req, res) => {
  try {
    // Retrieve pagination parameters from the query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch blogs sorted by newest first, with pagination
    const blogs = await Blog.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalBlogs = await Blog.countDocuments();

    //sending data to the frontend
    res.json({
      blogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching blogs' });
  }
});

// Get blogs by a specific user with pagination
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch blogs by a specific user
    const blogs = await Blog.find({ author: userId }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalBlogs = await Blog.countDocuments({ author: userId });

    res.json({
      blogs,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load blogs' });
  }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching blog' });
  }
});

// Update a blog (Protected Route)
router.put('/:id', protectRoute, async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Ensure only the owner of the blog can update it
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update only the fields that are provided
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    const updatedBlog = await blog.save();

    res.json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating blog' });
  }
});

// Delete a blog (Protected Route)
router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Ensure only the owner can delete their blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await blog.deleteOne(); // Delete the blog from the database
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting blog' });
  }
});

export default router;