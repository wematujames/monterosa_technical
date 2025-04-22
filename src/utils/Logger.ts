import fs from 'fs';
import path from 'path';

class Logger { 
    private readonly filePath: string; 

    constructor (folderName: string, fileName: string) {
        const logFolderPath = path.join(__dirname, folderName);
        const logFilePath = path.join(
            logFolderPath, fileName + new Date().toDateString().replaceAll(" ", "-") + '.log'
        );

        this.filePath = logFilePath;
        
        // create logs folder if doesn't exists
        if (!fs.existsSync(logFolderPath)) {
            fs.mkdirSync(logFolderPath, { recursive: true });
        }
    }

    log(eventData: ILogEvent | any) {
        const log = {
            ...eventData,
            timestamp: new Date().toISOString(),
        };

        const line = JSON.stringify(log) + '\n';

        fs.appendFile(this.filePath, line, (err) => {
            if (err) {
                console.error('Failed to write log:', err);
            }
        });
    }
}

export default new Logger("../../logs", "logs");





