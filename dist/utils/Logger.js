"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOGS_FOLDER = "logs";
const LOGS_FILE_NAME = "";
class Logger {
    constructor(folderName, fileName) {
        const logFolderPath = path_1.default.join(__dirname, folderName);
        const logFilePath = path_1.default.join(logFolderPath, fileName + new Date().toDateString().replaceAll(" ", "-") + '.log');
        this.filePath = logFilePath;
        // create logs folder if doesn't exists
        if (!fs_1.default.existsSync(logFolderPath)) {
            fs_1.default.mkdirSync(logFolderPath, { recursive: true });
        }
    }
    log(eventData) {
        const log = {
            ...eventData,
            timestamp: new Date().toISOString(),
        };
        const line = JSON.stringify(log) + '\n';
        fs_1.default.appendFile(this.filePath, line, (err) => {
            if (err) {
                console.error('Failed to write log:', err);
            }
        });
    }
}
exports.default = new Logger("../../logs", "logs");
