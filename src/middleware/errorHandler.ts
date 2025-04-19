import { Request, Response, NextFunction } from "express";

module.exports = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    
    // Send error response //err.statusCode ||
    res.status(500).json({
        // statusCode: err.statusCode || 500,
        success: false,
        message: err.message || "Server error",
    });
};
