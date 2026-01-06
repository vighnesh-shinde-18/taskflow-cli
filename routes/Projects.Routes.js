import express from 'express';

import authenticationMiddleware from '../middleware/Auth.middleware.js';
import { isManager } from '../middleware/Role.middleware.js';
import { createProject, getMyProjects, completeProject } from '../controllers/Project.Controller.js';
import ownsProject from '../middleware/Project.middleware.js';

const router = express.Router();
router.post(
    '/',
    authenticationMiddleware,
    isManager,
    createProject
);

router.get(
    '/',
    authenticationMiddleware,
    isManager,
    getMyProjects
);

router.post(
    '/complete',
    authenticationMiddleware,
    isManager,
    ownsProject,
    completeProject
)

export default router;
