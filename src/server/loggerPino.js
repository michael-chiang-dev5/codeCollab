const pino = require('pino');

const logger =
  process.env.PINO_WRITE_LOG === 'true'
    ? // write logs to app.log
      pino(
        {
          level: process.env.PINO_LOG_LEVEL || 'info',
        },
        pino.destination(`${__dirname}/app.log`)
      )
    : // write logs to console
      pino({ level: process.env.PINO_LOG_LEVEL || 'info' });

module.exports = logger;
