const winston = require('winston');
const path = require('path');

const log = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
        })
    ]
});

module.exports = { log }