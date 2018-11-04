const set = require('lodash.set');
const get = require('lodash.get');

const defaultReqSchema = {
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
};

const defaultResSchema = {
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
};

const defaultInfoSchema = {
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
};

const DOT_RE = /\./;
/**
 * @param {string} path
 */
const asJsonSchemaPath = path => path.replace(DOT_RE, '.properties.');

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
  const {
    reqUnselect = ['headers.cookie'],
    reqSelect = [],
    reqKeys = [
      'headers',
      'url',
      'method',
      'httpVersion',
      'href',
      'query',
      'length',
    ],
    resUnselect = [],
    resSelect = [],
    resKeys = ['headers', 'status'],
  } = payload;

  const reqSchema = {};
  reqKeys
    .concat(reqSelect)
    .map(asJsonSchemaPath)
    .map(path => `properties.${path}`)
    .forEach((path) => {
      set(reqSchema, path, get(defaultReqSchema, path, {}));
    });
  reqUnselect
    .map(asJsonSchemaPath)
    .map(path => `properties.${path}`)
    .forEach((path) => {
      set(reqSchema, path, { type: 'null' });
    });
  defaultInfoSchema.definitions.req = reqSchema;

  const resSchema = {};
  resKeys
    .concat(resSelect)
    .map(asJsonSchemaPath)
    .map(path => `properties.${path}`)
    .forEach((path) => {
      set(resSchema, path, get(defaultResSchema, path, {}));
    });
  resUnselect
    .map(asJsonSchemaPath)
    .map(path => `properties.${path}`)
    .forEach((path) => {
      set(resSchema, path, { type: 'null' });
    });
  defaultInfoSchema.definitions.res = resSchema;

  return defaultInfoSchema;
};

module.exports = { defaultInfoSchema, generateSchema };
