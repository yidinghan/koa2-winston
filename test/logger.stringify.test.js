const { test } = require('ava');
const Koa = require('koa');
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
  ctx.body = 'dingding';
};
const useLogger = (payload, handler = defaultHandler) => {
  const app = new Koa();
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
  t.truthy(infoObj);

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
    },
    res: {
      status: '200',
      header: {
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '8',
      },
    },
  });
});
