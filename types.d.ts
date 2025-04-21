interface IJob {
    id: string | number;
    data: object;
    err?: object;
    retries: number;
}

interface JobItems {
    waiting: IJob[];
    completed: IJob[];
    failed: IJob[];
}

type JobType = "waiting" |
    "active" |
    "delayed" |
    "paused" |
    "completed" |
    "failed";