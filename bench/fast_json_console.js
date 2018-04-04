/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const Benchmark = require('benchmark');
const winston = require('winston');
const assign = require('lodash.assign');
const FastJsonConsole = require('../fast_json_console');
const stringify = require('../stringify');

const suite = new Benchmark.Suite();

const getOptions = name => ({
  initCount: 100,
  onCycle: ({ target }) => console.log(String(target)),
  onComplete: ({ target: { hz } }) =>
    console.log('total ops/sec', { [name]: parseInt(hz, 10) }),
});

const TEST_LOG = {
  started_at: 1522078024245,
  duration: 388,
  req: { headers: {}, url: '/ding', method: 'get' },
  res: {},
};

const defaultLogger = new winston.Logger({
  transports: [new FastJsonConsole()],
});
const schemastringifyLogger = new winston.Logger({
  transports: [new FastJsonConsole({ stringify })],
});
const loassignLogger = new winston.Logger({
  transports: [new FastJsonConsole({ assign })],
});
const loschemaLogger = new winston.Logger({
  transports: [new FastJsonConsole({ assign, stringify })],
});

suite
  .add(
    'warmup',
    () => defaultLogger.info('test', TEST_LOG),
    getOptions('warmup'),
  )
  .add(
    'default',
    () => defaultLogger.info('test', TEST_LOG),
    getOptions('default'),
  )
  .add(
    'loassign',
    () => loassignLogger.info('test', TEST_LOG),
    getOptions('loassign'),
  )
  .add(
    'schemastringify',
    () => schemastringifyLogger.info('test', TEST_LOG),
    getOptions('schemastringify'),
  )
  .add(
    'loschema',
    () => loschemaLogger.info('test', TEST_LOG),
    getOptions('loschema'),
  )
  .run();
