const { test } = require('ava');
const Koa = require('koa');
const supertest = require('supertest');

const { logger } = require('../index');

let app;
let server;
const request = () => {
  server = server || app.listen();
  return supertest(server);
};
const useLogger = (payload) => {
  app.use(logger(payload));
  app.use((ctx) => {
    ctx.body = 'dingding';
  });
};

test.beforeEach(() => {
  app = new Koa();
});
test.afterEach(() => {
  app = null;
  server = null;
});

test('successful required logger', (t) => {
  t.truthy(logger);
});

test('successful create default middleware', async (t) => {
  useLogger();
  const { text } = await request().get('/').expect(200);
  t.truthy(text, 'should get a body');
  t.is(text, 'dingding', 'should get dingding as text');
});
