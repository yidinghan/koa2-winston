const fastJson = require('fast-json-stringify');

const schema = {
  title: 'koa2 logger',
  type: 'object',
  properties: {
    started_at: { type: 'integer' },
    duration: { type: 'integer' },
    level: { type: 'string' },
    message: { type: 'string' },
    req: {
      type: 'object',
      additionalProperties: true,
    },
    res: {
      type: 'object',
      additionalProperties: true,
    },
  },
};

const stringify = fastJson(schema);

module.exports = stringify;
