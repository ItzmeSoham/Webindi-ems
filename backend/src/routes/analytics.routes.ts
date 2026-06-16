import { Router } from 'express';
import { getDashboard } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/dashboard', getDashboard);

export default router;
