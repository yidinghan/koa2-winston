const winston = require('winston');
const get = require('lodash.get');
const set = require('lodash.set');
const unset = require('lodash.unset');
const pick = require('lodash.pick');

exports.keysRecorder = (payload = {}) => {
  const {
    defaults = [],
    whitelist = [],
    blacklist = [],
  } = payload;

  return (target) => {
    const logObject = pick(target, defaults);

    whitelist.forEach((path) => {
      set(logObject, path, get(target, path));
    });
    blacklist.forEach((path) => {
      set(logObject, path, get(target, path));
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

