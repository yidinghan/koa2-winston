const winston = require('winston');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');

/**
 * keysRecorder
 * use ldoash pick, get and set to collect data from given target object
 *
 * @param {object} payload - input arguments
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
exports.keysRecorder = (payload = {}) => {
  const {
    defaults = [],
    selects = [],
    unselects = [],
  } = payload;

  return (target) => {
    if (!target) { return {}; }

    const logObject = {};
    defaults.concat(selects).forEach((path) => {
      set(logObject, path, get(target, path));
    });
    unselects.forEach((path) => {
      unset(logObject, path, get(target, path));
    });

    return logObject;
  };
};

exports.serializer = {
  req: (payload) => {
    const {
      reqIgnores = ['headers.cookie'],
      reqKeys = ['headers', 'url', 'method', 'httpVersion', 'originalUrl', 'query'],
    } = payload;

    return exports.keysRecorder({
      defaults: reqKeys,
      unselects: reqIgnores,
    });
  },
};

exports.logger = (payload = {}) => {
  const {
    transports = [new winston.transports.Console({ json: true })],
    level = 'info',
  } = payload;

  const logger = payload.logger || new winston.Logger({
    transports,
  });
  const reqSerializer = exports.serializer.req(payload);

  return async (ctx, next) => {
    const meta = {
      req: reqSerializer(ctx.request),
    };
    meta.req.url = ctx.url;
    const msg = 'msg';

    await next();

    logger[level](msg, meta);
  };
};

