const { test } = require('ava');
const { generateSchema } = require('../stringify_schema');

test('should get default schema on definitions', (t) => {
  const schema = generateSchema({});
  t.deepEqual(schema, {
    title: 'koa2-winston-info',
    definitions: {
      req: {
        properties: {
          headers: {
            type: 'object',
            additionalProperties: { type: 'string' },
            properties: { cookie: { type: 'null' } },
          },
          url: { type: 'string' },
          method: { type: 'string' },
          httpVersion: { type: 'string' },
          href: { type: 'string' },
          query: { type: 'object', additionalProperties: { type: 'string' } },
          length: { type: 'integer' },
        },
      },
      res: {
        properties: {
          headers: { type: 'object', additionalProperties: { type: 'string' } },
          status: { type: 'string' },
        },
      },
    },
    type: 'object',
    properties: {
      started_at: { type: 'integer' },
      duration: { type: 'integer' },
      level: { type: 'string' },
      message: { type: 'string' },
      req: { $ref: '#/definitions/req' },
      res: { $ref: '#/definitions/res' },
    },
  });
});
