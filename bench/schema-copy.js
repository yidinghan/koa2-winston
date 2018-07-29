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
const forkCopy = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const copycat = {};
  Object.keys(obj).forEach((key) => {
    copycat[key] = forkCopy(obj[key]);
  });

  return copycat;
};

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
  h: 100,
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
      () => {
        const obj = simpleCopy(TEST_OBJ);
        delete obj.h;
      },
      getOptions('simpleCopy'),
    );
  }
  if (/fork/.test(argv)) {
    suite.add(
      'forkCopy',
      () => {
        const obj = forkCopy(TEST_OBJ);
        delete obj.h;
      },
      getOptions('forkCopy'),
    );
  }

  suite.run();
}

module.exports = { simpleCopy, schemaCopy, forkCopy };

// stats without delete
// ➜  koa2-winston git:(master) node bench/schema-copy.js fork
// total ops/sec { forkCopy: 1531231 }
// total ops/sec { forkCopy: 1544226 }
// total ops/sec { forkCopy: 1531241 }
// ➜  koa2-winston git:(master) node bench/schema-copy.js schema
// total ops/sec { schemaCopy: 151576 }
// total ops/sec { schemaCopy: 152341 }
// total ops/sec { schemaCopy: 153551 }
// ➜  koa2-winston git:(master) node bench/schema-copy.js simple
// total ops/sec { simpleCopy: 149366 }
// total ops/sec { simpleCopy: 149004 }
// total ops/sec { simpleCopy: 147134 }

// stats with delete
// ➜  koa2-winston git:(master) node bench/schema-copy.js fork
// total ops/sec { forkCopy: 1319846 }
// total ops/sec { forkCopy: 1312784 }
// total ops/sec { forkCopy: 1312258 }
// ➜  koa2-winston git:(master) node bench/schema-copy.js schema
// total ops/sec { schemaCopy: 152244 }
// total ops/sec { schemaCopy: 152654 }
// total ops/sec { schemaCopy: 153078 }
// ➜  koa2-winston git:(master) node bench/schema-copy.js simple
// total ops/sec { simpleCopy: 140539 }
// total ops/sec { simpleCopy: 141226 }
// total ops/sec { simpleCopy: 141576 }
