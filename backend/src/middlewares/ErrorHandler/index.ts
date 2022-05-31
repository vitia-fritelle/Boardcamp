import { Request, Response, NextFunction } from 'express';
import utils from '../../utils';

const {CustomError} = utils;

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send(err.message);
    }
    return res.status(500).send('Something broke!');
};

export default errorHandler;