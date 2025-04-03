import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, // Email is mandatory
      unique: true // Ensures no duplicate email exists
    },
    password: { 
      type: String, 
      required: true // Password is mandatory
    }
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

// Create and export the User model
export default mongoose.model('User', userSchema);
