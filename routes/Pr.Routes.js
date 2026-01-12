import express from 'express';
import { createPR, approvePR, rejectPR, mergePR, listProjectPRs } from '../controllers/Pr.Controller.js'
import authenticationMiddleware from '../middleware/Auth.middleware.js';
import { isDeveloper, isManager } from '../middleware/Role.middleware.js';
import { isAssignedDeveloper, ownTask } from '../middleware/Task.middleware.js';
import { canRaisePR, canHandlePR } from '../middleware/Pr.middleware.js';


const router = express.Router();

router.post(
  '/',
  authenticationMiddleware,
  isDeveloper,
  isAssignedDeveloper,
  canRaisePR,
  createPR
);

router.post(
  '/:prId/approve',
  authenticationMiddleware,
  isManager,
  canHandlePR,
  approvePR
);

router.post(
  '/:prId/reject',
  authenticationMiddleware,
  isManager,
  canHandlePR,
  rejectPR
);

router.post(
  '/:prId/merge',
  authenticationMiddleware,
  isManager,
  canHandlePR,
  mergePR
);


// ✅ Manager lists PRs of a specific project
router.get(
  '/manager/:projectId',
  authenticationMiddleware,
  isManager,
  listProjectPRs
);


export default router;
