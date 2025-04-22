interface IJob {
    id: string | number;
    data: any;
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

interface ILogEvent {
    name: string,

    request?: {
        url: string;
        method: string; 
        headers: any;
        body: any;
    },
    response?: { statusCode: number }
    
    data?: any;
    
    timestamp: Date;
}