const ava = require('ava');
const request = require('supertest-as-promised');

const app = require('../');

ava.test('It should fail when there\'s no key', t => request(app)
  .get('/weather')
  .expect(403)
  .then((response) => {
    t.true(response.body.err.indexOf('API Key is required') >= 0);
    t.pass();
  }));

ava.test('It should fail when an invalid key is passed', t => request(app)
  .get('/weather?country=au&city=Sydney&key=xyzabc')
  .expect(403)
  .then((response) => {
    t.true(response.body.err.indexOf('API Key is invalid') >= 0);
    t.pass();
  }));

ava.test('It should succeed when parameters are correct', t => request(app)
  .get('/weather')
  .query({ city: 'Sydney', country: 'au', key: '87879848918324' })
  .expect(200)
  .then((response) => {
    t.true(response.text.length >= 0); // this varies with the weather
  }));

ava.test.only('It should lock out after 5 requests', (t) => {
  const promises = [];
  for (let i = 0; i < 5; i += 1) {
    promises.push(
      request(app)
        .get('/weather')
        .query({ city: 'Sydney', country: 'au', key: '87879848918324' })
        .expect(200)
        .then((response) => {
          t.true(response.text.length >= 0); // this varies with the weather
        })
    );
  }
  return Promise.all(promises)
    .then(() => request(app)
      .get('/weather')
      .query({ city: 'Sydney', country: 'au', key: '87879848918324' })
      .expect(429)
      .then((response) => {
        t.true(response.body.err.indexOf('API key has hit the daily limit') >= 0);
        t.pass();
      }));
});
