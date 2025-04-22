import { createClient } from "redis";
import { redis } from "./app";
import { logger } from "../utils";

let client;

function connect() {
    if (client) return client;

    client = createClient({
        username: redis.username,
        password: redis.password,
        socket: {
            host: redis.host,
            port: redis.port,
        },
    });

    client.on("error", (err) => {
        logger.error("Redis error:", err);
    });

    client.on("connect", () => {
        logger.info("Redis connected");
    });

    client.on("end", () => {
        logger.info("Redis connection closed");
    });

    client.connect();

    return client;
}

function disconnect() {
    if (client) {
        client.quit().catch((err) => {
            logger.error("Error closing Redis connection:", err);
        });
    }
}

module.exports = { connect, disconnect };
