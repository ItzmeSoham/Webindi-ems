import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/user.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPERADMIN'));

router.get('/', getAll);
router.post('/', validate(createUserSchema), create);
router.put('/:id', validate(updateUserSchema), update);
router.delete('/:id', remove);

export default router;
