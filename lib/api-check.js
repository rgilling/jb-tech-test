const {
  isOverLimit, isValidAPIKey
} = require('./util');

/**
 * Express middleware that checks the presented API key from the query params.
 * It first checks a valid key is present in the query string, then
 * uses a simple in memory cache to keep track of API requests for a particular day.
 * The day is defined as 'since 12am', so it uses a timestamp to cache the count for the day.
 * If all okay, it simply progresses to the next middleware.
 *
 * Error Codes:
 * 403 - Forbidden access - i.e no key or invalid key
 * 429 - API rate limit exceeded.
 */
function apiCheck(req, res, next) {
  const { key } = req.query;
  if (!key) {
    return res.status(403).json({ err: 'API Key is required. Make sure the key parameter is passed.' });
  }
  if (!isValidAPIKey(key)) {
    return res.status(403).json({ err: 'API Key is invalid. Check the key and try again.' });
  }

  if (isOverLimit(key)) {
    return res.status(429).json({ err: 'API key has hit the daily limit. Try again tomorrow.' });
  }
  // okay it was a valid key and passed the rate limit.
  return next();
}

module.exports = {
  apiCheck
};
