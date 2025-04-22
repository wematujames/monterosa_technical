import { Request, Response, NextFunction } from "express";
import logger from "../utils/Logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on("finish", () => {
        logger.log({
            type: "http_req",
            request: {
                url: req.originalUrl,
                headers: req.headers,
                method: req.method,
                body: req.body,
                ip: req.ip,
            }, 
            response: { 
                responseTime: Date.now() - startTime,
                statusCode: res.statusCode 
            }
        });
    }); 

    next();
};

export default requestLogger;