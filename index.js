/* eslint no-param-reassign: 0 */
const winston = require('winston');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');
const onFinished = require('on-finished');
const { format } = require('util');

const stringify = require('./stringify');

const {
  createLogger,
  format: { combine: wfcombine, printf: wfprintf },
} = winston;

/**
 * clone object
 *
 * @param {*} obj
 */
const clone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const copycat = {};
  Object.keys(obj).forEach((key) => {
    copycat[key] = clone(obj[key]);
  });

  return copycat;
};

/**
 * keysRecorder
 * use ldoash pick, get and set to collect data from given target object
 *
 * @param {Object} payload - input arguments
 * @param {string[]} [payload.defaults] - default keys will be collected
 * @param {string[]} [payload.selects] - keys will be collected as
 * additional part
 * @param {string[]} [payload.unselects] - keys that will be ignored at last
 * @return {function} closure function, setting by given payload
 * @example
 * // without payload
 * const recorder = keysRecorder();
 * recorder() // {}
 * recorder({ foo: 1, bar: 2, foobar: { a: 3, b: 4 } }) // {}
 *
 * // with defaults
 * const recorder = keysRecorder({ defaults: ['foo'] });
 * recorder() // {}
 * recorder({ foo: 1, bar: 2, foobar: { a: 3, b: 4 } }) // { foo: 1 }
 *
 * // with defaults and selects
 * const recorder = keysRecorder({ defaults: ['foo'], selects: ['foobar'] });
 * recorder() // {}
 * recorder({
 *   foo: 1,
 *   bar: 2,
 *   foobar: { a: 3, b: 4 }
 * }) // { foo: 1, foobar: { a: 3, b: 4 } }
 *
 * // with defaults and unselects
 * const recorder = keysRecorder({ defaults: ['foobar'], unselects: ['foobar.a'] });
 * recorder() // {}
 * recorder({
 *   foo: 1,
 *   bar: 2,
 *   foobar: { a: 3, b: 4 }
 * }) // { foobar: { a: 3 } }
 *
 * // with defaults and selects and unselects
 * const recorder = keysRecorder({
 *   defaults: ['foo'],
 *   selects: ['foobar'],
 *   unselects: ['foobar.b'],
 * });
 * recorder() // {}
 * recorder({
 *   foo: 1,
 *   bar: 2,
 *   foobar: { a: 3, b: 4 }
 * }) // { foo: 1, foobar: { a: 3 } }
 */
const keysRecorder = (payload = {}) => {
  const { defaults = [], selects = [], unselects = [] } = payload;

  const finalSelects = defaults.concat(selects);
  return (target) => {
    if (!target) {
      return {};
    }

    let logObject = {};
    finalSelects.forEach((path) => {
      set(logObject, path, get(target, path));
    });
    if (unselects.length) {
      logObject = clone(logObject);
      unselects.forEach((path) => {
        unset(logObject, path);
      });
    }

    return logObject;
  };
};

const serializer = {
  req: (payload) => {
    const {
      reqUnselect = ['headers.cookie'],
      reqSelect = [],
      reqKeys = [
        'headers',
        'url',
        'method',
        'httpVersion',
        'href',
        'query',
        'length',
      ],
    } = payload;

    return keysRecorder({
      defaults: reqKeys,
      selects: reqSelect,
      unselects: reqUnselect,
    });
  },
  res: (payload) => {
    const {
      resUnselect = [],
      resSelect = [],
      resKeys = ['headers', 'status'],
    } = payload;

    return keysRecorder({
      defaults: resKeys,
      selects: resSelect,
      unselects: resUnselect,
    });
  },
};

const getLogLevel = (statusCode = 200, defaultLevel = 'info') => {
  switch (Math.floor(statusCode / 100)) {
    case 5:
      return 'error';
    case 4:
      return 'warn';
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
 * @param {string} [payload.reqKeys=['headers','url','method','httpVersion', 'href', 'query', 'length']] - default request fields to be logged
 * @param {string} [payload.reqSelect=[]] - additional request fields to be logged
 * @param {string} [payload.reqUnselect=['headers.cookie']] - request field will be removed from the log
 * @param {string} [payload.resKeys=['headers', 'status']] - default response fields to be logged
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
 * //     "headers": {
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
 * //     "headers": {
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
    level: defaultLevel = 'info',
    msg = 'HTTP %s %s',
  } = payload;

  const winstonLogger = payload.logger
    || createLogger({
      transports,
      format: wfcombine(wfprintf(stringify)),
    });
  const reqSerializer = serializer.req(payload);
  const resSerializer = serializer.res(payload);

  const onResponseFinished = (ctx, info) => {
    info.res = resSerializer(ctx.response);
    info.duration = Date.now() - info.started_at;

    info.level = getLogLevel(info.res.status, defaultLevel);
    // @ts-ignore
    winstonLogger.log(info);
  };

  return async (ctx, next) => {
    const info = { req: reqSerializer(ctx.request), started_at: Date.now() };
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
  keysRecorder,
  serializer,
  getLogLevel,
  stringify,
};
