const ava = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const util = require('../lib/util');

function configureTests() {
  const sandbox = sinon;
  const statusSpy = sandbox.spy();
  const jsonSpy = sandbox.spy();
  const sendSpy = sandbox.spy();
  const fakeRes = {
    status: (status) => {
      statusSpy(status);
      return fakeRes;
    },
    json: jsonSpy,
    send: sendSpy
  };
  const fakeConfig = {
    weatherEndpoint: 'http://weatherapp',
    weatherAppId: '12345'
  };
  const sampleResponse = {
    cod: 200,
    weather: [
      { description: 'Fine and Sunny' }
    ]
  };
  sandbox.stub(util, 'getConfig').returns(fakeConfig);
  const incrementStub = sandbox.stub(util, 'incrementAPICounter').resolves();

  return {
    sandbox,
    jsonSpy,
    statusSpy,
    sendSpy,
    incrementStub,
    nextSpy: sandbox.spy(),
    fakeConfig,
    sampleResponse,
    fakeReq: {
      query: {
        key: '12345',
        country: 'au',
        city: 'Sydney'
      }
    },
    fakeRes
  };
}

ava.test('checkWeather() should request the service with correctly formatted URL', (t) => {
  // I had to move this require down so the stubs work
  const tConf = configureTests();
  const {
    fakeReq, fakeRes, nextSpy, incrementStub, jsonSpy, sandbox, sampleResponse
  } = tConf;
  // stubs
  const { checkWeather } = proxyquire('../lib/weather-api', {
    request: (requestUrl, cb) => {
      t.is(requestUrl, 'http://weatherapp?q=Sydney,au&appid=12345');
      cb(null, { statusCode: 200 }, JSON.stringify(sampleResponse));
    },
    './util': util
  });
  checkWeather(fakeReq, fakeRes, nextSpy);
  t.true(incrementStub.calledWith('12345')); // also checks the increment was called
  t.true(jsonSpy.notCalled);
  t.true(nextSpy.notCalled);
  sandbox.restore();
});
