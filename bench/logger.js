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
      request: {},
      response: event,
    }, () => event.emit('end'));
    deferred.resolve();
  },
});

bench.run();

// middleware x 41,182 ops/sec ±4.19% (21 runs sampled)
