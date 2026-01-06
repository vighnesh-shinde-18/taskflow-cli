import db from '../../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'


const canApprovePR = asyncHandler(async (req, res, next) => {
    try {
        const prId = req.params.prId;
        const managerId = req.user.id;

        const [rows] = await db.execute(`
    SELECT p.manager_id
    FROM pull_requests pr
    JOIN tasks t ON pr.task_id = t.id
    JOIN projects p ON t.project_id = p.id
    WHERE pr.id = ?
  `, [prId]);

        if (!rows.length || rows[0].manager_id !== managerId) {
            throw new ApiError(403,'Not authorized to approve this PR') 
        }

        next();
    } catch (error) {
        console.log("Error while aaproving pr ", error)
        throw new ApiError(503, "Internel Server error", error);

    }
});

export default canApprovePR;