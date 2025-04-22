"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisClient_1 = __importDefault(require("../config/redisClient"));
const ErrorResponse_1 = __importDefault(require("./ErrorResponse"));
const Logger_1 = __importDefault(require("./Logger"));
const Metrics_1 = __importDefault(require("../utils/Metrics"));
class Queue {
    constructor(name, concurrency, executor, maxItems) {
        this.jobIdCounter = 1;
        this.name = "queue";
        this.concurrency = 1;
        this.isQueueProcessing = false;
        this.maxItems = 5;
        this.isShuttingDown = false;
        this.name = name;
        this.concurrency = concurrency;
        if (maxItems)
            this.maxItems = maxItems;
        this.executor = executor;
        // initial call to process to items
        this.runQueue();
    }
    async enqueue(data) {
        if (this.isShuttingDown) {
            throw new ErrorResponse_1.default(500, "processExiting", "Process exiting");
        }
        ;
        const isQueueFull = await this.isFull();
        if (isQueueFull) {
            // metrics.http_responses_429_total++;
            await Metrics_1.default.increaseMetric("http429Total");
            throw new ErrorResponse_1.default(429, "queueFull", "Queue is full.Cannot enqueue more tasks");
        }
        // metrics.queue_current_length++;
        await Metrics_1.default.increaseMetric("queueLength");
        const job = { id: this.jobIdCounter++, data, retries: 0 };
        // add item to redis queue
        const client = await redisClient_1.default.connect();
        await client.rPush(`${this.name}:waiting`, JSON.stringify(job));
        // Ensure queue is processing items
        this.runQueue();
        // setInterval(() => {
        //     console.log("is processing", this.isQueueProcessing);
        // }, 500);
    }
    async runQueue() {
        if (this.isQueueProcessing)
            return;
        if (await this.getLength() > 0) {
            this.isQueueProcessing = true;
        }
        while ((await this.getLength()) > 0) {
            const itemsToProcess = await this.dequeue(this.concurrency);
            const promises = itemsToProcess.map(item => {
                return this.processJob(item);
            });
            await Promise.all(promises);
        }
        this.isQueueProcessing = false;
    }
    async processJob(job) {
        const startTime = Date.now();
        const processingTime = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    await this.executor(job);
                    // Push item to completed items
                    this.onComplete(job, Date.now() - startTime);
                }
                catch (err) {
                    job.retries++;
                    // Push item back to waiting job for retry
                    if (job.retries < 2) {
                        const client = await redisClient_1.default.connect();
                        await client.rPush(`${this.name}:waiting`, JSON.stringify(job));
                    }
                    // Declare job as failed
                    else
                        this.onFailed(job, Date.now() - startTime);
                }
                resolve("processed");
            }, processingTime);
        });
    }
    async dequeue(number) {
        const client = await redisClient_1.default.connect();
        const dequeued = [];
        for (let i = 0; i < number; i++) {
            const job = await client.lPop(this.name + ":waiting");
            if (!job)
                break;
            dequeued.push(JSON.parse(job));
        }
        return dequeued;
    }
    async onComplete(job, duration) {
        const client = await redisClient_1.default.connect();
        const currentJobsLength = await client.lLen(this.name + ":waiting");
        await client.rPush(`${this.name}:completed`, JSON.stringify(job));
        await Metrics_1.default.increaseMetric("processedJobsTotal"); //jobs_processed_total++;
        await Metrics_1.default.addDuration(duration); //processing_times.push(duration);
        await Metrics_1.default.setLength(currentJobsLength); //queue_current_length = currentJobsLength
        Logger_1.default.log({
            type: "jobQueueProcess",
            jobId: job.id,
            status: "completed",
            data: job,
            duration: duration,
            queueLength: currentJobsLength
        });
    }
    ;
    async onFailed(job, duration) {
        const client = await redisClient_1.default.connect();
        const currentJobsLength = await client.lLen(this.name + ":waiting");
        await client.rPush(`${this.name}:failed`, JSON.stringify(job));
        await Metrics_1.default.increaseMetric("processedJobsTotal"); //jobs_processed_total++;
        await Metrics_1.default.addDuration(duration); //processing_times.push(duration);
        await Metrics_1.default.setLength(currentJobsLength); //queue_current_length = currentJobsLength
        Logger_1.default.log({
            type: "jobQueueProcess",
            jobId: job.id,
            status: "failed",
            data: job,
            duration: duration,
            queueLength: currentJobsLength
        });
    }
    ;
    set shutdown(val) {
        this.isShuttingDown = val;
    }
    ;
    async isQueueEmpty() {
        const client = await redisClient_1.default.connect();
        const currentLength = await client.lLen(this.name + ":waiting");
        return !currentLength && !this.isQueueProcessing;
    }
    async isFull() {
        const client = await redisClient_1.default.connect();
        const currentLength = await client.lLen(this.name + ":waiting");
        return currentLength >= this.maxItems;
    }
    async getLength() {
        const client = await redisClient_1.default.connect();
        return client.lLen(this.name + ":waiting");
    }
}
exports.default = Queue;
