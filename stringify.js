const fastJson = require('fast-json-stringify');

const schema = {
  title: 'koa2 logger',
  type: 'object',
  properties: {
    duration: {
      type: 'integer',
    },
    lastName: {
      type: 'string',
    },
    age: {
      description: 'Age in years',
      type: 'integer',
    },
    reg: {
      type: 'string',
    },
  },
};

const stringify = fastJson(schema);

module.exports = stringify;
