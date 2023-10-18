const test = require('ava');

const { generateSchema } = require('../stringify_schema');

test('default schema on definitions', (t) => {
  const schema = generateSchema({});
  t.deepEqual(schema.definitions, {
    req: {
      type: 'object',
      properties: {
        header: {
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
      type: 'object',
      properties: {
        header: { type: 'object', additionalProperties: { type: 'string' } },
        status: { type: 'string' },
      },
    },
  });
});

test('unselect res.body.success should not work', (t) => {
  const schema = generateSchema({ resUnselect: ['body.success'] });
  t.deepEqual(schema.definitions, {
    req: {
      type: 'object',
      properties: {
        header: {
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
      type: 'object',
      properties: {
        header: { type: 'object', additionalProperties: { type: 'string' } },
        status: { type: 'string' },
      },
    },
  });
});

test('unselect res.status should not work', (t) => {
  const schema = generateSchema({
    reqKeys: [],
    resKeys: [],
    resUnselect: ['status'],
  });
  t.deepEqual(schema.definitions, {
    req: { type: 'object', properties: {} },
    res: { type: 'object', properties: {} },
  });
});
