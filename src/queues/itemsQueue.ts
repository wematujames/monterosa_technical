import Queue from "../utils/Queue";

// Job processor 
const processJob = async (job: IJob) => {
    throw new Error("not processed")
   await Promise.resolve(job); 
}

// Instantiate item queue
const itemsQueue = new Queue("items-queue", 2, processJob);

// Queue new job wrapper
const dispatchToItemsQueue = async (data: object) => {
    return await itemsQueue.enqueue(data);
}
// { id: 1, data: {}, retries: 0 },
// { id: 2, data: {}, retries: 0 },
// { id: 3, data: {}, retries: 0 },
// { id: 4, data: {}, retries: 0 }
export { itemsQueue as default, dispatchToItemsQueue };
