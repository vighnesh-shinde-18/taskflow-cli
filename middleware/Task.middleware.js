import db from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'

const isAssignedDeveloper = asyncHandler(async (req, res, next) => {
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
    
});

const ownTask = asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;
    const managerId = req.user.id;

    if (!taskId) {
      throw new ApiError(400, 'Task ID is required');
    }

    const [rows] = await db.execute(
      `
      SELECT t.id
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = ? AND p.manager_id = ?
      `,
      [taskId, managerId]
    );

    if (!rows.length) {
      throw new ApiError(
        403,
        'You are not authorized to complete this task'
      );
    }

    // ownership confirmed
    next(); 
});

export  {isAssignedDeveloper, ownTask};
