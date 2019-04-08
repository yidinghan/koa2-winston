import test from 'ava';

const _ = require('lodash');
const Koa = require('koa');
const Transport = require('winston-transport');
const request = require('supertest');

const { logger, getLogLevel } = require('../index');

class CustomTransport extends Transport {
  constructor(msgs = []) {
    super();
    this.msgs = msgs;
  }

  log(info, callback) {
    this.msgs.push(info);
    callback(null, true);
  }
}
const defaultHandler = (ctx) => {
  ctx.body = 'dingding';
};
const useLogger = (payload, handler = defaultHandler) => {
  const app = new Koa();
  // @ts-ignore
  app.use(logger(payload));
  app.use(handler);

  return app.listen();
};

test('log level should return ding as default level', async (t) => {
  const level = getLogLevel(undefined, 'ding');
  t.is(level, 'ding');
});

test('log level should return warn as default level', async (t) => {
  const level = getLogLevel(undefined, 'warn');
  t.is(level, 'warn');
});

test('log level should return warn', async (t) => {
  const level = getLogLevel(400);
  t.is(level, 'warn');
});

test('log level should return error', async (t) => {
  const level = getLogLevel(500);
  t.is(level, 'error');
});

test('log level should use defautl value', async (t) => {
  const level = getLogLevel();
  t.is(level, 'info');
});

test('log level should be warn when status=400', async (t) => {
  const msgs = [];
  const warnHandler = (ctx) => {
    ctx.status = 400;
  };
  const app = useLogger(
    {
      transports: [new CustomTransport(msgs)],
    },
    warnHandler,
  );
  await request(app)
    .post('/test')
    .expect(400);

  const [{ level }] = msgs;
  t.is(level, 'warn');
});

test('cookies should still exists', async (t) => {
  const msgs = [];
  let cookie = '';
  const cookieHandler = (ctx) => {
    const {
      header: { cookie: requestCookie },
    } = ctx;
    cookie = requestCookie;
    ctx.body = 'dingding';
  };
  const app = useLogger(
    {
      transports: [new CustomTransport(msgs)],
    },
    cookieHandler,
  );
  await request(app)
    .post('/test')
    .set('Cookie', 'ding=ding')
    .expect(200);

  const [{ level }] = msgs;
  t.is(level, 'info');
  t.is(cookie, 'ding=ding', 'should be request cookie');
});

test('successful required logger', (t) => {
  t.truthy(logger);
});

test('successful create default middleware', async (t) => {
  const app = useLogger();
  const { text } = await request(app)
    .get('/')
    .expect(200);

  t.is(text, 'dingding', 'should get dingding as text');
});

test('successful use custom transport', async (t) => {
  const msgs = [];
  const app = useLogger({
    transports: [new CustomTransport(msgs)],
  });
  await request(app)
    .get('/')
    .expect(200);

  t.is(msgs.length, 1, 'should record 1 msg');

  const [info] = msgs;
  t.is(info.level, 'info');
  t.is(info.message, 'HTTP GET /');
  const meta = _.omit(info, ['level', 'message']);
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
  await request(app)
    .post('/test')
    .expect(200);

  const [{ message }] = msgs;
  t.is(message, 'HTTP POST /test');
});

test('should use input level as default level', async (t) => {
  const msgs = [];
  const app = useLogger({
    level: 'error',
    transports: [new CustomTransport(msgs)],
  });
  await request(app)
    .post('/test')
    .expect(200);

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
  await request(app)
    .post('/test')
    .expect(500);

  const [{ level }] = msgs;
  t.is(level, 'error');
});
