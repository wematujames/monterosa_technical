import Queue from "../utils/Queue";
import redisClient from "../config/redisClient";

describe("Queue", () => {
  let queue: Queue;
  const maxLength = 5;

  beforeEach(async () => {
    // Flush Redis for test isolation
    const client = await redisClient.connect();
    await client.flushAll();

    queue = new Queue("test-queue", 2, async (job) => {
      return Promise.resolve(`Processed ${job.id}`);
    }, maxLength);
  });

  // Test: add job item to queue
  test("should add job to queue", async () => {
    await queue.enqueue({ foo: "bar" });
    const length = await queue.getLength();
    expect(length).toBe(1);
  });

  // Test: process job item in queue
  test("should dequeue and process job", async () => {
    await queue.enqueue({ "task": "Queue something" });

    // Delay for queue to process item
    await new Promise((r) => setTimeout(r, 600));

    const isEmpty = await queue.isQueueEmpty();

    expect(isEmpty).toBe(true);
  });

    /* Test: Prevent enqueuing on queue 
     full for rate limiting */
  test("should report queue full", async () => {
    for (let i = 0; i < maxLength + 1; i++) {
      try {
        await queue.enqueue({ item: i });
      } catch (err) {

        const isFull = await queue.isFull();
        expect(isFull).toBe(true);
        break;
      }
    }
  });
});
