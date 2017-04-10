const winston = require('winston');
const omit = require('lodash.omit');

exports.serializer = {
  req: (payload) => {
    const {
      headersIgnore = ['cookie'],
    } = payload;

    return (req) => {
      const headers = omit(req.headers || {}, headersIgnore);
      const url = req.url;

      return {
        headers,
        url,
      };
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

