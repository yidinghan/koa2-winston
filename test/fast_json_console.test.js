const { test } = require('ava');

const FastJsonConsole = require('../fast_json_console');

test('ok', (t) => {
  t.truthy(FastJsonConsole);
});
