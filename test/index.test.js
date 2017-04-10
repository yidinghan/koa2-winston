const { test } = require('ava');
const koaWinston = require('../');

test('ok', (t) => {
  t.truthy(koaWinston);
});
