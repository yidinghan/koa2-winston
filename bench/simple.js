/* eslint no-console: 0 */
/* eslint max-len: ["error", 100] */
/* eslint import/no-extraneous-dependencies: 0 */
const Benchmark = require('benchmark');
const EventEmitter = require('events');

const { logger } = require('../');

const middleware = logger();
const suite = new Benchmark.Suite();
const getOptions = (name, defer = true) => ({
  initCount: 100,
  defer,
  onComplete: ({ target: { hz } }) => console.log('total ops/sec', { [name]: parseInt(hz, 10) }),
});

suite
  .add(
    'middleware',
    async (deferred) => {
      const event = new EventEmitter();
      await middleware(
        {
          request: {
            method: 'get',
            url: '/ding',
            header: {
              cookie: 'ding',
            },
          },
          response: event,
        },
        () => event.emit('end'),
      );
      deferred.resolve();
    },
    getOptions('middleware'),
  )
  .run();
