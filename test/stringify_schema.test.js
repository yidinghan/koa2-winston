const { test } = require('ava');
const { generateSchema } = require('../stringify_schema');

test('default schema on definitions', (t) => {
  const schema = generateSchema({});
  t.deepEqual(schema.definitions, {
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
  });
});

test('res.body.success as type:null', (t) => {
  const schema = generateSchema({ resUnselect: ['body.success'] });
  t.deepEqual(schema.definitions, {
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
        body: { type: 'object', properties: { success: { type: 'null' } } },
      },
    },
  });
});
