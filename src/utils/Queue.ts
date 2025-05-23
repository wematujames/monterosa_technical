import redisClient from "../config/redisClient";
import ErrorResponse from "./ErrorResponse";
import logger from "./Logger";
import metrics from "../utils/Metrics";

class Queue {
    private jobIdCounter: number = 1;
    private name: string = "queue";
    private concurrency: number = 1;
    private executor: (job: IJob) => Promise<any>;
    private isQueueProcessing: boolean = false;
    private maxItems: number = 5;
    private isShuttingDown: boolean = false;

    constructor(
        name: string, 
        concurrency: number,
        executor: (job: IJob) => Promise<any>,
        maxItems?: number,
    ) {
        this.name = name;
        this.concurrency = concurrency;

        if (maxItems) this.maxItems = maxItems;

        this.executor = executor;

        // initial call to process to items
        this.runQueue();
    }

    async enqueue(data: object) {
        if (this.isShuttingDown) {
            throw new ErrorResponse(
                500, "processExiting", 
                "Process exiting"
            );
        };

        const isQueueFull = await this.isFull();

        if (isQueueFull) {
            // metrics.http_responses_429_total++;
            await metrics.increaseMetric("http429Total");
            throw new ErrorResponse(
                429,
                "queueFull",
                "Queue is full.Cannot enqueue more tasks"
            );
        }

        // metrics.queue_current_length++;
        await metrics.increaseMetric("queueLength");

        const job: IJob = { id: this.jobIdCounter++, data, retries: 0 }

        // add item to redis queue
        const client = await redisClient.connect();
        await client.rPush(`${this.name}:waiting`, JSON.stringify(job));
        
        // Ensure queue is processing items
        this.runQueue();

        // setInterval(() => {
        //     console.log("is processing", this.isQueueProcessing);
        // }, 500);
    }

    async runQueue() {
        if (this.isQueueProcessing) return;

        if (await this.getLength() > 0) {
            this.isQueueProcessing = true;
        }

        while ((await this.getLength()) > 0) {
            const itemsToProcess = await this.dequeue(this.concurrency);

            const promises = itemsToProcess.map(item => {
                return this.processJob(item)
            });

            await Promise.all(promises);
        }

        this.isQueueProcessing = false;
    }

    async processJob(job: IJob) {
        const startTime = Date.now();

        const processingTime = Math.floor(Math.random() * (300 - 100 + 1)) + 100;

        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    await this.executor(job);

                    // Push item to completed items
                    this.onComplete(job, Date.now() - startTime)
                } catch (err) {
                    job.retries++;

                    // Push item back to waiting job for retry
                    if (job.retries < 2) {
                        const client = await redisClient.connect();
                        await client.rPush(`${this.name}:waiting`, JSON.stringify(job));
                    }
                    // Declare job as failed
                    else this.onFailed(job, Date.now() - startTime);
                }

                resolve("processed");
            }, processingTime);
        });
    }

    async dequeue (number: number): Promise<IJob[]> {
        const client = await redisClient.connect();
        const dequeued = [];

        for (let i = 0; i < number; i++) {
            const job = await client.lPop(this.name + ":waiting");
            if (!job) break;
            dequeued.push(JSON.parse(job));
        }

        return dequeued;
    }

    async onComplete (job: IJob, duration: number) {
        const client = await redisClient.connect();
        const currentJobsLength = await client.lLen(this.name + ":waiting");

        await client.rPush(`${this.name}:completed`, JSON.stringify(job));
        await metrics.increaseMetric("processedJobsTotal") //jobs_processed_total++;
        await metrics.addDuration(duration) //processing_times.push(duration);
        await metrics.setLength(currentJobsLength) //queue_current_length = currentJobsLength

        logger.log({
            type: "jobQueueProcess",
            jobId: job.id,
            status: "completed",
            data: job,
            duration: duration,
            queueLength: currentJobsLength
        });
    };

    async onFailed (job: IJob, duration: number) {
        const client = await redisClient.connect();
        const currentJobsLength = await client.lLen(this.name + ":waiting");

        await client.rPush(`${this.name}:failed`, JSON.stringify(job));
        await metrics.increaseMetric("processedJobsTotal") //jobs_processed_total++;
        await metrics.addDuration(duration) //processing_times.push(duration);
        await metrics.setLength(currentJobsLength) //queue_current_length = currentJobsLength

        logger.log({
            type: "jobQueueProcess",
            jobId: job.id,
            status: "failed",
            data: job,
            duration: duration,
            queueLength: currentJobsLength
        });
    };

    set shutdown(val: boolean) {
        this.isShuttingDown = val;
    };

    async isQueueEmpty ()  {
        const client = await redisClient.connect();
        
        const currentLength = await client.lLen(this.name + ":waiting");
        
        return !currentLength && !this.isQueueProcessing
    }

    async isFull () {
        const client = await redisClient.connect();
        
        const currentLength = await client.lLen(this.name + ":waiting");

        return currentLength >=this.maxItems;
    }

    async getLength () {
        const client = await redisClient.connect();

        return client.lLen(this.name + ":waiting");
    }
}

export default Queue;