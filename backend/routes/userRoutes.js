import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const router = express.Router();

// User Signup Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Convert email to lowercase to ensure uniqueness
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        console.log("Creating new user...");
        
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({
            email: email.toLowerCase(), // Store emails in lowercase
            password: hashedPassword,
        });

        await newUser.save();

        // Return user details (excluding password)
        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: newUser._id,
            email: newUser.email
        });

    } catch (err) {
        console.error("Error in signup:", err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare entered password with hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Ensure JWT secret is defined
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server error: Missing JWT secret" });
        }

        // Generate JWT token (valid for 1 hour)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and user ID
        res.status(200).json({ 
            token, 
            userId: user._id, 
            email: user.email, 
            message: 'User Login Successfully' 
        });

    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

export default router;
