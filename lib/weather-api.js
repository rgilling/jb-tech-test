const request = require('request');
const get = require('lodash/get');
const { getConfig, incrementAPICounter } = require('./util');

/**
 * Middleware to handle calling the weather service API.
 * It calls the service, then if successful it increments the rate limit
 * and returns the weather description.
 * If the call fails, the error is forwarded to the service user.
 */
function checkWeather(req, res, next) {
  const { query } = req;
  const { city, country } = query;
  const config = getConfig();
  if (!country || !city) {
    return res.status(422).json({ msg: 'Missing required parameters. Make sure both country and city are provided.' });
  }
  const requestUrl = `${config.weatherEndpoint}?q=${query.city},${query.country}&appid=${config.weatherAppId}`;

  // send the request
  return request(requestUrl, (error, response, body) => {
    if (error) {
      return next(error);
    }
    const json = JSON.parse(body);
    if (response.statusCode === 200 && json.cod === 200) {
      return incrementAPICounter(req.query.key)
        .then(() => res.status(200).send(get(json, 'weather[0].description') || 'no description available'))
        .catch(next);
    }

    // just forwards API errors to the caller - not sure why it's 'cod'!
    return res.status(json.cod).json(json);
  });
}

module.exports = {
  checkWeather
};
