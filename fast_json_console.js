const winston = require('winston');
const os = require('os');

class FastJsonConsoleTransport extends winston.Transport {
  constructor(options = {}) {
    super();

    this.stringify = options.stringify || JSON.stringify;
  }
  log(level, message, meta, callback) {
    process.stdout.write(this.stringify(Object.assign({ message, level }, meta)) + os.EOL);

    callback(null, true);
  }
}

module.exports = FastJsonConsoleTransport;
