/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const Benchmark = require('benchmark');
const winston = require('winston');
const FastJsonConsole = require('../fast_json_console');
const stringify = require('../stringify');

const schemastringifyLogger = new winston.Logger({
  transports: [new FastJsonConsole({ stringify })],
});
const jsonstringifyLogger = new winston.Logger({
  transports: [new FastJsonConsole({ stringify: JSON.stringify })],
});
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

suite
  .add(
    'jsonstringify',
    () => jsonstringifyLogger.info('test', TEST_LOG),
    getOptions('jsonstringify'),
  )
  .add(
    'schemastringify',
    () => schemastringifyLogger.info('test', TEST_LOG),
    getOptions('schemastringify'),
  )
  .run();

// middleware x 41,182 ops/sec ±4.19% (21 runs sampled)

// node 8.2
// middleware x 80,848 ops/sec ±8.30% (17 runs sampled)

// node 8.4
// middleware x 107,464 ops/sec ±7.99% (19 runs sampled)

// node 8.10
// with fast-json-stringify
// middleware x 132,868 ops/sec ±2.58% (19 runs sampled)
