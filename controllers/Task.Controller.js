import db from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const fetchTask = asyncHandler(async (req, res) => {
     
        if (req.user.role === 'MANAGER') {
            const { projectId } = req.params;

            const [tasks] = await db.execute(
                'SELECT * FROM tasks WHERE project_id = ?',
                [projectId]
            );

            return res.json(tasks);
        }

        // Developer
        const developerId = req.user.id;

        const [tasks] = await db.execute(
            'SELECT * FROM tasks WHERE assigned_to = ?',
            [developerId]
        );

        res.json(tasks);

     
})
const createTask = asyncHandler(async (req, res) => {
  
        const { title, description, projectId } = req.body;

        if ([title, description, projectId].some((field) => !field)) {
            throw new ApiError(401, "All fields are required");
        }

        const [result] = await db.execute(
            'INSERT INTO tasks (title, description, project_id) VALUES (?, ?, ?)',
            [title, description, projectId]
        );

        res.status(201).json({
            message: 'Task created',
            data: { taskId: result.insertId },
            success: true
        });
     

});



const assignTask = asyncHandler(async (req, res) => {
     
        const { taskId, developerId } = req.body;

        if ([taskId, developerId].some((field) => !field)) {
            throw new ApiError(401, "All fields are required");
        }

        const [result] = await db.execute(
            'UPDATE tasks SET assigned_to = ? WHERE id = ?',
            [developerId, taskId]
        );

        res.status(201).json({
            message: 'Task assign successfully',
            data: result,
            success: true
        });
    
});

const updateTaskStatus = asyncHandler(async (req, res) => {
 
        const { taskId } = req.body;

        if ([taskId].some((field) => !field)) {
            throw new ApiError(401, "All fields are required");
        }

        const [result] = await db.execute(
            'UPDATE tasks SET status = "IN_PROGRESS" WHERE id = ?',
            [taskId]
        );

        

        res.status(201).json({
            message: 'Task status update to in progress successfully',
            data: result,
            success: true
        });
 
});

const completeTask = asyncHandler(async (req, res) => {
   
        const { taskId } = req.params;

        await db.execute(
            `UPDATE tasks SET status = 'DONE' WHERE id = ?`,
            [taskId]
        );

        res.json({
            message: 'Task marked as DONE (system-driven)'
        });
    
});





export { createTask, assignTask, updateTaskStatus, fetchTask, completeTask }
