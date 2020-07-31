import asyncEndpoint from './asyncEndpoint';

export const validateSchema = (...schemas) => {
  return asyncEndpoint(async (req, res, next) => {
    for (let schemaItem of schemas) {
      const { schema, path } = schemaItem;
      let validation = schema.validate(req[path], {
        abortEarly: false,
      });
      if (validation.error) {
        let messages = validation.error.details.map((i) => i.message);
        let errMessage = `Validation errors: ${messages.join(', ')}`;
        throw {
          status: 400,
          message: errMessage,
        };
      }
    }
    next();
  });
};
