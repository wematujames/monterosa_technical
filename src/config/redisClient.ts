import { createClient, RedisClientType } from "redis";
import envVars from "./app";
import logger from "../utils/Logger";

const { redis } = envVars;

let client: RedisClientType;

function connect() {
    if (client) return client;

    client = createClient({
        username: redis.username,
        password: redis.password,
        socket: {
            host: redis.host,
            port: +redis.port ,
        },
    });

    client.on("error", (err: Error) => {
        // logger.log("Redis error:", err);
    });

    client.on("connect", () => {
        // logger.info("Redis connected");
    });

    client.on("end", () => {
        // logger.info("Redis connection closed");
    });

    client.connect();

    return client;
}

function disconnect() {
    if (client) {
        client.quit().catch((err: Error) => {
            logger.log({
                type: "redisClientExitError",
                stack: err.toString()
            });
        });
    }
}

export default { connect, disconnect };
