/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const Benchmark = require('benchmark');
const FastJsonConsole = require('../fast_json_console');
const stringify = require('../stringify');
const winston = require('winston');
const EventEmitter = require('events');

const { logger } = require('../');

const stringifyMW = logger({
  transports: [new FastJsonConsole({ stringify })],
});
const consoleMW = logger({
  transports: [new winston.transports.Console({ json: true, stringify: true })],
});

const suite = new Benchmark.Suite();

const getOptions = name => ({
  initCount: 100,
  defer: true,
  onCycle: event => console.log(String(event.target)),
  onComplete: complete =>
    console.log({
      [`${name} total ops/sec`]: parseInt(complete.target.hz, 10),
    }),
});

suite
  .add(
    'console',
    async (deferred) => {
      const event = new EventEmitter();
      await consoleMW(
        {
          request: {
            method: 'get',
            url: '/ding',
            headers: {
              cookie: 'ding',
            },
          },
          response: event,
        },
        () => event.emit('end'),
      );
      deferred.resolve();
    },
    getOptions('console'),
  )
  .add(
    'stringify',
    async (deferred) => {
      const event = new EventEmitter();
      await stringifyMW(
        {
          request: {
            method: 'get',
            url: '/ding',
            headers: {
              cookie: 'ding',
            },
          },
          response: event,
        },
        () => event.emit('end'),
      );
      deferred.resolve();
    },
    getOptions('stringify'),
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
