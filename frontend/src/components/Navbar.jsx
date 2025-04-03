import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    // State to track authentication status based on the presence of a token
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // State to handle mobile menu toggle
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    // Effect to update authentication state when the localStorage changes
    useEffect(() => {
        const updateAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
        window.addEventListener("storage", updateAuth);

        return () => window.removeEventListener("storage", updateAuth);
    }, []);

    // Logout function: removes token, updates auth state, redirects to home, and closes menu
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
        setOpen(false); // Close the menu on logout
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                
                {/* Logo / Brand */}
                <h1 className="text-xl font-bold">
                    <Link to="/">BlogApp</Link>
                </h1>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="lg:hidden text-2xl focus:outline-none"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes /> : <FaBars />}
                </button>

                {/* Navigation Menu */}
                <div
                    className={`absolute top-16 right-4 bg-gray-800 shadow-md rounded-lg lg:static lg:flex lg:bg-transparent lg:shadow-none lg:rounded-none w-48 lg:w-auto transition-all duration-300 ease-in-out ${
                        open ? "block" : "hidden"
                    }`}
                >
                    <ul className="flex flex-col lg:flex-row lg:space-x-4 p-4 lg:p-0">
                        
                        {/* If authenticated, show Logout button */}
                        {isAuthenticated ? (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 w-full text-left"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <>
                                {/* Public Links */}
                                <li>
                                    <Link
                                        to="/"
                                        className="block text-center"
                                        onClick={() => setOpen(false)}
                                    >
                                        Blogs
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/login"
                                        className="block text-center"
                                        onClick={() => setOpen(false)}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className=" bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded block text-center"
                                        onClick={() => setOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
