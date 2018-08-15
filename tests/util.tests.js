const ava = require('ava');

const {
  getCacheKey, incrementAPICounter, getCache, isOverLimit
} = require('../lib/util');

ava.test.cb('getCacheKey() should create a consistent cache key', (t) => {
  const key = getCacheKey('12345', new Date());
  t.truthy(key);
  t.true(key.length > 5);
  // simulate a timestamp change.
  setTimeout(() => {
    const nextKey = getCacheKey('12345', new Date());
    t.is(key, nextKey);
    t.end();
  }, 500);
});

ava.test('getCacheKey() should create different cache keys for different days', (t) => {
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();
  const key = getCacheKey('12345', now);
  const nextKey = getCacheKey('12345', tomorrow);
  t.not(key, nextKey);
});

// test the api request counter
ava.test('incrementAPICounter() should increment for a particular API key', (t) => {
  const cacheKey = getCacheKey('13245', new Date());
  const cache = getCache();
  const currentValue = cache[cacheKey];
  t.true(currentValue == null);
  return incrementAPICounter('13245')
    .then(() => {
      const nextValue = cache[cacheKey];
      t.is(nextValue, 1);
    });
});

// test the API request limit
ava.test('isOverLimit() should only return true once the rate limit has been reached', (t) => {
  const cacheKey = getCacheKey('12345', new Date());
  t.false(isOverLimit('12345'));
  getCache()[cacheKey] = 4;
  t.false(isOverLimit('12345'));
  getCache()[cacheKey] = 5;
  t.true(isOverLimit('12345'));
});


// Quick test to make sure cache is returned.
ava.test('getCache() should return the simulated cache', (t) => {
  t.truthy(getCache());
});
