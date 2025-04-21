"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(name, concurrency, executor) {
        this.jobIdCounter = 1;
        this.name = "queue";
        this.concurrency = 1;
        this.isQueueProcessing = false;
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
        this.executor = executor;
        // initial call to process to items
        this.runQueue();
    }
    enqueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = { id: this.jobIdCounter++, data, retries: 0 };
            this.items.waiting.push(job);
            this.runQueue();
        });
    }
    runQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isQueueProcessing)
                return;
            this.isQueueProcessing = true;
            while (this.items.waiting.length > 0) {
                const itemsToProcess = yield this.dequeue(this.concurrency);
                const promises = itemsToProcess.map(item => {
                    return this.processJob(item);
                });
                yield Promise.all(promises);
            }
            this.isQueueProcessing = false;
        });
    }
    processJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const processingTime = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
            return new Promise((resolve) => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.executor(job);
                        // Push item to completed items
                        this.items.completed.push(job);
                    }
                    catch (err) {
                        job.retries++;
                        // Push item back to waiting job for retry
                        if (job.retries < 2)
                            this.items.waiting.unshift(job);
                        // Declare job as failed
                        else
                            this.items.failed.push(job);
                    }
                    resolve("processed");
                    // console.log("this items", this.items);
                }), processingTime);
            });
        });
    }
    dequeue(number) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.items.waiting.splice(0, number);
        });
    }
    getLenOfQueuedJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.items.waiting.length;
        });
    }
    onComplete(hook) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    ;
    onFailed(hook) {
        return __awaiter(this, void 0, void 0, function* () {
            hook();
        });
    }
    ;
}
exports.default = Queue;
