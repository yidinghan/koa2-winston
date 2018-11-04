const set = require('lodash.set');
const get = require('lodash.get');
const mapvalues = require('lodash.mapvalues');

const defaultSchemas = {
  res: {
    title: 'koa2-winston-info-res',
    type: 'object',
    properties: {
      headers: {
        type: 'object',
        additionalProperties: { type: 'string' },
      },
      status: { type: 'string' },
      body: {
        type: 'object',
        additionalProperties: true,
      },
    },
  },
  req: {
    title: 'koa2-winston-info-req',
    type: 'object',
    properties: {
      headers: {
        type: 'object',
        additionalProperties: { type: 'string' },
      },
      url: { type: 'string' },
      method: { type: 'string' },
      href: { type: 'string' },
      query: {
        type: 'object',
        additionalProperties: { type: 'string' },
      },
      origin: { type: 'string' },
      originalUrl: { type: 'string' },
      path: { type: 'string' },
      querystring: { type: 'string' },
      search: { type: 'string' },
      hostname: { type: 'string' },
      URL: { type: 'string' },
      type: { type: 'string' },
      charset: { type: 'string' },
      protocol: { type: 'string' },
      secure: { type: 'string' },
      ip: { type: 'string' },
      httpVersion: { type: 'string' },
      length: { type: 'integer' },
    },
  },
  info: {
    title: 'koa2-winston-info',
    definitions: {
      req: {},
      res: {},
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
  },
};

const DOT_RE = /\./g;
/**
 * @param {string} path
 */
const asJsonSchemaPath = path => path.replace(DOT_RE, '.properties.');

/**
 * @param {object} schema - generated json schema
 */
const ensureTypeObject = schema => mapvalues(schema, (value) => {
  if (!value.properties) {
    return value;
  }
  // eslint-disable-next-line no-param-reassign
  value.type = 'object';
  return ensureTypeObject(value);
});

/**
 * @param {string[]} keys - schema keys
 */
const schemaKeysHandler = (keys, handler) => keys
  .map(asJsonSchemaPath)
  .map(path => `properties.${path}`)
  .map(handler);

const schemaKeysHandlers = ({
  keys, select, unselect, schema,
}) => {
  const reqSchema = {};
  schemaKeysHandler(keys.concat(select), (path) => {
    set(reqSchema, path, get(schema, path, {}));
  });
  schemaKeysHandler(unselect, (path) => {
    set(reqSchema, path, { type: 'null' });
  });
  return reqSchema;
};

/**
 * logger middleware for koa2 use winston
 *
 * @param {object} [payload={}] - input arguments
 * @param {string[]} [payload.reqKeys=['headers','url','method','httpVersion', 'href', 'query', 'length']] - default request fields to be logged
 * @param {string[]} [payload.reqSelect=[]] - additional request fields to be logged
 * @param {string[]} [payload.reqUnselect=['headers.cookie']] - request field will be removed from the log
 * @param {string[]} [payload.resKeys=['headers', 'status']] - default response fields to be logged
 * @param {string[]} [payload.resSelect=[]] - additional response fields to be logged
 * @param {string[]} [payload.resUnselect=[]] - response field will be removed from the log
 */
const generateSchema = (payload) => {
  const options = Object.assign(
    {
      reqUnselect: ['headers.cookie'],
      reqSelect: [],
      reqKeys: [
        'headers',
        'url',
        'method',
        'httpVersion',
        'href',
        'query',
        'length',
      ],
      resUnselect: [],
      resSelect: [],
      resKeys: ['headers', 'status'],
    },
    payload,
  );

  const { info: infoSchema } = defaultSchemas;
  ['req', 'res'].forEach((prefix) => {
    infoSchema.definitions[prefix] = schemaKeysHandlers({
      keys: options[`${prefix}Keys`],
      select: options[`${prefix}Select`],
      unselect: options[`${prefix}Unselect`],
      schema: defaultSchemas[prefix],
    });
  });

  return infoSchema;
};

module.exports = { defaultSchemas, generateSchema, asJsonSchemaPath };
