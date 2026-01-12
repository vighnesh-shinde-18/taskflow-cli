import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const authenticationMiddleware = asyncHandler((req, res, next) => {

    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        throw new ApiError(401, 'No token provided')

    }

    const token = authHeader.split(' ')[1];


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

})

export default authenticationMiddleware;



