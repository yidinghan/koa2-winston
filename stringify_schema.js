const set = require('lodash.set');
const get = require('lodash.get');
const mapvalues = require('lodash.mapvalues');
const clonedeep = require('lodash.clonedeep');
const fastJson = require('fast-json-stringify');

const PREFIXS = ['req', 'res'];

const defaultSchemas = {
  res: {
    title: 'koa2-winston-info-res',
    type: 'object',
    properties: {
      header: {
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
      header: {
        type: 'object',
        additionalProperties: { type: 'string' },
      },
      url: { type: 'string' },
      method: { type: 'string' },
      href: { type: 'string' },
      body: {
        type: 'object',
        additionalProperties: true,
      },
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
const asJsonSchemaPath = (path) => path.replace(DOT_RE, '.properties.');

/**
 * @param {object} schema - generated json schema
 */
const ensureTypeObject = (schema) => mapvalues(schema, (value) => {
  if (typeof value !== 'object') {
    return value;
  }
  if (value.properties) {
    // eslint-disable-next-line no-param-reassign
    value.type = 'object';
  }
  return ensureTypeObject(value);
});

/**
 * @callback schemaKeysHandlerFn
 * @param {string} path
 */

/**
 * @param {string[]} keys - schema keys
 * @param {schemaKeysHandlerFn} handler - assign path
 */
const schemaKeysHandler = (keys, handler) => keys
  .map(asJsonSchemaPath)
  .map((path) => `properties.${path}`)
  .map(handler);

const schemaKeysHandlers = ({
  keys, select, unselect, schema,
}) => {
  const outputSchema = { type: 'object', properties: {} };
  schemaKeysHandler(keys.concat(select), (path) => {
    set(outputSchema, path, get(schema, path, {}));
  });
  schemaKeysHandler(unselect, (path) => {
    const parentPath = path.match(DOT_RE).length > 2
      ? path
        .split('.')
        .slice(0, -2)
        .join('.')
      : path;
    if (!get(outputSchema, parentPath)) {
      return;
    }
    set(outputSchema, path, { type: 'null' });
  });
  return outputSchema;
};

/**
 * logger middleware for koa2 use winston
 *
 * @param {object} [payload={}] - input arguments
 * @param {string[]} [payload.reqKeys=['header','url','method','httpVersion', 'href', 'query', 'length']] - default request fields to be logged
 * @param {string[]} [payload.reqSelect=[]] - additional request fields to be logged
 * @param {string[]} [payload.reqUnselect=['header.cookie']] - request field will be removed from the log
 * @param {string[]} [payload.resKeys=['header', 'status']] - default response fields to be logged
 * @param {string[]} [payload.resSelect=[]] - additional response fields to be logged
 * @param {string[]} [payload.resUnselect=[]] - response field will be removed from the log
 */
const generateSchema = (payload) => {
  const options = {
    reqUnselect: ['header.cookie'],
    reqSelect: [],
    reqKeys: [
      'header',
      'url',
      'method',
      'httpVersion',
      'href',
      'query',
      'length',
    ],
    resUnselect: [],
    resSelect: [],
    resKeys: ['header', 'status'],
    ...payload,
  };

  const { info: infoSchema } = clonedeep(defaultSchemas);
  PREFIXS.forEach((prefix) => {
    infoSchema.definitions[prefix] = schemaKeysHandlers({
      keys: options[`${prefix}Keys`],
      select: options[`${prefix}Select`],
      unselect: options[`${prefix}Unselect`],
      schema: defaultSchemas[prefix],
    });
  });

  ensureTypeObject(infoSchema.definitions);
  return infoSchema;
};

const generateFormat = (payload) => {
  const schema = generateSchema(payload);
  const stringify = fastJson(schema);
  const keys = {
    req: Object.keys(schema.definitions.req.properties),
    res: Object.keys(schema.definitions.res.properties),
  };
  return (info) => {
    // enforce get properties from koa ctx.request/responseo
    // in koa, Request.toJSON only return ['method', 'url', 'header']
    // https://github.com/koajs/koa/blob/master/lib/request.js#L708
    PREFIXS.forEach((prefix) => {
      const prefixCopy = {};
      keys[prefix].forEach((key) => {
        prefixCopy[key] = info[prefix][key];
      });
      info[prefix] = prefixCopy;
    });

    const infoMsg = stringify(info);
    // rewrite info object as omit function
    Object.assign(info, JSON.parse(infoMsg));
    return infoMsg;
  };
};

module.exports = {
  defaultSchemas,
  generateSchema,
  generateFormat,
  asJsonSchemaPath,
};
