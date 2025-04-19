import { Request, Response, NextFunction } from "express";

export default (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next))
        .catch(next)
    }   
}