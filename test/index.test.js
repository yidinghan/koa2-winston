const { test } = require('ava');
const { keysRecorder } = require('../');

const testTarget = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};

test('ok', (t) => {
  t.truthy(keysRecorder);
});

test('keysRecorder:should get an function as return', (t) => {
  const recorder = keysRecorder();

  t.is(typeof recorder, 'function');
});

test('keysRecorder:should get defaults keys', (t) => {
  const recorder = keysRecorder({
    defaults: ['a'],
  });
  const result = recorder(testTarget);

  t.deepEqual(result, { a: 1 });
});

test('keysRecorder:should get defaults and selects', (t) => {
  const recorder = keysRecorder({
    defaults: ['a'],
    selects: ['b'],
  });
  const result = recorder(testTarget);

  t.deepEqual(result, { a: 1, b: 2 });
});

test('keysRecorder:should get defaults and unselects', (t) => {
  const recorder = keysRecorder({
    defaults: ['c'],
    unselects: ['c.e'],
  });
  const result = recorder(testTarget);

  t.deepEqual(result, { c: { d: 3 } });
});

test('keysRecorder:should get empty object without target', (t) => {
  const recorder = keysRecorder({
    defaults: ['c'],
    unselects: ['c.e'],
  });
  const result = recorder();

  t.deepEqual(result, {});
});
