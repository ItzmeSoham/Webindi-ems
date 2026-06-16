import { Router } from 'express';
import multer from 'multer';
import { getAll, getById, create, update, remove, uploadAvatar } from '../controllers/employee.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validate';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.use(authenticate);

router.get('/', authorize('HR', 'DIRECTOR', 'SUPERADMIN'), getAll);
router.get('/:id', authorize('HR', 'DIRECTOR', 'SUPERADMIN'), getById);
router.post('/', authorize('HR', 'DIRECTOR', 'SUPERADMIN'), validate(createEmployeeSchema), create);
router.put('/:id', authorize('HR', 'DIRECTOR', 'SUPERADMIN'), validate(updateEmployeeSchema), update);
router.delete('/:id', authorize('HR', 'SUPERADMIN'), remove);
router.post('/:id/avatar', authorize('HR', 'DIRECTOR', 'SUPERADMIN'), upload.single('avatar'), uploadAvatar);

export default router;
