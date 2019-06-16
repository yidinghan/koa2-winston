const http = require('http');
const Koa = require('koa');

const { logger, getLogLevel } = require('../index');

const koa = new Koa();
const port = 3000;
koa.use(logger())
const server = http.createServer(koa.callback());
server.listen(port);
server.on('listening', console.log);
