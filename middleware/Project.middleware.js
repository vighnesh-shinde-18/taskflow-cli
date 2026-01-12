import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

import db from '../db/index.js'

const ownsProject = asyncHandler(async (req, res, next) => {
    
        const projectId = req.params.projectId || req.body.projectId;
        const managerId = req.user.id;

         const [rows1] = await db.execute(
            'SELECT * FROM projects WHERE id = ?',
            [projectId]
        );
        if (!rows1.length) {
            throw new ApiError(403,'Project with given id not exist') 
        }



        const [rows2] = await db.execute(
            'SELECT id FROM projects WHERE id = ? AND manager_id = ?',
            [projectId, managerId]
        );

        if (!rows2.length) {
            throw new ApiError(403,'Not project owner') 
        }

        next();
 
});



export default ownsProject;