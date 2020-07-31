interface SequelizeOptions {
  options: any;
  conditions: any;
}

declare namespace Express {
  export interface Request {
    sequelize?: SequelizeOptions;
    results?: any;
  }
}
