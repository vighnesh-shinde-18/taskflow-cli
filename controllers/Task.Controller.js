import db from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const fetchTask = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        if ([projectId].some((field) => !field)) {
            throw new ApiError(401, "Project Id is required");
        }

        const [result] = await db.execute(
            'SELECT * FROM tasks WHERE project_id = ?',
            [title, description, projectId]
        );

        res.status(201).json({
            message: 'Task created',
            data: result,
            success: true
        });
    } catch (error) {
        console.log("Error while fetching task")
        throw new ApiError(503, "Internel Server error", error);
    }
})
const createTask = asyncHandler(async (req, res) => {
    try {
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
    } catch (error) {
        console.log("Error while creating task")
        throw new ApiError(503, "Internel Server error", error);

    }

});



const assignTask = asyncHandler(async (req, res) => {
    try {
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
    } catch (error) {
        console.log("Error while assigning task")
        throw new ApiError(503, "Internel Server error", error);
    }
});

const updateTaskStatus = asyncHandler(async (req, res) => {
    try {
        const { taskId, status } = req.body;

        if ([taskId, status].some((field) => !field)) {
            throw new ApiError(401, "All fields are required");
        }

        const [result] = await db.execute(
            'UPDATE tasks SET status = ? WHERE id = ?',
            [status, taskId]
        );

        res.status(201).json({
            message: 'Task status updated successfully',
            data: result,
            success: true
        });
    } catch (error) {
        console.log("Error while assigning task")
        throw new ApiError(503, "Internel Server error", error);
    }
});

export { createTask, assignTask, updateTaskStatus, fetchTask }
