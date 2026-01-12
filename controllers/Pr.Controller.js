import db from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const createPR = asyncHandler(async (req, res) => {
    const { taskId } = req.body;
    const developerId = req.user.id;

    // 3️⃣ Create PR
    const [prResult] = await db.execute(
        `INSERT INTO pull_requests (task_id, developer_id, status)
        VALUES (?, ?, 'OPEN')`,
        [taskId, developerId]
    );

    // 4️⃣ Auto move task → IN_REVIEW
    await db.execute(
        `UPDATE tasks SET status = 'IN_REVIEW' WHERE id = ?`,
        [taskId]
    );

    res.status(201).json({
        message: 'PR raised successfully',
        data: prResult.insertId,
        success: true
    });
});

const listProjectPRs = asyncHandler(async (req, res) => {
    const managerId = req.user.id;
    const { projectId } = req.params;

    if (!projectId) {
        throw new ApiError(400, 'Project ID is required');
    }

    // 🔒 Ownership check (manager → project)
    const [projects] = await db.execute(
        `SELECT id FROM projects WHERE id = ? AND manager_id = ?`,
        [projectId, managerId]
    );

    if (!projects.length) {
        throw new ApiError(403, 'You do not own this project');
    }

    // 📦 Fetch PRs of this project only
    const [prs] = await db.execute(
        `
      SELECT 
        pr.id            AS prId,
        pr.status        AS prStatus,
        pr.created_at    AS prCreatedAt,
        t.id             AS taskId,
        t.title          AS taskTitle,
        p.id             AS projectId,
        p.name           AS projectName,
        u.id             AS developerId,
        u.name           AS developerName,
        u.email          AS developerEmail
      FROM pull_requests pr
      JOIN tasks t ON pr.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON pr.developer_id = u.id
      WHERE p.manager_id = ? AND p.id = ?
      ORDER BY pr.created_at DESC
      `,
        [managerId, projectId]
    );

    res.json({
        success: true,
        data: prs,
    });
});

const approvePR = asyncHandler(async (req, res) => {
    const { prId } = req.params;

    const [prs] = await db.execute(
        `SELECT status FROM pull_requests WHERE id = ?`,
        [prId]
    );

    if (!prs.length) {
        throw new ApiError(404, 'PR not found');
    }

    if (prs[0].status !== 'OPEN') {
        throw new ApiError(400, 'Only OPEN PR can be approved');
    }

    await db.execute(
        `UPDATE pull_requests SET status = 'APPROVED' WHERE id = ?`,
        [prId]
    );

    res.json({ success: true, data: { ...prs[0], status: 'APPROVED' }, message: 'PR approved successfully' });

});

const rejectPR = asyncHandler(async (req, res) => {

    const { prId } = req.params;

    const [prs] = await db.execute(
        `SELECT pr.task_id, pr.status
        FROM pull_requests pr
        WHERE pr.id = ?`,
        [prId]
    );

    if (!prs.length) {
        throw new ApiError(404, 'PR not found');
    }

    if (prs[0].status !== 'OPEN') {
        throw new ApiError(400, 'Only OPEN PR can be rejected');
    }

    const taskId = prs[0].task_id;

    await db.execute(
        `UPDATE pull_requests SET status = 'REJECTED' WHERE id = ?`,
        [prId]
    );

    await db.execute(
        `UPDATE tasks SET status = 'IN_PROGRESS' WHERE id = ?`,
        [taskId]
    );

    res.json({ success: true, data: { ...prs[0], status: "REJECTED" }, message: 'PR rejected, task moved back to IN_PROGRESS' });
});

/**
 * MERGE PR
 * → Task moves to DONE
 */

const mergePR = asyncHandler(async (req, res) => {

    const { prId } = req.params;

    const [prs] = await db.execute(
        `SELECT pr.task_id, pr.status
            FROM pull_requests pr
            WHERE pr.id = ?`,
        [prId]
    );

    if (!prs.length) {
        throw new ApiError(404, 'PR not found');
    }

    console.log(prs[0])

    if (prs[0].status !== 'APPROVED') {
        throw new ApiError(
            400,
            'PR must be APPROVED before merge'
        );
    }

    const taskId = prs[0].task_id;

    // Transaction ensures atomicity

    await db.execute(
        `UPDATE pull_requests SET status = 'MERGED' WHERE id = ?`,
        [prId]
    );


    res.json({ success: true, data: prs[0], message: 'PR merged, task marked DONE' });

});


const getMyPRs = asyncHandler(async (req, res) => {

    const managerId = req.user.id;

    const [prs] = await db.execute(
        `
      SELECT 
        pr.id            AS prId,
        pr.status        AS prStatus,
        pr.created_at    AS prCreatedAt,
        t.id             AS taskId,
        t.title          AS taskTitle,
        p.id             AS projectId,
        p.name           AS projectName,
        u.id             AS developerId,
        u.name           AS developerName,
        u.email          AS developerEmail
      FROM pull_requests pr
      JOIN tasks t ON pr.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON pr.developer_id = u.id
      WHERE p.manager_id = ?
      ORDER BY pr.created_at DESC
      `,
        [managerId]
    );

    res.json({
        success: true,
        data: prs
    });

});


export { createPR, approvePR, rejectPR, mergePR, getMyPRs, listProjectPRs }
