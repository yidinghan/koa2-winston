# koa2-winston

[![Travis](https://img.shields.io/travis/yidinghan/koa2-winston.svg?style=flat-square)](<>)
[![npm](https://img.shields.io/npm/l/koa2-winston.svg?style=flat-square)](<>)
[![npm](https://img.shields.io/npm/v/koa2-winston.svg?style=flat-square)](<>)
[![npm](https://img.shields.io/npm/dm/koa2-winston.svg?style=flat-square)](<>)
[![David](https://img.shields.io/david/yidinghan/koa2-winston.svg?style=flat-square)](<>)
[![David](https://img.shields.io/david/dev/yidinghan/koa2-winston.svg?style=flat-square)](<>)

koa2 version winston logger like express-winston

<!-- TOC -->

- [koa2-winston](#koa2-winston)
- [Usage](#usage)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Configuration](#configuration)
- [JSDoc](#jsdoc)
  - [keysRecorder](#keysrecorder)
  - [logger](#logger)

<!-- /TOC -->

# Usage

## Installation

```shell
npm i --save koa2-winston
```

## Quick Start

```js
const { logger } = require('koa2-winston');
app.use(logger());
// request loggeh will look like 
// {
//   "req": {
//     "headers": {
//       "host": "127.0.0.1:59534",
//       "accept-encoding": "gzip, deflate",
//       "user-agent": "node-superagent/3.5.2",
//       "connection": "close"
//     },
//     "url": "/",
//     "method": "GET",
//     "href": "http://127.0.0.1:59534/",
//     "query": {}
//   },
//   "started_at": 1494486039864,
//   "res": {
//     "headers": {
//       "content-type": "text/plain; charset=utf-8",
//       "content-length": "8"
//     },
//     "status": 200
//   },
//   "duration": 26,
//   "level": "info",
//   "message": "HTTP GET /"
// }
```

## Configuration

Every params got an default value, you can customised your our logger by change the configuration

```js
app.use(logger({
  transports: new winston.transports.Console({ json: true, stringify: true }),
  level: 'info',
  reqKeys: ['headers','url','method', 'httpVersion','href','query','length'],
  reqSelect: [],
  reqUnselect: ['headers.cookie'],
  resKeys: ['headers','status'],
  resSelect: [],
  resUnselect: [],
}));
```

# JSDoc

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## keysRecorder

keysRecorder
use ldoash pick, get and set to collect data from given target object

**Parameters**

-   `payload` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** input arguments (optional, default `{}`)
    -   `payload.defaults` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>?** default keys will be collected
    -   `payload.selects` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>?** keys will be collected as
        additional part
    -   `payload.unselects` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>?** keys that will be ignored at last

**Examples**

```javascript
// without payload
const recorder = keysRecorder();
recorder() // {}
recorder({ foo: 1, bar: 2, foobar: { a: 3, b: 4 } }) // {}

// with defaults
const recorder = keysRecorder({ defaults: ['foo'] });
recorder() // {}
recorder({ foo: 1, bar: 2, foobar: { a: 3, b: 4 } }) // { foo: 1 }

// with defaults and selects
const recorder = keysRecorder({ defaults: ['foo'], selects: ['foobar'] });
recorder() // {}
recorder({
  foo: 1,
  bar: 2,
  foobar: { a: 3, b: 4 }
}) // { foo: 1, foobar: { a: 3, b: 4 } }

// with defaults and unselects
const recorder = keysRecorder({ defaults: ['foobar'], unselects: ['foobar.a'] });
recorder() // {}
recorder({
  foo: 1,
  bar: 2,
  foobar: { a: 3, b: 4 }
}) // { foobar: { a: 3 } }

// with defaults and selects and unselects
const recorder = keysRecorder({
  defaults: ['foo'],
  selects: ['foobar'],
  unselects: ['foobar.b'],
});
recorder() // {}
recorder({
  foo: 1,
  bar: 2,
  foobar: { a: 3, b: 4 }
}) // { foo: 1, foobar: { a: 3 } }
```

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** closure function, setting by given payload

## logger

logger middleware for koa2 use winston

**Parameters**

-   `payload` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** input arguments (optional, default `{}`)
    -   `payload.transports` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** winston transports instance (optional, default `winston.transports.Console`)
    -   `payload.level` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** default log level of logger (optional, default `'info'`)
    -   `payload.reqKeys` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** default request fields to be logged (optional, default `['headers','url','method',
        'httpVersion','href','query','length']`)
    -   `payload.reqSelect` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** additional request fields to be logged (optional, default `[]`)
    -   `payload.reqUnselect` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** request field
                         will be removed from the log (optional, default `['headers.cookie']`)
    -   `payload.resKeys` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** default response fields to be logged (optional, default `['headers','status']`)
    -   `payload.resSelect` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** additional response fields to be logged (optional, default `[]`)
    -   `payload.resUnselect` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** response field will be removed from the log (optional, default `[]`)

**Examples**

```javascript
const { logger } = require('koa2-winston');
app.use(logger());
// trrific logger look like down here
// {
//   "req": {
//     "headers": {
//       "host": "127.0.0.1:59534",
//       "accept-encoding": "gzip, deflate",
//       "user-agent": "node-superagent/3.5.2",
//       "connection": "close"
//     },
//     "url": "/",
//     "method": "GET",
//     "href": "http://127.0.0.1:59534/",
//     "query": {}
//   },
//   "started_at": 1494486039864,
//   "res": {
//     "headers": {
//       "content-type": "text/plain; charset=utf-8",
//       "content-length": "8"
//     },
//     "status": 200
//   },
//   "duration": 26,
//   "level": "info",
//   "message": "HTTP GET /"
// }
```

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** logger middleware
