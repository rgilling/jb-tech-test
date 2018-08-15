const express = require('express');
const { apiCheck } = require('./lib/api-check');
const { checkWeather } = require('./lib/weather-api');
const { getConfig } = require('./lib/util');

const config = getConfig();
const app = express();

/*
  Uses two middleware:
    First checks the API against the rate limit and validates the request.
    Second validates the query params and checks the weather service.
*/
app.get('/weather', apiCheck, checkWeather);

// Basic 404 error handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic generic error handler - 'next' param is required for this to work
// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.error(err); //eslint-disable-line
  res.status(500).send(err.response || 'Something broke!');
});

const server = app.listen(config.port || 8080, () => {
  const { port } = server.address();
  console.log(`App listening on port ${port}`); // eslint-disable-line
});

module.exports = app;
