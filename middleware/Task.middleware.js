import db from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

const isAssignedDeveloper = asyncHandler(async (req, res, next) => {
    try {
        const taskId = req.params.taskId || req.body.taskId;
        const developerId = req.user.id;

        const [rows] = await db.execute(
            'SELECT id FROM tasks WHERE id = ? AND assigned_to = ?',
            [taskId, developerId]
        );

        if (!rows.length) {
            throw new ApiError(403,'Task not assigned to you')
        }

        next();
    } catch (error) {
        console.log("Error while checking assigned task user ", error)
        throw new ApiError(503, "Internel Server error", error);
    }

});

export  {isAssignedDeveloper};
