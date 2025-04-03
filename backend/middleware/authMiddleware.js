import jwt from 'jsonwebtoken';
import User from '../model/User.js';


export const protectRoute = async (req, res, next) =>{
    try{

        const token = req.header('Authorization')?.split(' ')[1];
        

        if(!token){
            return res.status(401).json({ message: 'No token, authorization denied' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select('-password');

        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;

        console.log(req.user)
        next();
    }catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }

}