import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

const isManager = asyncHandler((req, res, next) => {
    try {
        if (req.user.role !== 'MANAGER') {
            throw new ApiError(403, "Manager access required");
        }
        next();
    } catch (error) {
        console.log("Error while checking role of user ", error)
        throw new ApiError(503, "Internel Server error", error);

    }
});

const isDeveloper = asyncHandler((req, res, next) => {
    try {
       if (req.user.role !== 'DEVELOPER') {
            throw new ApiError(403, "Developer access required");
        }
        next();
    } catch (error) {
        console.log("Error while checking role of user ", error)
        throw new ApiError(503, "Internel Server error", error);

    }
});
  
export {isDeveloper, isManager}
