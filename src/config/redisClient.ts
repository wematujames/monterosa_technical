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
        logger.log({type: "redisError", data: err.stack });
    });

    client.on("connect", () => {
        logger.log({type: "redisConnected"});
    });

    client.connect();

    return client;
}

function disconnect() {
    if (client) {
        client.quit().catch((err: Error) => {
            logger.log({
                type: "redisClientExitError",
                data: err.stack
            });
        });
    }
}

export default { connect, disconnect };
