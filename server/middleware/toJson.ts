import { Request, Response } from 'express';

const toJson = (req: Request, res: Response) => {
  res.status(200).json(req.results);
};

export default toJson;
