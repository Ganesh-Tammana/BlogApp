import mongoose from 'mongoose';

// Define the schema for the Blog model
const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true // Title is mandatory
  },
  content: { 
    type: String, 
    required: true // Content is mandatory
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, // References the User model
    ref: 'User', 
    required: true // Every blog must have an author
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

// Create the Blog model from the schema
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
