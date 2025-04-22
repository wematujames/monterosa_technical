import { dispatchToItemsQueue } from "../../queues/itemsQueue";

const sendItemToQueue = async function (item: any) {
    return await dispatchToItemsQueue(item);
}

export default { sendItemToQueue };