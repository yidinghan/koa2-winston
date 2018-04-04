const winston = require('winston');
const os = require('os');

const flatstr = (s) => {
  Number(s);
  return s;
};

const stdwrite = log => process.stdout.write(log + os.EOL);

const flatwrite = log => stdwrite(flatstr(log));

class FastJsonConsoleTransport extends winston.Transport {
  constructor(options = {}) {
    super();

    this.stringify = options.stringify || JSON.stringify;
    this.flatstr = options.flatstr || false;
    this.write = this.flatstr ? flatwrite : stdwrite;
  }
  log(level, message, meta, callback) {
    this.write(this.stringify(Object.assign({ message, level }, meta)));

    callback(null, true);
  }
}

module.exports = FastJsonConsoleTransport;
