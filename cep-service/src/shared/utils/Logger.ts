import winston from 'winston'
import path from 'path'

const Logger = winston.createLogger({

    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
          filename: path.join(__dirname, '../../error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(__dirname, '../../info.log'),
          level: 'info'
        }),
    ],
});


export { Logger }
