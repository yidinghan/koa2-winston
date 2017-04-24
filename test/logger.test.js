const { test } = require('ava');
const Koa = require('koa');
const winston = require('winston');
const request = require('supertest');

const { logger } = require('../index');

class CustomTransport extends winston.Transport {
  constructor(msgs = []) {
    super();
    this.msgs = msgs;
  }
  log(level, msg, meta, callback) {
    this.msgs.push({
      level,
      msg,
      meta,
    });
    callback(null, true);
  }
}
const useLogger = (payload) => {
  const app = new Koa();
  app.use(logger(payload));
  app.use((ctx) => {
    ctx.body = 'dingding';
  });

  return app.listen();
};

test('successful required logger', (t) => {
  t.truthy(logger);
});

test('successful create default middleware', async (t) => {
  const app = useLogger();
  const { text } = await request(app).get('/').expect(200);

  t.is(text, 'dingding', 'should get dingding as text');
});

test('successful use custom transport', async (t) => {
  const msgs = [];
  const app = useLogger({
    transports: [new CustomTransport(msgs)],
  });
  await request(app).get('/').expect(200);

  t.is(msgs.length, 1, 'should record 1 msg');

  const [{ level, msg, meta }] = msgs;
  t.is(level, 'info');
  t.is(msg, 'HTTP GET /');
  t.is(Object.keys(meta).length, 4);
  ['req', 'res', 'duration', 'started_at'].forEach((key) => {
    t.true(Object.keys(meta).includes(key));
  });
});
