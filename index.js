/* eslint no-param-reassign: 0 */
const winston = require('winston');
const onFinished = require('on-finished');
const { format } = require('util');
const fastJson = require('fast-json-stringify');

const {
  generateSchema,
  generateFormat,
  defaultSchemas,
} = require('./stringify_schema');

const {
  createLogger,
  format: { combine: wfcombine, printf: wfprintf },
} = winston;

const C = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  MSG: 'HTTP %s %s',
};

const getLogLevel = (statusCode = 200, defaultLevel = C.INFO) => {
  switch (Math.floor(statusCode / 100)) {
    case 5:
      return C.ERROR;
    case 4:
      return C.WARN;
    default:
      return defaultLevel;
  }
};

/**
 * logger middleware for koa2 use winston
 *
 * @param {object} [payload={}] - input arguments
 * @param {object[]} [payload.transports=[new winston.transports.Stream({ stream: process.stdout })]] customize transports
 * @param {string} [payload.level='info'] - default log level of logger
 * @param {string} [payload.reqKeys=['header','url','method','httpVersion', 'href', 'query', 'length']] - default request fields to be logged
 * @param {string} [payload.reqSelect=[]] - additional request fields to be logged
 * @param {string} [payload.reqUnselect=['header.cookie']] - request field will be removed from the log
 * @param {string} [payload.resKeys=['header', 'status']] - default response fields to be logged
 * @param {string} [payload.resSelect=[]] - additional response fields to be logged
 * @param {string} [payload.resUnselect=[]] - response field will be removed from the log
 * @param {winston.transports.StreamTransportInstance} [payload.logger] - customize winston logger
 * @param {string} [payload.msg=HTTP %s %s] - customize log msg
 * @return {function} logger middleware
 * @example
 * const { logger } = require('koa2-winston');
 * app.use(logger());
 * // request logger look like down here
 * // {
 * //   "req": {
 * //     "header": {
 * //       "host": "127.0.0.1:59534",
 * //       "accept-encoding": "gzip, deflate",
 * //       "user-agent": "node-superagent/3.5.2",
 * //       "connection": "close"
 * //     },
 * //     "url": "/",
 * //     "method": "GET",
 * //     "href": "http://127.0.0.1:59534/",
 * //     "query": {}
 * //   },
 * //   "started_at": 1494486039864,
 * //   "res": {
 * //     "header": {
 * //       "content-type": "text/plain; charset=utf-8",
 * //       "content-length": "8"
 * //     },
 * //     "status": 200
 * //   },
 * //   "duration": 26,
 * //   "level": "info",
 * //   "message": "HTTP GET /"
 * // }
 */
const logger = (payload = {}) => {
  const {
    transports = [new winston.transports.Stream({ stream: process.stdout })],
    level: defaultLevel = C.INFO,
    msg = C.MSG,
  } = payload;

  // @ts-ignore
  const stringifyFormat = generateFormat(payload);
  const winstonLogger = payload.logger
    || createLogger({
      transports,
      format: wfcombine(wfprintf(stringifyFormat)),
    });

  const onResponseFinished = (ctx, info) => {
    info.res = ctx.response;
    info.duration = Date.now() - info.started_at;

    info.level = getLogLevel(info.res.status, defaultLevel);
    // @ts-ignore
    winstonLogger.log(info);
  };

  return async (ctx, next) => {
    const info = { req: ctx.request, started_at: Date.now() };
    info.message = format(msg, info.req.method, info.req.url);

    let error;
    try {
      await next();
    } catch (e) {
      // catch and throw it later
      error = e;
    } finally {
      onFinished(ctx.response, onResponseFinished.bind(null, ctx, info));
    }

    if (error) {
      throw error;
    }
  };
};

module.exports = {
  logger,
  getLogLevel,
  generateSchema,
  generateFormat,
  defaultSchemas,
};
