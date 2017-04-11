const { test } = require('ava');
const { keysRecorder } = require('../');

test('ok', (t) => {
  t.truthy(keysRecorder);
});

test('keysRecorder:should get an function as return', (t) => {
  const recorder = keysRecorder();

  t.is(typeof recorder, 'function');
});

test('keysRecorder:recorder should get defaults keys', (t) => {
  const recorder = keysRecorder({
    defaults: ['a'],
  });
  const result = recorder({ a: 1, b: 2 });

  t.deepEqual(result, { a: 1 });
});
