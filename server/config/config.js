// is set by heroku to "production"
const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  const config = require('./config.json'); // automatically consverted inot an JS object

  // extract the relevant config object (development or test)
  const envConfig = config[env];

  // loop over the extracted config object and create environment variables
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  })
}
