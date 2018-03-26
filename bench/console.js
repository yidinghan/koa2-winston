/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const Benchmark = require('benchmark');

const stringify = require('../stringify');

const bench = new Benchmark('console', {
  initCount: 100,
  onCycle: event => console.log(String(event.target)),
  fn() {
    console.log(stringify({
      started_at: 1522078024245,
      duration: 388,
      level: 'info',
      message: 'HTTP get /ding',
      req: { headers: {}, url: '/ding', method: 'get' },
      res: {},
    }));
  },
  onComplete: complete =>
    console.log({ 'total ops/sec': complete.target.hz }),
});

bench.run();
