# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.1](https://github.com/yidinghan/koa2-winston/compare/v3.2.0...v3.2.1) (2024-10-24)

## [3.2.0](https://github.com/yidinghan/koa2-winston/compare/v3.1.1...v3.2.0) (2023-10-18)


### Features

* **deps:** update to newest version ([24726fc](https://github.com/yidinghan/koa2-winston/commit/24726fc82fbb49099b4dcc93e64df7053925600a))
* **package:** update fast-json-stringify@1.15.3 ([c2fd149](https://github.com/yidinghan/koa2-winston/commit/c2fd1498d507250efdb021b93dd21a3053a8ac50))


### Bug Fixes

* **deps:** bump winston from 3.2.1 to 3.11.0 ([0ec392f](https://github.com/yidinghan/koa2-winston/commit/0ec392faf068ec7cab06891bc96714c5dd5c2f1e))

<a name="3.1.1"></a>
## [3.1.1](https://github.com/yidinghan/koa2-winston/compare/v3.1.0...v3.1.1) (2018-11-06)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/yidinghan/koa2-winston/compare/v3.0.2...v3.1.0) (2018-11-06)


### Bug Fixes

* **stringify:** ensure type object in generate fn ([3a103e6](https://github.com/yidinghan/koa2-winston/commit/3a103e6))
* **stringify:** ignore not parent unselect paths ([95437bd](https://github.com/yidinghan/koa2-winston/commit/95437bd))
* **stringify:** missing httpVersion in defaultReqSchema ([74aa62d](https://github.com/yidinghan/koa2-winston/commit/74aa62d))
* **stringify:** missing uniq path handler and prefix ([9c3cb1e](https://github.com/yidinghan/koa2-winston/commit/9c3cb1e))


### Features

* **logger:** omit keys info keys ([333f5aa](https://github.com/yidinghan/koa2-winston/commit/333f5aa))
* **logger:** rename {req,res}.headers to {req,res}.header ([1e5b89f](https://github.com/yidinghan/koa2-winston/commit/1e5b89f))
* remove key recorder and use stringify schema ([61b13d0](https://github.com/yidinghan/koa2-winston/commit/61b13d0))
* **package:** mv lodash.assign to dev dependencies ([2adc855](https://github.com/yidinghan/koa2-winston/commit/2adc855))
* rename meta to info ([9f64f08](https://github.com/yidinghan/koa2-winston/commit/9f64f08))
* **stringify:** clone default schemas when generate ([fa15bba](https://github.com/yidinghan/koa2-winston/commit/fa15bba))
* **stringify:** ensuretypeobject in schemaKeysHandlers ([5f8adec](https://github.com/yidinghan/koa2-winston/commit/5f8adec))
* **stringify:** generate schema fn ([df17a22](https://github.com/yidinghan/koa2-winston/commit/df17a22))
* **stringify:** generateFormat fn to copy req/res ([5c631a5](https://github.com/yidinghan/koa2-winston/commit/5c631a5))
* **stringify:** predefined req.body schema ([1327244](https://github.com/yidinghan/koa2-winston/commit/1327244))
* **stringify:** top level key should also ignore ([6f0e028](https://github.com/yidinghan/koa2-winston/commit/6f0e028))
* **stringify schema:** init generate fn for winston log info obj ([31a83ed](https://github.com/yidinghan/koa2-winston/commit/31a83ed))
* **stringify schema:** use asJsonSchemaPath for easy lodash.get/set ([ce78410](https://github.com/yidinghan/koa2-winston/commit/ce78410))


### BREAKING CHANGES

* **logger:** rename {req,res}.headers to {req,res}.header in the log info object. like from `{
req: { headers: { } } }` to `{ req: { header: { } } }`



<a name="3.0.2"></a>
## [3.0.2](https://github.com/yidinghan/koa2-winston/compare/v3.0.1...v3.0.2) (2018-10-27)


### Features

* **package:** drop support on node 7 ([f2e018c](https://github.com/yidinghan/koa2-winston/commit/f2e018c))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/yidinghan/koa2-winston/compare/v3.0.0...v3.0.1) (2018-10-27)


### Features

* **package:** rm winston from peerDependencies ([c48992f](https://github.com/yidinghan/koa2-winston/commit/c48992f))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/yidinghan/koa2-winston/compare/v2.5.1...v3.0.0) (2018-10-27)


### Features

* **package:** mv winston and winston-transport to dependencies ([1eea08c](https://github.com/yidinghan/koa2-winston/commit/1eea08c))
* **stringify:** use printf to wrap stringify ([3debb21](https://github.com/yidinghan/koa2-winston/commit/3debb21))
* **winston:** transports.Stream as default ([0094519](https://github.com/yidinghan/koa2-winston/commit/0094519))


### BREAKING CHANGES

* **package:** no need for peer dependencies on winston



<a name="2.5.1"></a>
## [2.5.1](https://github.com/yidinghan/koa2-winston/compare/v2.5.0...v2.5.1) (2018-07-29)


### Performance Improvements

* **getLogLevel:** math.floor faster then parse int ([d8fdda2](https://github.com/yidinghan/koa2-winston/commit/d8fdda2))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/yidinghan/koa2-winston/compare/v2.4.1...v2.5.0) (2018-07-29)


### Features

* **package:** update fast-json-stringify to 1.7.1 ([d09675d](https://github.com/yidinghan/koa2-winston/commit/d09675d))



<a name="2.4.1"></a>
## [2.4.1](https://github.com/yidinghan/koa2-winston/compare/v2.4.0...v2.4.1) (2018-05-15)


### Features

* **package:** update fast-json-stringify to 1.5.2 ([51eb3d8](https://github.com/yidinghan/koa2-winston/commit/51eb3d8))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/yidinghan/koa2-winston/compare/v2.3.0...v2.4.0) (2018-04-04)


### Features

* **logger:** lodash.assign to default transports ([8732613](https://github.com/yidinghan/koa2-winston/commit/8732613))
* **logger:** use object.keys for better perf ([446434f](https://github.com/yidinghan/koa2-winston/commit/446434f))
* **stringify:** support options.assign ([ee87f80](https://github.com/yidinghan/koa2-winston/commit/ee87f80))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/yidinghan/koa2-winston/compare/v2.2.0...v2.3.0) (2018-04-04)


### Features

* **stringify:** add flatstr method ([897ba46](https://github.com/yidinghan/koa2-winston/commit/897ba46))
* **stringify:** all log write to std out ([21dcd7c](https://github.com/yidinghan/koa2-winston/commit/21dcd7c))
* **stringify:** remove flatstr options ([4106d1c](https://github.com/yidinghan/koa2-winston/commit/4106d1c))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/yidinghan/koa2-winston/compare/v2.1.0...v2.2.0) (2018-03-26)


### Bug Fixes

* **fast json console:** missing default value ([d12580f](https://github.com/yidinghan/koa2-winston/commit/d12580f))


### Features

* export stringify in index ([4fe3a94](https://github.com/yidinghan/koa2-winston/commit/4fe3a94))
* **fast json console:** customized transports ([70101b6](https://github.com/yidinghan/koa2-winston/commit/70101b6))
* **fast json console:** speed up as defaults ([729768b](https://github.com/yidinghan/koa2-winston/commit/729768b))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/yidinghan/koa2-winston/compare/v2.0.0...v2.1.0) (2018-03-26)


### Features

* **stringify:** more reliable schema ([e5ec6ab](https://github.com/yidinghan/koa2-winston/commit/e5ec6ab))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/yidinghan/koa2-winston/compare/v1.7.1...v2.0.0) (2018-03-26)


### Features

* use fast json stringify as default stringify ([7d70b88](https://github.com/yidinghan/koa2-winston/commit/7d70b88))
* **stringify:** finish schema properties ([e832e6a](https://github.com/yidinghan/koa2-winston/commit/e832e6a))
* **stringify:** init fast json schema ([4cb2cd7](https://github.com/yidinghan/koa2-winston/commit/4cb2cd7))
* **stringify:** top level keys to  schema ([3f08891](https://github.com/yidinghan/koa2-winston/commit/3f08891))



<a name="1.7.1"></a>
## [1.7.1](https://github.com/yidinghan/koa2-winston/compare/v1.7.0...v1.7.1) (2017-08-29)


### Performance Improvements

* **clone:** less conditions ([f1379f7](https://github.com/yidinghan/koa2-winston/commit/f1379f7))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/yidinghan/koa2-winston/compare/v1.6.5...v1.7.0) (2017-08-29)


### Bug Fixes

* **clone:** error params on tostring ([f60033f](https://github.com/yidinghan/koa2-winston/commit/f60033f))


### Features

* **clone:** use entries to clone object ([68f91ef](https://github.com/yidinghan/koa2-winston/commit/68f91ef))



<a name="1.6.5"></a>
## [1.6.5](https://github.com/yidinghan/koa2-winston/compare/v1.6.4...v1.6.5) (2017-08-29)


### Bug Fixes

* rm error arguments ([0fc1c5b](https://github.com/yidinghan/koa2-winston/commit/0fc1c5b))
* use copy logObject when unset properties ([78bee31](https://github.com/yidinghan/koa2-winston/commit/78bee31))



<a name="1.6.4"></a>
## [1.6.4](https://github.com/yidinghan/koa2-winston/compare/v1.6.3...v1.6.4) (2017-05-11)



<a name="1.6.3"></a>
## [1.6.3](https://github.com/yidinghan/koa2-winston/compare/v1.6.2...v1.6.3) (2017-05-11)



<a name="1.6.2"></a>
## [1.6.2](https://github.com/yidinghan/koa2-winston/compare/v1.6.1...v1.6.2) (2017-05-05)


### Performance Improvements

* **key recorder:** concat first ([e8acd4c](https://github.com/yidinghan/koa2-winston/commit/e8acd4c))



<a name="1.6.1"></a>
## [1.6.1](https://github.com/yidinghan/koa2-winston/compare/v1.6.0...v1.6.1) (2017-04-25)


### Features

* **logger:** default console transport print single-line output ([f3715ed](https://github.com/yidinghan/koa2-winston/commit/f3715ed))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/yidinghan/koa2-winston/compare/v1.5.0...v1.6.0) (2017-04-24)


### Features

* **logger:** add duration result to meta ([2049ddb](https://github.com/yidinghan/koa2-winston/commit/2049ddb))
* **logger:** add koa res serializer ([dff23e4](https://github.com/yidinghan/koa2-winston/commit/dff23e4))
* **logger:** add started_at and req.length, replace originalUrl by href ([d9840e0](https://github.com/yidinghan/koa2-winston/commit/d9840e0))
* **logger:** use on-finished to get final response result ([a21cfc2](https://github.com/yidinghan/koa2-winston/commit/a21cfc2))
* **logger:** use util.format as template to generate logger msg ([399cf24](https://github.com/yidinghan/koa2-winston/commit/399cf24))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/yidinghan/koa2-winston/compare/v1.4.0...v1.5.0) (2017-04-24)


### Features

* **serializer:** use keysRecorder to build serializer for ctx.request ([e068c46](https://github.com/yidinghan/koa2-winston/commit/e068c46))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/yidinghan/koa2-winston/compare/v1.3.0...v1.4.0) (2017-04-11)


### Features

* add standardise keys recorder ([83abd7b](https://github.com/yidinghan/koa2-winston/commit/83abd7b))
* **keysRecorder:** recorder return empty object ([a40ccbb](https://github.com/yidinghan/koa2-winston/commit/a40ccbb))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/yidinghan/koa2-winston/compare/v1.2.1...v1.3.0) (2017-04-10)


### Features

* **package:** add engines node version limitation ([453f871](https://github.com/yidinghan/koa2-winston/commit/453f871))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/yidinghan/koa2-winston/compare/v1.1.0...v1.2.1) (2017-04-10)


### Features

* init index.js ([04f8e2e](https://github.com/yidinghan/koa2-winston/commit/04f8e2e))
* **ci:** init .travis.yml ([ef2e57e](https://github.com/yidinghan/koa2-winston/commit/ef2e57e))
* **ci:** update .travis.yml ([e9f1735](https://github.com/yidinghan/koa2-winston/commit/e9f1735))
* **package:** add lodash.omit and winston ([0f09ea4](https://github.com/yidinghan/koa2-winston/commit/0f09ea4))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/yidinghan/koa2-winston/compare/v1.1.0...v1.2.0) (2017-04-10)


### Features

* init index.js ([04f8e2e](https://github.com/yidinghan/koa2-winston/commit/04f8e2e))
* **ci:** init .travis.yml ([ef2e57e](https://github.com/yidinghan/koa2-winston/commit/ef2e57e))
* **package:** add lodash.omit and winston ([0f09ea4](https://github.com/yidinghan/koa2-winston/commit/0f09ea4))



<a name="1.1.0"></a>
# 1.1.0 (2017-04-10)


### Features

* **package:** npm init ([fd4db1e](https://github.com/yidinghan/koa2-winston/commit/fd4db1e))
