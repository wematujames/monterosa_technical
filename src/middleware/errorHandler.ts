import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/ErrorResponse";

const errorHandler =  (
    err: ErrorResponse & Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    res.status(err.code || 500).json({
        code: err.code || 500,
        success: false,
        message: err.message || "Server error",
    });
};

export default errorHandler;