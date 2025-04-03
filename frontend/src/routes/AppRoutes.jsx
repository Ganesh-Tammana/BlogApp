// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import Home from '../pages/Home';
// import Login from '../pages/Login';
// import SignUp from '../pages/SignUp';
// import BlogList from '../pages/BlogList';
// import BlogDetails from '../pages/BlogDetails';
// import Navbar from '../components/Navbar'
// import BlogCreation from '../pages/BlogCreation';
// import BlogEdit from '../pages/BlogEdit';

// const AppRoutes = ()=>{
//     return(
//         <Router>
//             <Navbar/>
//             <Routes>
//                 <Route path='/' element={<Home/>}/>
//                 <Route path='/login' element={<Login/>}/>
//                 <Route path='/signup' element={<SignUp/>}/>
//                 <Route path='/edit-blog/:id' element={<BlogEdit />} />
//                 <Route path='/blogCreation' element={<BlogCreation/>}/>
//                 <Route path='/blogs' element={<BlogList/>}/>
//                 <Route path='/blogs/:id' element={<BlogDetails/>}/>
//             </Routes>
//         </Router>
//     )
// }

// export default AppRoutes

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import BlogList from '../pages/BlogList';
import BlogDetails from '../pages/BlogDetails';
import Navbar from '../components/Navbar';
import BlogCreation from '../pages/BlogCreation';
import BlogEdit from '../pages/BlogEdit';

// Defines application routes using React Router
const AppRoutes = () => {
    return (
        <Router>
            {/* Navbar component is included to be displayed on all pages */}
            <Navbar />
            <Routes>
                {/* Home page route */}
                <Route path='/' element={<Home />} />
                
                {/* Authentication routes for login and signup */}
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                
                {/* Blog-related routes */}
                {/* Route for listing all blogs */}
                <Route path='/blogs' element={<BlogList />} />
                
                {/* Route for viewing a specific blog post by ID */}
                <Route path='/blogs/:id' element={<BlogDetails />} />
                
                {/* Route for creating a new blog (accessible only to logged-in users) */}
                <Route path='/blogCreation' element={<BlogCreation />} />
                
                {/* Route for editing an existing blog post by ID */}
                <Route path='/edit-blog/:id' element={<BlogEdit />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
