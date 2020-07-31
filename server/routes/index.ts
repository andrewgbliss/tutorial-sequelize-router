import express from 'express';
import PublicApiRoutes from './public';

const router = express.Router();

router.use('/api', [PublicApiRoutes]);

export default router;
