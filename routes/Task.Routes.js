import express from 'express';

import authenticationMiddleware from '../middleware/Auth.middleware.js';
import { isManager, isDeveloper } from '../middleware/Role.middleware.js';
import ownsProject from '../middleware/Project.middleware.js';
import isDeveloperInManagerTeam from '../middleware/Team.middleware.js';
import { isAssignedDeveloper } from '../middleware/Task.middleware.js';
import { createTask, assignTask, updateTaskStatus, fetchTask } from '../controllers/Task.Controller.js';

const router = express.Router();
router.post(
    '/',
    authenticationMiddleware,
    isManager,
    ownsProject,
    createTask
);

router.post(
    '/assign',
    authenticationMiddleware,
    isManager,
    ownsProject,
    isDeveloperInManagerTeam,
    assignTask
);

router.patch(
    '/status',
    authenticationMiddleware,
    isDeveloper,
    isAssignedDeveloper,
    updateTaskStatus
);

router.get(
    '/:projectId',
    authenticationMiddleware,
    isManager,
    ownsProject,
    fetchTask
)

export default router;
