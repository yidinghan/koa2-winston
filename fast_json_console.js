const winston = require('winston');
const os = require('os');

const flatstr = (s) => {
  Number(s);
  return s;
};

const stdwrite = (level, log) => {
  if (level === 'error') {
    process.stderr.write(log + os.EOL);
  } else {
    process.stdout.write(log + os.EOL);
  }
};

const flatwrite = (level, log) => stdwrite(level, flatstr(log));

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
