import { Router } from 'express';
import { getAll, mark, bulkMark, getReport } from '../controllers/attendance.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validate';
import { markAttendanceSchema, bulkAttendanceSchema } from '../validators/attendance.validator';

const router = Router();

router.use(authenticate);
router.use(authorize('HR', 'DIRECTOR', 'SUPERADMIN'));

router.get('/', getAll);
router.post('/', validate(markAttendanceSchema), mark);
router.post('/bulk', validate(bulkAttendanceSchema), bulkMark);
router.get('/report', getReport);

export default router;
