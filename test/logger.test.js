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
const defaultHandler = (ctx) => {
  ctx.body = 'dingding';
};
const useLogger = (payload, handler = defaultHandler) => {
  const app = new Koa();
  app.use(logger(payload));
  app.use(handler);

  return app.listen();
};

test('log level should be warn', async (t) => {
  const msgs = [];
  const warnHanler = (ctx) => {
    ctx.status = 400;
  };
  const app = useLogger(
    {
      transports: [new CustomTransport(msgs)],
    },
    warnHanler,
  );
  await request(app).post('/test').expect(400);

  const [{ level }] = msgs;
  t.is(level, 'warn');
});

test('cookies should still exists', async (t) => {
  const msgs = [];
  let cookie = '';
  const cookieHanler = (ctx) => {
    cookie = ctx.headers.cookie;
    ctx.body = 'dingding';
  };
  const app = useLogger(
    {
      transports: [new CustomTransport(msgs)],
    },
    cookieHanler,
  );
  await request(app).post('/test').set('Cookie', 'ding=ding').expect(200);

  const [{ level }] = msgs;
  t.is(level, 'info');
  t.is(cookie, 'ding=ding', 'should be request cookie');
});

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

test('successful display correct url in msg', async (t) => {
  const msgs = [];
  const app = useLogger({
    transports: [new CustomTransport(msgs)],
  });
  await request(app).post('/test').expect(200);

  const [{ msg }] = msgs;
  t.is(msg, 'HTTP POST /test');
});

test('should use input level as default level', async (t) => {
  const msgs = [];
  const app = useLogger({
    level: 'error',
    transports: [new CustomTransport(msgs)],
  });
  await request(app).post('/test').expect(200);

  const [{ level }] = msgs;
  t.is(level, 'error');
});

test('should still record logger when error have been throw out', async (t) => {
  const msgs = [];
  const errorHandler = (ctx) => {
    ctx.throw('test');
  };
  const app = useLogger(
    {
      transports: [new CustomTransport(msgs)],
    },
    errorHandler,
  );
  await request(app).post('/test').expect(500);

  const [{ level }] = msgs;
  t.is(level, 'error');
});
