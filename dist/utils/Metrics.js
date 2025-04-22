"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisClient_1 = __importDefault(require("../config/redisClient"));
class Metric {
    // private "httpRequestsTotal": number = 0;
    // private "http429Total": number = 0;
    // private "processedJobsTotal": number = 0;
    // private "queueLength": number = 0;
    // private "processDurations": number[] = [];
    constructor() {
        this.init();
    }
    async init() {
        const client = await redisClient_1.default.connect();
        const existingMetric = await client.hGetAll("metric");
        if (Object.keys(existingMetric).length)
            return;
        await client.hSet("metric", "httpRequestsTotal", "0");
        await client.hSet("metric", "http429Total", "0");
        await client.hSet("metric", "processedJobsTotal", "0");
        await client.hSet("metric", "queueLength", "0");
        await client.hSet("metric", "processDurations", "[]");
    }
    async increaseMetric(name) {
        const client = await redisClient_1.default.connect();
        const mValStr = await client.hGet("metric", name);
        if (!mValStr)
            return;
        await client.hSet("metric", name, +mValStr + 1);
    }
    async addDuration(duration) {
        const client = await redisClient_1.default.connect();
        const durationsStr = await client.hGet("metric", "processDurations");
        if (!durationsStr)
            return;
        const durationsArr = JSON.parse(durationsStr);
        durationsArr.push(duration);
        await client.hSet("metric", "processDurations", JSON.stringify(durationsArr));
    }
    async setLength(length) {
        const client = await redisClient_1.default.connect();
        await client.hSet("metric", "queueLength", length);
    }
    async getMetrics() {
        const client = await redisClient_1.default.connect();
        const metrics = await client.hGetAll("metric");
        const avgJobDuration = JSON.parse(metrics.processDurations).reduce((c, n) => c + n, 0) / 1000;
        return {
            http_requests_total: metrics.httpRequestsTotal,
            http_responses_429_total: metrics.http429Total,
            jobs_processed_total: metrics.processedJobsTotal,
            queue_current_length: metrics.queueLength,
            // processing_times: metrics.processDurations,
            avg_processing_time: parseFloat(avgJobDuration + "").toFixed(2) + "s"
        };
    }
}
exports.default = new Metric();
