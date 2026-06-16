import { Router } from 'express';
import { getAll } from '../controllers/activityLog.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPERADMIN', 'DIRECTOR'));

router.get('/', getAll);

export default router;
