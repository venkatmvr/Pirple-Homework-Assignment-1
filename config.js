// setup config file
var environments = {};

environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging'
};
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production'
};
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// currentEnvironment check and set to default if empty
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = environmentToExport;
