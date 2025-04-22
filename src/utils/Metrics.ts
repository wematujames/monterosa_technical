import redisClient from "../config/redisClient";

type MetricType = "httpRequestsTotal" |
"http429Total" |
"processedJobsTotal" |
"queueLength" |
"processDurations";

class Metric {
    constructor () {
        this.init();
    }

    async init () {
        const client = await redisClient.connect(); 

        const existingMetric = await client.hGetAll("metric");

        if (Object.keys(existingMetric).length >= 5) return;

        await client.hSet("metric", "httpRequestsTotal", "0");
        await client.hSet("metric", "http429Total", "0");
        await client.hSet("metric", "processedJobsTotal", "0");
        await client.hSet("metric", "queueLength", "0");
        await client.hSet("metric", "processDurations", "[]");
    }

    async increaseMetric(name: MetricType) {
        const client = await redisClient.connect(); 
        
        const mValStr = await client.hGet("metric", name);
        
        if (!mValStr) return;

        await client.hSet("metric", name, +mValStr + 1)
    }

    async addDuration(duration: number) {
        const client = await redisClient.connect(); 
        
        const durationsStr = await client.hGet("metric", "processDurations");
        
        if (!durationsStr) return;

        const durationsArr = JSON.parse(durationsStr);
        durationsArr.push(duration);

        await client.hSet("metric", "processDurations", JSON.stringify(durationsArr))
    }

    async setLength(length: number) {
        const client = await redisClient.connect(); 

        await client.hSet("metric", "queueLength", length)
    }

    async getMetrics () {
        const client = await redisClient.connect();

        const metrics =  await client.hGetAll("metric");

        const durations = JSON.parse(metrics.processDurations)

        const avgJobDuration = durations.length ? (durations.reduce(
            (c: number, n: number) => c + n, 0
        ) / durations.length) / 1000 : 0;
    
        return {
            http_requests_total: metrics.httpRequestsTotal,
            http_responses_429_total: metrics.http429Total,
            jobs_processed_total: metrics.processedJobsTotal,
            queue_current_length: metrics.queueLength,
            avg_processing_time: parseFloat(avgJobDuration + "").toFixed(2) + "s"
        }
    }
}

export default new Metric();