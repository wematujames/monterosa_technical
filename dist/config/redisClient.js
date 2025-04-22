"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const app_1 = __importDefault(require("./app"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const { redis } = app_1.default;
let client;
function connect() {
    if (client)
        return client;
    client = (0, redis_1.createClient)({
        username: redis.username,
        password: redis.password,
        socket: {
            host: redis.host,
            port: +redis.port,
        },
    });
    client.on("error", (err) => {
        Logger_1.default.log({ type: "redisError", data: err.stack });
    });
    client.on("connect", () => {
        Logger_1.default.log({ type: "redisConnected" });
    });
    client.connect();
    return client;
}
function disconnect() {
    if (client) {
        client.quit().catch((err) => {
            Logger_1.default.log({
                type: "redisClientExitError",
                data: err.stack
            });
        });
    }
}
exports.default = { connect, disconnect };
