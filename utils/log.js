const winston = require('winston');
const path = require('path');

let logFile = process.env.LOG_FILE ? process.env.LOG_FILE : "./ghrum.log";
let maxLogSize = process.env.MAX_LOG_SIZE ? int(process.env.MAX_LOG_SIZE) : 10000000;
let maxLogFiles = process.env.MAX_LOG_FILES ? int(process.env.MAX_LOG_FILES) : 5;

const log = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            level: "info",
            filename: logFile,
            maxsize: maxLogSize,
            maxFiles: maxLogFiles,
            tailable: true,
            zippedArchive: true,
            json: true,
            timestamp: true
        })
    ]
});

module.exports = { log }