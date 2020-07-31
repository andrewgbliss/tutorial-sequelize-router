import express from 'express';
import { validateSchema } from './validateSchema';
import { create, read, findByPk, update, destroy } from './sequelize';
const sequelizeRouter = (props) => {
  const { model, key = 'id', schemas } = props;
  const router = express.Router();
  router.get('/', read({ model }));
  router.get(`/:${model}Id`, findByPk({ model, id: `${model}Id` }));
  router.post('/', validateSchema(schemas.create), create({ model }));
  router.put(
    `/:${model}Id`,
    validateSchema(schemas.update),
    update({
      model,
      key,
      path: `params.${model}Id`,
    })
  );
  router.delete(
    `/:${model}Id`,
    destroy({
      model,
      key,
      path: `params.${model}Id`,
    })
  );
  return router;
};
export default sequelizeRouter;
