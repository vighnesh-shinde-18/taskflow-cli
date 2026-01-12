import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

const isManager = asyncHandler((req, res, next) => {
    
        if (req.user.role !== 'MANAGER') {
            throw new ApiError(403, "Manager access required");
        }
        next(); 
});

const isDeveloper = asyncHandler((req, res, next) => {
       if (req.user.role !== 'DEVELOPER') {
            throw new ApiError(403, "Developer access required");
        }
        next();
   
});
  
export {isDeveloper, isManager}
