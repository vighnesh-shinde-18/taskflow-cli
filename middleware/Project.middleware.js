import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

import db from '../db/index.js'

const ownsProject = asyncHandler(async (req, res, next) => {
    try {

        const projectId = req.params.projectId || req.body.projectId;
        const managerId = req.user.id;

        const [rows] = await db.execute(
            'SELECT id FROM projects WHERE id = ? AND manager_id = ?',
            [projectId, managerId]
        );

        if (!rows.length) {
            throw new ApiError(403,'Not project owner') 
        }

        next();
    } catch (error) {
        console.log("Error while checking project ownership ", error)
        throw new ApiError(503, "Internel Server error", error);
    }
});



export default ownsProject;