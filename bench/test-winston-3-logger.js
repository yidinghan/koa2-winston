/* eslint no-console: 0 */
const EventEmitter = require('events');
const { createLogger, format, transports } = require('winston');

const { logger } = require('../');

const consoleLogger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.prettyPrint(),
  ),
  transports: [new transports.Console()],
});
const middleware = logger({
  // @ts-ignore
  logger: consoleLogger,
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
