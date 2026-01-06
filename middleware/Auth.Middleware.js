import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const authenticationMiddleware = asyncHandler((req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
         
        if (!authHeader) {
            throw new ApiError(401, 'No token provided')
        }
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        console.log("Error while authenticating user", error)
        throw new ApiError(503, "Internel Server error", error);
    }
})

export default authenticationMiddleware;



