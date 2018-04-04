# koa2-winston

[![Travis](https://img.shields.io/travis/yidinghan/koa2-winston.svg?style=flat-square)](https://www.npmjs.com/package/koa2-winston)
[![npm](https://img.shields.io/npm/l/koa2-winston.svg?style=flat-square)](https://www.npmjs.com/package/koa2-winston)
[![npm](https://img.shields.io/npm/v/koa2-winston.svg?style=flat-square)](https://www.npmjs.com/package/koa2-winston)
[![npm](https://img.shields.io/npm/dm/koa2-winston.svg?style=flat-square)](https://www.npmjs.com/package/koa2-winston)
[![David](https://img.shields.io/david/yidinghan/koa2-winston.svg?style=flat-square)](https://www.npmjs.com/package/koa2-winston)
[![David](https://img.shields.io/david/dev/yidinghan/koa2-winston.svg?style=flat-square)](https://www.npmjs.com/package/koa2-winston)
[![node](https://img.shields.io/node/v/koa2-winston.svg?style=flat-square)](https://www.npmjs.com/package/koa2-winston)

koa2 version winston logger like [express-winston](https://github.com/bithavoc/express-winston)

Add logger to your koa2 server in 3 lines

[中文介绍](https://github.com/yidinghan/koa2-winston/blob/master/README.CN.md)

<!-- TOC -->

- [koa2-winston](#koa2-winston)
- [Usage](#usage)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Configuration](#configuration)
  - [Examples](#examples)
    - [Do not record any request fields](#do-not-record-any-request-fields)
    - [Do not record any response fields](#do-not-record-any-response-fields)
    - [Do not record UA](#do-not-record-ua)
    - [Record a response body filed](#record-a-response-body-filed)
- [Simple Benchmark](#simple-benchmark)
  - [Schema Stringify](#schema-stringify)
- [JSDoc](#jsdoc)
  - [clone](#clone)
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
```

request log will look like

```json
{
  "req": {
    "headers": {
      "host": "localhost:3000",
      "connection": "keep-alive",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "dnt": "1",
      "accept-encoding": "gzip, deflate, sdch, br",
      "accept-language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,de;q=0.2,ja;q=0.2,it;q=0.2"
    },
    "url": "/hello",
    "method": "GET",
    "href": "http://localhost:3000/hello",
    "query": {}
  },
  "started_at": 1494554053492,
  "res": {
    "headers": {
      "content-type": "application/json; charset=utf-8",
      "content-length": "16"
    },
    "status": 200
  },
  "duration": 8,
  "level": "info",
  "message": "HTTP GET /hello"
}
```

## Configuration

Each parameter has a default value, and you can customize your logger by changing the configuration

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

Many configuration explain can be found in [logger](#logger)

## Examples

### Do not record any request fields

```js
app.use(logger({
  reqKeys: []
}));
```

The req object will be empty

```json
{
  "req": {
  },
  "started_at": 1494486039864,
  "res": {
    "headers": {
      "content-type": "text/plain; charset=utf-8",
      "content-length": "8"
    },
    "status": 200
  },
  "duration": 26,
  "level": "info",
  "message": "HTTP GET /"
}
```

### Do not record any response fields

```js
app.use(logger({
  resKeys: []
}));
```

The res object will be empty

```json
{
  "req": {
    "headers": {
      "host": "127.0.0.1:59534",
      "accept-encoding": "gzip, deflate",
      "user-agent": "node-superagent/3.5.2",
      "connection": "close"
    },
    "url": "/",
    "method": "GET",
    "href": "http://127.0.0.1:59534/",
    "query": {}
  },
  "started_at": 1494486039864,
  "res": {
  },
  "duration": 26,
  "level": "info",
  "message": "HTTP GET /"
}
```

### Do not record UA

```js
app.use(logger({
  reqUnselect: ['headers.cookies', 'headers.user-agent']
}));
```

The UA of request will be ignored

```json
{
  "req": {
    "headers": {
      "host": "127.0.0.1:59534",
      "accept-encoding": "gzip, deflate",
      "connection": "close"
    },
    "url": "/",
    "method": "GET",
    "href": "http://127.0.0.1:59534/",
    "query": {}
  },
  "started_at": 1494486039864,
  "res": {
    "headers": {
      "content-type": "text/plain; charset=utf-8",
      "content-length": "8"
    },
    "status": 200
  },
  "duration": 26,
  "level": "info",
  "message": "HTTP GET /"
}
```

### Record a response body filed

```js
app.use(logger({
  resSelect: ['body.success']
}));
```

The `success` field on `body` will be recorded

```json
{
  "req": {
    "headers": {
      "host": "127.0.0.1:59534",
      "accept-encoding": "gzip, deflate",
      "connection": "close"
    },
    "url": "/",
    "method": "GET",
    "href": "http://127.0.0.1:59534/",
    "query": {}
  },
  "started_at": 1494486039864,
  "res": {
    "headers": {
      "content-type": "text/plain; charset=utf-8",
      "content-length": "8"
    },
    "status": 200,
    "body": {
      // Any possible value given by the server
      "success": false
    }
  },
  "duration": 26,
  "level": "info",
  "message": "HTTP GET /"
}
```

# Simple Benchmark

At node 8.2

middleware x 90,281 ops/sec ±7.89% (13 runs sampled)

At node 8.4

middleware x 112,011 ops/sec ±10.26% (18 runs sampled)

## Schema Stringify

With [fast-json-stringify](https://github.com/fastify/fast-json-stringify) support, default transport [logger](https://github.com/yidinghan/koa2-winston/blob/master/fast_json_console.js) is much faster

```sh
total ops/sec { jsonstringify: 73544 }
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
total ops/sec { schemastringify: 90223 }
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

# JSDoc

## clone

clone object

**Parameters**

-   `obj` **any**

## keysRecorder

keysRecorder
use ldoash pick, get and set to collect data from given target object

**Parameters**

-   `payload` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** input arguments (optional, default `{}`)
    -   `payload.defaults` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?** default keys will be collected
    -   `payload.selects` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?** keys will be collected as
        additional part
    -   `payload.unselects` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?** keys that will be ignored at last

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

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** closure function, setting by given payload

## logger

logger middleware for koa2 use winston

**Parameters**

-   `payload` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** input arguments (optional, default `{}`)
    -   `payload.transports` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>** customize transports (optional, default `[newFastJsonConsole({stringify})]`)
    -   `payload.level` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** default log level of logger (optional, default `'info'`)
    -   `payload.reqKeys` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** default request fields to be logged (optional, default `['headers','url','method',
        'httpVersion','href','query','length']`)
    -   `payload.reqSelect` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** additional request fields to be logged (optional, default `[]`)
    -   `payload.reqUnselect` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** request field
                         will be removed from the log (optional, default `['headers.cookie']`)
    -   `payload.resKeys` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** default response fields to be logged (optional, default `['headers','status']`)
    -   `payload.resSelect` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** additional response fields to be logged (optional, default `[]`)
    -   `payload.resUnselect` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** response field will be removed from the log (optional, default `[]`)
    -   `payload.logger` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** customize winston logger
    -   `payload.msg` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** customize log msg (optional, default `HTTP%s%s`)

**Examples**

```javascript
const { logger } = require('koa2-winston');
app.use(logger());
// request logger look like down here
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

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** logger middleware
