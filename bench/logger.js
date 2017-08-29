/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const Benchmark = require('benchmark');
const EventEmitter = require('events');

const { logger } = require('../');

const middleware = logger();

const bench = new Benchmark('middleware', {
  defer: true,
  onCycle: event => console.log(String(event.target)),
  async fn(deferred) {
    const event = new EventEmitter();
    await middleware({
      request: {
        method: 'get',
        url: '/ding',
        headers: {
          cookie: 'ding',
        },
      },
      response: event,
    }, () => event.emit('end'));
    deferred.resolve();
  },
});

bench.run();

// middleware x 41,182 ops/sec ±4.19% (21 runs sampled)

// node 8.2
// middleware x 80,848 ops/sec ±8.30% (17 runs sampled)

// node 8.4
// middleware x 107,464 ops/sec ±7.99% (19 runs sampled)
