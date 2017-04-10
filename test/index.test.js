const { test } = require('ava');
const { keysRecorder } = require('../');

test('ok', (t) => {
  t.truthy(keysRecorder);
});

test('keysRecorder: should get an function as return', (t) => {
  const recorder = keysRecorder();

  t.is(typeof recorder, 'function');
});
