import test from 'ava';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Transport = require('winston-transport');
const request = require('supertest');
// @ts-ignore
const { MESSAGE } = require('triple-beam');
const _ = require('lodash');

const { logger } = require('../index');

class CustomTransport extends Transport {
  constructor(infos = []) {
    super();
    this.infos = infos;
  }

  log(info, callback) {
    this.infos.push(info);
    callback();
  }
}
const defaultHandler = (ctx) => {
  ctx.body = { ding: 'ding' };
};
const useLogger = (payload, handler = defaultHandler) => {
  const app = new Koa();
  app.use(bodyParser());
  // @ts-ignore
  app.use(logger(payload));
  app.use(handler);

  return app.listen();
};

test('parse message, default info obj', async (t) => {
  const infos = [];
  const app = useLogger({ transports: [new CustomTransport(infos)] });
  await request(app)
    .post('/test')
    .set('host', 'ding.ding')
    .set('user-agent', 'ding.ding.ding')
    .expect(200);

  const [info] = infos;
  const infoObj = JSON.parse(info[MESSAGE]);

  t.true(Date.now() - infoObj.started_at > infoObj.duration);
  t.deepEqual(_.pick(infoObj, ['level', 'message', 'req', 'res']), {
    level: 'info',
    message: 'HTTP POST /test',
    req: {
      url: '/test',
      method: 'POST',
      header: {
        'accept-encoding': 'gzip, deflate',
        'user-agent': 'ding.ding.ding',
        connection: 'close',
        host: 'ding.ding',
        'content-length': '0',
      },
      href: 'http://ding.ding/test',
      length: 0,
      query: {},
    },
    res: {
      status: '200',
      header: {
        'content-type': 'application/json; charset=utf-8',
        'content-length': '15',
      },
    },
  });
});

test('parse message, omit req.body.password', async (t) => {
  const infos = [];
  const app = useLogger({
    transports: [new CustomTransport(infos)],
    reqSelect: ['body'],
    reqUnselect: ['body.password'],
  });
  await request(app)
    .post('/test')
    .send({ username: 'dingding', password: 'dingdingding' })
    .set('host', 'ding.ding')
    .set('user-agent', 'ding.ding.ding')
    .expect(200);

  const [info] = infos;
  const infoObj = JSON.parse(info[MESSAGE]);

  t.true(Date.now() - infoObj.started_at > infoObj.duration);
  t.deepEqual(_.pick(infoObj, ['level', 'message', 'req', 'res']), {
    level: 'info',
    message: 'HTTP POST /test',
    req: {
      header: {
        host: 'ding.ding',
        'accept-encoding': 'gzip, deflate',
        'user-agent': 'ding.ding.ding',
        'content-type': 'application/json',
        'content-length': '49',
        connection: 'close',
      },
      url: '/test',
      method: 'POST',
      href: 'http://ding.ding/test',
      query: {},
      length: 49,
      body: { password: null, username: 'dingding' },
    },
    res: {
      header: {
        'content-type': 'application/json; charset=utf-8',
        'content-length': '15',
      },
      status: '200',
    },
  });
});

test('parse message, only log req.query', async (t) => {
  const infos = [];
  const app = useLogger({
    transports: [new CustomTransport(infos)],
    reqKeys: ['query'],
  });
  await request(app)
    .get('/test')
    .query({ ding: 'ding' })
    .expect(200);

  const [info] = infos;
  const infoObj = JSON.parse(info[MESSAGE]);

  t.true(Date.now() - infoObj.started_at > infoObj.duration);
  t.deepEqual(_.pick(infoObj, ['level', 'message', 'req', 'res']), {
    level: 'info',
    message: 'HTTP GET /test?ding=ding',
    req: {
      query: { ding: 'ding' },
    },
    res: {
      header: {
        'content-type': 'application/json; charset=utf-8',
        'content-length': '15',
      },
      status: '200',
    },
  });
});

test('parse message, only log res.body', async (t) => {
  const infos = [];
  const app = useLogger({
    transports: [new CustomTransport(infos)],
    reqKeys: [],
    resKeys: ['body'],
  });
  await request(app)
    .get('/test')
    .expect(200);

  const [info] = infos;
  const infoObj = JSON.parse(info[MESSAGE]);

  t.true(Date.now() - infoObj.started_at > infoObj.duration);
  t.deepEqual(_.pick(infoObj, ['level', 'message', 'req', 'res']), {
    level: 'info',
    message: 'HTTP GET /test',
    req: {},
    res: { body: { ding: 'ding' } },
  });
});

test('parse message, omit res.body.token', async (t) => {
  const infos = [];
  const app = useLogger(
    {
      transports: [new CustomTransport(infos)],
      reqKeys: [],
      resKeys: ['body'],
      resUnselect: ['body.token'],
    },
    (ctx) => {
      ctx.body = { token: 'dingtoken', name: 'ding' };
    },
  );
  await request(app)
    .put('/testtest')
    .expect(200);

  const [info] = infos;
  const infoObj = JSON.parse(info[MESSAGE]);

  t.true(Date.now() - infoObj.started_at > infoObj.duration);
  t.deepEqual(_.pick(infoObj, ['level', 'message', 'req', 'res']), {
    level: 'info',
    message: 'HTTP PUT /testtest',
    req: {},
    res: { body: { name: 'ding', token: null } },
  });
});
