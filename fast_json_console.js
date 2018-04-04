const winston = require('winston');
const os = require('os');

class FastJsonConsoleTransport extends winston.Transport {
  constructor(options = {}) {
    super();

    this.stringify = options.stringify || JSON.stringify;
    this.assign = options.assign || Object.assign;
  }
  log(level, message, meta, callback) {
    process.stdout.write(this.getLog(level, message, meta));

    callback(null, true);
  }
  getLog(level, message, meta) {
    return this.stringify(this.assign({ level, message }, meta)) + os.EOL;
  }
}

module.exports = FastJsonConsoleTransport;
