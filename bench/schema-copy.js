/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
const Benchmark = require('benchmark');
const fastJson = require('fast-json-stringify');

const suite = new Benchmark.Suite();

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: {
      type: 'object',
      properties: {
        c: { type: 'number' },
        d: { type: 'string' },
        e: {
          type: 'object',
          properties: {
            f: { type: 'boolean' },
            g: { type: 'string' },
          },
        },
      },
    },
  },
};

const stringify = fastJson(schema);

const schemaCopy = obj => JSON.parse(stringify(obj));
const simpleCopy = obj => JSON.parse(JSON.stringify(obj));

// const schemaCopy = obj => stringify(obj);
// const simpleCopy = obj => JSON.stringify(obj);

const TEST_OBJ = {
  a: 'ding',
  b: {
    c: 3,
    d: '3',
    e: {
      f: true,
      g: Array(100)
        .fill('ding')
        .join(),
    },
  },
};

const argv = process.argv.slice(2).join('');

const getOptions = name => ({
  // initCount: 100,
  // onCycle: ({ target }) => console.log(String(target)),
  onComplete: ({ target: { hz } }) =>
    console.log('total ops/sec', { [name]: parseInt(hz, 10) }),
});
if (!module.parent) {
  if (/schema/.test(argv)) {
    suite.add(
      'schemaCopy',
      () => schemaCopy(TEST_OBJ),
      getOptions('schemaCopy'),
    );
  }
  if (/simple/.test(argv)) {
    suite.add(
      'simpleCopy',
      () => simpleCopy(TEST_OBJ),
      getOptions('simpleCopy'),
    );
  }

  suite.run();
}

module.exports = { simpleCopy, schemaCopy };
