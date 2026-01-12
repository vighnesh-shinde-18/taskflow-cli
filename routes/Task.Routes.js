import express from 'express';

import authenticationMiddleware from '../middleware/Auth.middleware.js';
import { isManager, isDeveloper } from '../middleware/Role.middleware.js';
import ownsProject from '../middleware/Project.middleware.js';
import isDeveloperInManagerTeam from '../middleware/Team.middleware.js';
import { isAssignedDeveloper, ownTask } from '../middleware/Task.middleware.js';
import { createTask, assignTask, updateTaskStatus, fetchTask, completeTask } from '../controllers/Task.Controller.js';
import { allPrSattle } from '../middleware/Pr.middleware.js';

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
    '/manager/:projectId',
    authenticationMiddleware,
    isManager,
    ownsProject,
    fetchTask
)

router.get(
    '/developer/',
    authenticationMiddleware,
    isDeveloper,
    fetchTask
)

router.post(
    '/complete/:taskId',
    authenticationMiddleware,
    isManager, 
    ownTask, 
    allPrSattle,
    completeTask,     
);


export default router;
