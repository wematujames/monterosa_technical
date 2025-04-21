

class Queue {
    private jobIdCounter: number = 1;
    private name: string = "queue";
    private concurrency: number = 1;
    private executor: (job: IJob) => Promise<any>;
    private isQueueProcessing: boolean = false;

    private items: JobItems = {
        waiting: [
            { id: 1, data: {}, retries: 0 },
            { id: 2, data: {}, retries: 0 },
            { id: 3, data: {}, retries: 0 },
            { id: 4, data: {}, retries: 0 }
        ],
        completed: [],
        failed: [],
    };

    constructor(
        name: string, 
        concurrency: number,
        executor: (job: IJob) => Promise<any>
    ) {
        this.name = name;
        this.concurrency = concurrency;

        this.executor = executor;

        // initial call to process to items
        this.runQueue();
    }

    async enqueue(data: object) {
        const job: IJob = { id: this.jobIdCounter++, data, retries: 0 }
        
        this.items.waiting.push(job);
        
        this.runQueue();
    }

    async runQueue() {
        if (this.isQueueProcessing) return;

        this.isQueueProcessing = true;

        while (this.items.waiting.length > 0) {
            const itemsToProcess = await this.dequeue(this.concurrency);

            const promises = itemsToProcess.map(item => {
                return this.processJob(item)
            });
            
            await Promise.all(promises);
        }

        this.isQueueProcessing = false;
    }

    async processJob(job: IJob) {
        const processingTime = Math.floor(Math.random() * (300 - 100 + 1)) + 100;

        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    await this.executor(job);

                    // Push item to completed items
                    this.items.completed.push(job);
                } catch (err) {
                    job.retries++;

                    // Push item back to waiting job for retry
                    if (job.retries < 2) this.items.waiting.unshift(job);

                    // Declare job as failed
                    else this.items.failed.push(job);
                }

                resolve("processed");
                // console.log("this items", this.items);
            }, processingTime);
        });
    }

    async dequeue (number: number): Promise<IJob[]> {
        return this.items.waiting.splice(0, number);
    }

    async getLenOfQueuedJobs () {
        return this.items.waiting.length;
    }

    async onComplete (hook: () => Promise<any>  ) {};

    async onFailed (hook: () => Promise<any>  ) {
        hook();
    };
}

export default Queue;