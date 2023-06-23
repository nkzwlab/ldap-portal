const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: {
      type: 'console',
    },
  },
  categories: {
    default: {appenders: ['console'], level: 'DEBUG'},
    access: {appenders: ['console'], level: 'DEBUG'},
  },
});

const logger = log4js.getLogger();
const connectLogger = log4js.connectLogger(log4js.getLogger('access'));

module.exports = {
  logger,
  connectLogger,
};
