import express from 'express';
import customers from './customers';

const router = express.Router();

router.use('/customers', customers);

export default router;
