import { Request, Response, NextFunction } from "express";

/** Automatically the express next Func to handle http req exceptions */
export default (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next))
        .catch(next)
    }   
}