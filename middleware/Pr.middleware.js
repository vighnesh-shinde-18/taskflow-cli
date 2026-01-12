import db from '../db/index.js'
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'


const canHandlePR = asyncHandler(async (req, res, next) => {
    
        const prId = req.params.prId;
        const managerId = req.user.id;


        const [rows] = await db.execute(`
    SELECT p.manager_id
    FROM pull_requests pr
    JOIN tasks t ON pr.task_id = t.id
    JOIN projects p ON t.project_id = p.id
    WHERE pr.id = ?
  `, [prId]);


        if (!rows.length || Number(rows[0].manager_id) !== Number(managerId)) {
            throw new ApiError(403, 'Not authorized to approve this PR')
        }

        next();
   
});

const canRaisePR = asyncHandler(async (req, res, next) => {
    

        const { taskId } = req.body;
        const developerId = req.user.id;

        // 1️⃣ Check task exists + assigned to developer + status IN_PROGRESS
        const [tasks] = await db.execute(
            `SELECT id, status FROM tasks 
    WHERE id = ? AND assigned_to = ?`,
            [taskId, developerId]
        );

        if (!tasks.length) {
            throw new ApiError(403, 'Task not assigned to you');
        }

        if (tasks[0].status !== 'IN_PROGRESS') {
            throw new ApiError(
                400,
                'PR can only be raised when task is IN_PROGRESS'
            );
        }

        // 2️⃣ Ensure no OPEN PR already exists
        const [existingPR] = await db.execute(
            `SELECT id FROM pull_requests 
        WHERE task_id = ? AND status = 'OPEN'`,
            [taskId]
        );

        if (existingPR.length) {
            throw new ApiError(400, 'An OPEN PR already exists for this task');
        }
        next(); 
});

const allPrSattle = asyncHandler(async (req, res, next) => {
    
        const { taskId } = req.params;

        if (!taskId) {
            throw new ApiError(40,"Task id is required ")
        }

        // 1️⃣ Check for OPEN PRs
        const [openPRs] = await db.execute(
            `SELECT id FROM pull_requests
           WHERE task_id = ? AND status = 'OPEN'`,
            [taskId]
        );

        if (openPRs.length > 0) {
            throw new ApiError(
                400,
                'Cannot complete task while PR is still OPEN'
            );
        }

        // 2️⃣ Check at least one MERGED PR exists
        const [mergedPRs] = await db.execute(
            `SELECT id FROM pull_requests
           WHERE task_id = ? AND status = 'MERGED'`,
            [taskId]
        );

        if (!mergedPRs.length) {
            throw new ApiError(
                400,
                'Task must have at least one MERGED PR to be completed'
            );
        }

        // attach taskId for next controller
        req.taskId = taskId;

        next(); 
});

// export default canCompleteTaskFromPR;

export { canHandlePR, canRaisePR, allPrSattle };