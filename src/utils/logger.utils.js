import winston from 'winston';
import path from 'path';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const options = {
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    // winston.format.json(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.splat(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
    ),
  ),

  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      handleExceptions: true,
    }),
    new winston.transports.File({
      // filename: 'debug.log',
      filename: path.join(__dirname, '../debug/debug.log'),
      level: 'debug',
    }),
  ],
};

const logger = winston.createLogger(options);

// create a stream object with a 'write' function that will be used by `morgan`
const stream = {
  write: (message) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export { logger, stream };
