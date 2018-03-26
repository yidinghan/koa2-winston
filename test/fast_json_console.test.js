const { test } = require('ava');

const FastJsonConsole = require('../fast_json_console');

test('ok', (t) => {
  t.truthy(FastJsonConsole);
});

test.cb('should get log info without exception', (t) => {
  const fastJsonConsole = new FastJsonConsole();

  t.plan(2);
  fastJsonConsole.log('info', 'test', {}, (err, flag) => {
    t.is(err, null);
    t.true(flag);
    t.end();
  });
});

test.cb('should get log error without exception', (t) => {
  const fastJsonConsole = new FastJsonConsole();

  t.plan(2);
  fastJsonConsole.log('error', 'test', {}, (err, flag) => {
    t.is(err, null);
    t.true(flag);
    t.end();
  });
});
