import { Request, Response, NextFunction } from 'express';
import asyncEndpoint from './asyncEndpoint';
import toJson from './toJson';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';
import qs from 'querystring';

interface SequelizeOptions {
  offset: number;
  limit: number;
  order?: Array<any>;
  attributes?: Array<string>;
  include?: Array<any>;
  logging?: any;
}

interface Include {
  model: string;
  as?: string;
  attributes?: string;
  where?: any;
}

export const withSequelize = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const db = req.app.get('db');
  const { Sequelize } = db;
  const {
    page = 0,
    limit = 100,
    order = '',
    attributes = ['id'],
    include,
  }: any = req.query;
  let options: SequelizeOptions = {
    offset: page === 0 ? 0 : parseInt(page) * parseInt(limit),
    limit: parseInt(limit),
  };
  let conditions = {};
  if (order && isString(order)) {
    const [column, direction = 'ASC'] = order.split(',');
    options.order = [[Sequelize.col(column), direction]];
  } else if (order && isArray(order)) {
    options.order = order.map((orderGroup = '') => {
      const [column, direction = 'ASC'] = orderGroup.split(',');
      return [Sequelize.col(column), direction];
    });
  }
  if (attributes && isString(attributes)) {
    options.attributes = attributes.split(',');
  } else if (attributes && isArray(attributes)) {
    options.attributes = attributes;
  }
  if (attributes && isString(attributes)) {
    options.attributes = attributes.split(',');
  } else if (attributes && isArray(attributes)) {
    options.attributes = attributes;
  }
  if (include && isArray(include)) {
    options.include = include.map((includeModel) => {
      const { model, as, attributes, ...rest }: any = qs.parse(
        includeModel,
        ';',
        '='
      );
      const include: Include = {
        model: db[model],
      };
      if (as) {
        include.as = as;
      }
      if (attributes) {
        include.attributes = attributes.split(',');
      }
      const otherColumns = omit(rest, [
        'page',
        'limit',
        'order',
        'attributes',
        'include',
      ]);
      if (otherColumns) {
        include.where = otherColumns;
      }
      return include;
    });
  }
  const otherColumns = omit(req.query, [
    'page',
    'limit',
    'order',
    'attributes',
    'include',
  ]);
  if (otherColumns) {
    conditions = {
      where: otherColumns,
    };
  }
  req.sequelize = {
    options,
    conditions,
  };
  return next();
};

export const create = (props) => {
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const model = db[props.model];
    if (!model) {
      throw {
        status: 404,
        message: 'Model not found',
      };
    }
    const results = await model.create(req.body);
    req.results = results;
    next();
  };
  return [asyncEndpoint(route), toJson];
};

export const bulkCreate = (props) => {
  const { path } = props;
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const model = db[props.model];
    if (!model) {
      throw {
        status: 404,
        message: 'Model not found',
      };
    }
    const data = get(req.body, path);
    const results = await model.bulkCreate(data, { individualHooks: true });
    req.results = results;
    next();
  };
  return [asyncEndpoint(route), toJson];
};

export const read = (props) => {
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const model = db[props.model];
    if (!model) {
      throw {
        status: 404,
        message: 'Model not found',
      };
    }
    let results = await model.findAll({
      ...req.sequelize.conditions,
      ...req.sequelize.options,
    });
    req.results = results;
    next();
  };
  return [withSequelize, asyncEndpoint(route), toJson];
};

export const findByPk = (props) => {
  const { id } = props;
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const model = db[props.model];
    if (!model) {
      throw {
        status: 404,
        message: 'Model not found',
      };
    }
    const results = await model.findByPk(req.params[id], {
      ...req.sequelize.conditions,
      ...req.sequelize.options,
    });
    req.results = results;
    next();
  };
  return [withSequelize, asyncEndpoint(route), toJson];
};

export const findOne = (props) => {
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const model = db[props.model];
    if (!model) {
      throw {
        status: 404,
        message: 'Model not found',
      };
    }
    req.sequelize.conditions.where = {
      ...req.sequelize.conditions.where,
    };
    const results = await model.findOne({
      ...req.sequelize.conditions,
      ...req.sequelize.options,
    });
    req.results = results;
    next();
  };
  return [withSequelize, asyncEndpoint(route), toJson];
};

export const update = (props) => {
  const { key, path, fields } = props;
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const model = db[props.model];
    if (!model) {
      throw {
        status: 404,
        message: 'Model not found',
      };
    }
    const results = await model.update(req.body, {
      where: {
        [key]: get(req, path),
      },
      fields,
    });
    req.results = results;
    next();
  };
  return [asyncEndpoint(route), toJson];
};

export const updateJsonbArray = (props) => {
  const { tableName, primaryKey, column, id } = props;
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const { sequelize } = db;
    const sql = `
      UPDATE "${tableName}"
      SET ${column} = jsonb_set(${column}, '{:index}', ${column}::jsonb->:index || :data)
      WHERE ${primaryKey} = :id;
    `;
    const results = await sequelize.query(sql, {
      raw: true,
      replacements: {
        id: req.params[id],
        index: req.body.index,
        data: JSON.stringify(req.body.data),
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    req.results = results;
    next();
  };
  return [asyncEndpoint(route), toJson];
};

export const destroy = (props) => {
  const { key, path } = props;
  const route = async (req: Request, res: Response, next: NextFunction) => {
    const db = req.app.get('db');
    const model = db[props.model];
    if (!model) {
      throw {
        status: 404,
        message: 'Model not found',
      };
    }
    const results = await model.destroy({
      where: {
        [key]: get(req, path),
      },
    });
    req.results = results;
    next();
  };
  return [asyncEndpoint(route), toJson];
};
