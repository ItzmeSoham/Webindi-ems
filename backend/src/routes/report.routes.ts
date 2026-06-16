import { Router } from 'express';
import { employeesCSV, attendanceCSV } from '../controllers/report.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize('HR', 'SUPERADMIN'));

router.get('/employees/csv', employeesCSV);
router.get('/attendance/csv', attendanceCSV);

export default router;
