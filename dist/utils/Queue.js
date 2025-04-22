"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_1 = __importDefault(require("../data/metrics"));
const ErrorResponse_1 = __importDefault(require("./ErrorResponse"));
const Logger_1 = __importDefault(require("./Logger"));
class Queue {
    constructor(name, concurrency, executor, maxItems = 5) {
        this.jobIdCounter = 1;
        this.name = "queue";
        this.concurrency = 1;
        this.isQueueProcessing = false;
        this.maxItems = 100;
        this.isShuttingDown = false;
        this.items = {
            waiting: [
                { id: 1, data: {}, retries: 0 },
                { id: 2, data: {}, retries: 0 },
                { id: 3, data: {}, retries: 0 },
                { id: 4, data: {}, retries: 0 }
            ],
            completed: [],
            failed: [],
        };
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
        const job = { id: this.jobIdCounter++, data, retries: 0 };
        this.items.waiting.push(job);
        this.runQueue();
    }
    async runQueue() {
        if (this.isQueueProcessing)
            return;
        this.isQueueProcessing = true;
        while (this.items.waiting.length > 0) {
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
                    if (job.retries < 2)
                        this.items.waiting.unshift(job);
                    // Declare job as failed
                    else
                        this.onFailed(job, Date.now() - startTime);
                    // 
                }
                resolve("processed");
            }, processingTime);
        });
    }
    async dequeue(number) {
        return this.items.waiting.splice(0, number);
    }
    async isFull() {
        return this.items.waiting.length >= this.maxItems;
    }
    async getLength() {
        return this.items.waiting.length;
    }
    async onComplete(job, duration) {
        this.items.completed.push(job);
        metrics_1.default.jobs_processed_total++;
        metrics_1.default.processing_times.push(duration);
        metrics_1.default.queue_current_length = this.items.waiting.length;
        Logger_1.default.log({
            type: "jobQueueProcess",
            jobId: job.id,
            status: "completed",
            data: job,
            duration: duration,
            queueLength: this.items.waiting.length,
        });
    }
    ;
    async onFailed(job, duration) {
        this.items.completed.push(job);
        metrics_1.default.jobs_processed_total++;
        metrics_1.default.processing_times.push(duration);
        metrics_1.default.queue_current_length = this.items.waiting.length;
        Logger_1.default.log({
            type: "jobQueueProcess",
            jobId: job.id,
            status: "failed",
            data: job,
            duration: duration,
            queueLength: this.items.waiting.length,
        });
    }
    ;
    set shutdown(val) {
        this.isShuttingDown = val;
    }
    ;
    async isQueueEmpty() {
        return !this.isQueueProcessing && !this.items.waiting.length;
    }
}
exports.default = Queue;
