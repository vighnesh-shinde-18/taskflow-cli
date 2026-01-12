import express from 'express';
import authenticationMiddleware from '../middleware/Auth.middleware.js';
import { isManager } from '../middleware/Role.middleware.js';
import ownsProject from '../middleware/Project.middleware.js'
import { deployProject } from '../controllers/Deployment.Controller.js';


const router = express.Router();

router.post(
    '/:projectId',
    authenticationMiddleware,
    isManager,
    ownsProject,
    deployProject
);

export default router;
