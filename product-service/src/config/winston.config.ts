import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as path from 'path';
import * as fs from 'fs';

// 确保日志目录存在
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志级别
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

// 创建winston日志记录器
export const winstonLogger: Logger = createLogger({
  level: process.env.LOG_LEVEL || LogLevel.INFO,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'product-service' },
  transports: [
    // 控制台输出
    new transports.Console({
      format: format.combine(
        format.colorize(),
        nestWinstonModuleUtilities.format.nestLike('ProductService', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
});

// 只在非测试环境下添加文件transports
if (process.env.NODE_ENV !== 'test') {
  // 错误级别日志文件，按天轮转
  winstonLogger.add(new (require('winston-daily-rotate-file'))({
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: LogLevel.ERROR,
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json(),
    ),
  }));
  
  // 所有级别日志文件，按天轮转
  winstonLogger.add(new (require('winston-daily-rotate-file'))({
    filename: path.join(logDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json(),
    ),
  }));
}

// 此文件已废弃，配置已移到LoggerModule中
export {};
