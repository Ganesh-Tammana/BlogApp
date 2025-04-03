import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import BlogRoutes from './routes/BlogRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// Middleware setup
app.use(cors(
    {
        origin: FRONTEND_URL,
        credentials: true // Allow cookies & auth headers if needed
    }
)); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests

// Routes setup
app.use('/api/blogs', BlogRoutes); // Route for handling blog-related operations
app.use('/api/auth', userRoutes); // Route for handling user authentication

// Database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected")) // Success message on successful connection
.catch(err => console.error('MongoDB connection failed', err)); // Error handling for connection failure

const PORT = process.env.PORT || 5000; // Set default port if not defined in environment variables


app.listen(PORT, ()=> console.log("Server running"))

app.get("/", (req, res) => {
    console.log("njaj")
    res.send("Backend is running on Vercel! 🚀");
});

export default app;