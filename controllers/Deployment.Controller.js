import db from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const deployProject = asyncHandler(async (req, res) => {
    const managerId = req.user.id;
    const { projectId } = req.params;
    const { deployment_version = 'v1.0.0' } = req.body;

    // 1️⃣ Initial Ownership & Status Check
    const [projects] = await db.execute(
        `SELECT status FROM projects WHERE id = ? AND manager_id = ?`,
        [projectId, managerId]
    );

    if (!projects.length) {
        throw new ApiError(403, 'You do not own this project');
    }

    if (projects[0].status !== 'COMPLETED') {
        throw new ApiError(400, 'Project must be COMPLETED before deployment');
    }

    // 2️⃣ Create deployment record with IN_PROGRESS status
    const [result] = await db.execute(
        `INSERT INTO deployments (project_id, manager_id, deployment_version, status) VALUES (?, ?, ?, ?)`,
        [projectId, managerId, deployment_version, "IN_PROGRESS"]
    );
    const deploymentId = result.insertId;

    // 3️⃣ THE WAIT (Simulating deployment time)
    // The request stays open here for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4️⃣ Determine Success or Failure (80% Success Rate)
    const isSuccess = Math.random() < 0.8;

    if (isSuccess) {
        // Update both tables to DEPLOYED
        await db.execute(
            `UPDATE deployments SET status = 'DEPLOYED' WHERE id = ?`,
            [deploymentId]
        );
     

        // Send response ONLY after success
        return res.status(200).json({
            success: true,
            message: 'Deployment finished successfully!',
            data: { deploymentId, status: 'DEPLOYED' }
        });
    } else {
        // Update Deployment to FAILED
        await db.execute(
            `UPDATE deployments SET status = 'FAILED' WHERE id = ?`,
            [deploymentId]
        );
        
        // We keep project status as COMPLETED so they can try again
        return res.status(500).json({
            success: false,
            message: 'Deployment failed during process.',
            data: { deploymentId, status: 'FAILED' }
        });
    }
});

export { deployProject };