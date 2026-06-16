import { Router } from 'express';
import { getAll, create, updateStatus } from '../controllers/leave.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validate';
import { createLeaveSchema, updateLeaveStatusSchema } from '../validators/leave.validator';

const router = Router();

router.use(authenticate);
router.use(authorize('HR', 'DIRECTOR', 'SUPERADMIN'));

router.get('/', getAll);
router.post('/', validate(createLeaveSchema), create);
router.put('/:id/status', validate(updateLeaveStatusSchema), updateStatus);

export default router;
