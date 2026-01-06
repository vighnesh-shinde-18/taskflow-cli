import db from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const createProject = asyncHandler(async (req, res) => {
    try {

        const { name, description } = req.body;
        const managerId = req.user.id;

        if ([name, description].some((field) => !field)) {
            throw new ApiError(401, "All fields are required");
        }

        const [result] = await db.execute(
            'INSERT INTO projects (name, description, manager_id) VALUES (?, ?, ?)',
            [name, description, managerId]
        );

        res.status(201).json({
            message: 'Project created Successfully',
            data: result.insertId,
            success: true
        });
    } catch (error) {
        console.log("Error while creating project")
        throw new ApiError(503, "Internel Server error", error);
    }
});

const getMyProjects = asyncHandler(async (req, res) => {
    try {

        const managerId = req.user.id;

        const [projects] = await db.execute(
            'SELECT * FROM projects WHERE manager_id = ?',
            [managerId]
        );


        res.status(201).json({
            message: 'Project fetch Successfully',
            data: projects,
            success: true
        });
    } catch (error) {
        console.log("Error while fetching project")
        throw new ApiError(503, "Internel Server error", error);
    }
});

const completeProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const managerId = req.user.id;

        const [projects] = await db.execute(
            'SELECT id, status FROM projects WHERE id = ? AND manager_id = ?',
            [projectId, managerId]
        );

        if (!projects.length) {
            throw new ApiError(403, 'You are not owner of this project');
        }

        if (projects[0].status === 'COMPLETED') {
            throw new ApiError(400, 'Project already completed');
        }

        // 2️⃣ Check if any task is NOT DONE
        const [pendingTasks] = await db.execute(
            `SELECT id FROM tasks 
       WHERE project_id = ? AND status != 'DONE'`,
            [projectId]
        );

        if (pendingTasks.length > 0) {
            throw new ApiError(
                400,
                'Cannot complete project. All tasks must be DONE.'
            );
        }

        // 3️⃣ Mark project as COMPLETED
        await db.execute(
            'UPDATE projects SET status = ? WHERE id = ?',
            ['COMPLETED', projectId]
        );

        res.json({
            success: true,
            message: 'Project marked as COMPLETED successfully',
            data: projects[0]
        });

    } catch (error) {
        console.log('Error while completing the project');
        throw new ApiError(503, 'Internal Server Error', error);
    }
})

export { createProject, getMyProjects , completeProject}
