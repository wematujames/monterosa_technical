"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next))
            .catch(next);
    };
};
