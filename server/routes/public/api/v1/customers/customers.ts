import joi from '@hapi/joi';
import sequelizeRouter from '../../../../../middleware/sequelizeRouter';

const createSchema = {
  path: 'body',
  schema: joi.object().keys({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
  }),
};

const updateSchema = {
  path: 'body',
  schema: joi.object().keys({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
  }),
};

const router = sequelizeRouter({
  model: 'Customers',
  schemas: { create: createSchema, update: updateSchema },
});

export default router;
