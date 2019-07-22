/* eslint no-console: 0 */
const EventEmitter = require('events');
const { transports } = require('winston');

const { logger } = require('..');

const middleware = logger({
  // @ts-ignore
  transports: [
    new transports.File({ filename: 'tmp.error.log' }),
    new transports.Console(),
  ],
});

const event = new EventEmitter();
middleware(
  {
    request: {
      method: 'get',
      url: '/ding',
      header: {
        cookie: 'ding',
      },
    },
    response: event,
  },
  () => event.emit('end'),
);
