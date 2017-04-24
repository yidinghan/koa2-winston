const winston = require('winston');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');

/**
 * kong request and respone logger example
 * {
 *     "request": {
 *         "method": "GET",
 *         "uri": "/get",
 *         "size": "75",
 *         "request_uri": "http://httpbin.org:8000/get",
 *         "querystring": {},
 *         "headers": {
 *             "host": "httpbin.org",
 *             "user-agent": "curl/7.37.1"
 *         }
 *     },
 *     "response": {
 *         "status": 200,
 *         "size": "434",
 *         "headers": {
 *             "Content-Length": "197",
 *             "via": "kong/0.3.0",
 *             "Connection": "close",
 *             "access-control-allow-credentials": "true",
 *             "Content-Type": "application/json",
 *             "server": "nginx",
 *             "access-control-allow-origin": "*"
 *         }
 *     },
 *     "authenticated_entity": {
 *         "consumer_id": "80f74eef-31b8-45d5-c525-ae532297ea8e",
 *         "id": "eaa330c0-4cff-47f5-c79e-b2e4f355207e",
 *     },
 *     "api": {
 *         "created_at": 1488830759000,
 *         "hosts": [
 *           "example.org"
 *         ],
 *         "http_if_terminated": true,
 *         "https_only": false,
 *         "id": "6378122c-a0a1-438d-a5c6-efabae9fb969",
 *         "name": "example-api",
 *         "preserve_host": false,
 *         "retries": 5,
 *         "strip_uri": true,
 *         "upstream_connect_timeout": 60000,
 *         "upstream_read_timeout": 60000,
 *         "upstream_send_timeout": 60000,
 *         "upstream_url": "http://httpbin.org"
 *     },
 *     "latencies": {
 *         "proxy": 1430,
 *         "kong": 9,
 *         "request": 1921
 *     },
 *     "started_at": 1433209822425,
 *     "client_ip": "127.0.0.1"
 * }
 */

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
      reqKeys = ['headers', 'url', 'method', 'httpVersion', 'href', 'query', 'length'],
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
      started_at: Date.now(),
    };
    meta.req.url = ctx.url;
    const msg = 'msg';

    await next();

    logger[level](msg, meta);
  };
};
