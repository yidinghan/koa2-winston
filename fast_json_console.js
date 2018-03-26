const winston = require('winston');
const os = require('os');

class FastJsonConsoleTransport extends winston.Transport {
  constructor({ stringify = JSON.stringify }) {
    super();

    this.stringify = stringify;
    this.eol = os.EOL;
  }
  log(level, message, meta, callback) {
    const output = this.stringify(Object.assign({ message, level }, meta));
    if (level === 'error') {
      process.stderr.write(output + this.eol);
    } else {
      process.stdout.write(output + this.eol);
    }

    this.emit('logged');
    callback(null, true);
  }
}

module.exports = FastJsonConsoleTransport;
