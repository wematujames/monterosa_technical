import Queue from "../utils/Queue";

// Job processor 
const processJob = async (job: IJob) => {
   await Promise.resolve(job); 
}

// Instantiate item queue
const itemsQueue = new Queue("items-queue", 2, processJob);

// Queue new job wrapper
const dispatchToItemsQueue = async (data: object) => {
    return await itemsQueue.enqueue(data);
}

export { itemsQueue as default, dispatchToItemsQueue };
