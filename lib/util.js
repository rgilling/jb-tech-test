const config = require('../config');

const simulatedCache = {};

/**
 * Gets a timestamp based key based on combining the current start of day with the key
 * @param {*} key String based API key.
 */
function getCacheKey(key, date) {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return `${key}_${startOfDay / 1000}`;
}

/**
 * Gets the simulated cache. Normally this would be Memcache, Redis etc.
 */
function getCache() {
  return simulatedCache;
}

/**
 * Utility function to increment the API counter.
 * It returns a promise because this would usually be an async request to
 * memcached etc.
 * @param {*} key
 */
function incrementAPICounter(key) {
  const cacheKey = getCacheKey(key, new Date());
  const cache = getCache();

  // record a hit for the API key
  cache[cacheKey] = cache[cacheKey] != null ? cache[cacheKey] += 1 : 1;

  // simulates async.
  return Promise.resolve();
}

/**
 * Checks the limit against the cached requests.
 * @param {*} key API key
 */
function isOverLimit(key) {
  const cacheKey = getCacheKey(key, new Date());
  const currentCount = getCache()[cacheKey];
  return currentCount >= config.limit;
}

/**
 * Gets the application config
 */
function getConfig() {
  return config;
}

/**
 * Checks if it's a valid API key. This simply looks up in the config to check it exists.
 * @param {*} key String.
 */
function isValidAPIKey(key) {
  return getConfig().apiKeys.indexOf(key) >= 0;
}

module.exports = {
  getCacheKey,
  getCache,
  getConfig,
  isValidAPIKey,
  isOverLimit,
  incrementAPICounter
};
