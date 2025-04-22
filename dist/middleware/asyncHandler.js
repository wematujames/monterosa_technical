"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Automatically the express next Func to handle http req exceptions */
exports.default = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next))
            .catch(next);
    };
};
