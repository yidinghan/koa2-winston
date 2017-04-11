const winston = require('winston');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');
const pick = require('lodash.pick');

/**
 * keysRecorder
 * use ldoash pick, get and set to collect data from given target object
 *
 * @param {object} payload - input arguments
 * @param {string[]} [payload.defaults] - default keys will be collected
 * @param {string[]} [payload.whitelist] - keys will be collected as
 * additional part
 * @param {string[]} [payload.blacklist] - keys that will be ignored at last
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
 * // with defaults and whitelist
 * const recorder = keysRecorder({ defaults: ['foo'], whitelist: ['foobar'] });
 * recorder() // {}
 * recorder({
 *   foo: 1,
 *   bar: 2,
 *   foobar: { a: 3, b: 4 }
 * }) // { foo: 1, foobar: { a: 3, b: 4 } }
 *
 * // with defaults and blacklist
 * const recorder = keysRecorder({ defaults: ['foobar'], blacklist: ['foobar.a'] });
 * recorder() // {}
 * recorder({
 *   foo: 1,
 *   bar: 2,
 *   foobar: { a: 3, b: 4 }
 * }) // { foobar: { a: 3 } }
 *
 * // with defaults and whitelist and blacklist
 * const recorder = keysRecorder({
 *   defaults: ['foo'],
 *   whitelist: ['foobar'],
 *   blacklist: ['foobar.b'],
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
    whitelist = [],
    blacklist = [],
  } = payload;

  return (target) => {
    if (!target) { return {}; }

    const logObject = pick(target, defaults);
    whitelist.forEach((path) => {
      set(logObject, path, get(target, path));
    });
    blacklist.forEach((path) => {
      unset(logObject, path, get(target, path));
    });

    return logObject;
  };
};

exports.serializer = {
  req: (payload) => {
    const {
      reqIgnores = ['headers.cookie'],
      reqkeys = ['headers', 'url', 'method', 'httpVersion', 'originalUrl', 'query'],
    } = payload;

    return (req) => {
      const logObject = pick(req, reqkeys);
      reqIgnores.forEach(unset.bind(unset, logObject));

      return logObject;
    };
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

