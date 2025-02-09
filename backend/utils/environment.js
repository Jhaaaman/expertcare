const config = require('../config');

const environment = {
  isDevelopment: () => config.server.isDevelopment,
  isProduction: () => config.server.isProduction,
  isTest: () => config.server.isTest,
  
  // Helper functions for environment-specific behavior
  logLevel: () => {
    if (environment.isProduction()) return 'error';
    if (environment.isTest()) return 'silent';
    return 'debug';
  },
  
  corsOptions: () => {
    if (environment.isDevelopment()) {
      return {
        origin: 'http://localhost:3000',
        credentials: true,
      };
    }
    return config.security.cors;
  },
  
  mongooseDebug: () => environment.isDevelopment(),
  
  prettyLogs: () => !environment.isProduction(),
};

module.exports = environment; 