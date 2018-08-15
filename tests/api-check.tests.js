const ava = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

function configureTests() {
  const sandbox = sinon;
  const statusSpy = sandbox.spy();
  const jsonSpy = sandbox.spy();
  const fakeRes = {
    status: (status) => {
      statusSpy(status);
      return fakeRes;
    },
    json: jsonSpy
  };

  return {
    sandbox,
    jsonSpy,
    statusSpy,
    nextSpy: sandbox.spy(),
    fakeReq: {
      query: {
        key: '12345'
      }
    },
    fakeRes
  };
}

ava.test('apiCheck() should pass with a valid API key', (t) => {
  // I had to move this require down so the stubs work
  const tConf = configureTests();
  const {
    fakeReq, fakeRes, nextSpy, statusSpy, jsonSpy, sandbox
  } = tConf;
  const { apiCheck } = proxyquire('../lib/api-check', {
    './util': {
      isOverLimit: () => false,
      isValidAPIKey: () => true
    }
  });
  apiCheck(fakeReq, fakeRes, nextSpy);
  t.true(statusSpy.notCalled);
  t.true(jsonSpy.notCalled);
  t.true(nextSpy.calledOnce);
  sandbox.restore();
});

ava.test('apiCheck() should respond with status 403 when no key is in the params', (t) => {
  const tConf = configureTests();
  const {
    fakeReq, fakeRes, nextSpy, statusSpy, jsonSpy, sandbox
  } = tConf;
  delete tConf.fakeReq.query.key;
  const { apiCheck } = proxyquire('../lib/api-check', {
    './util': {
      isOverLimit: () => false,
      isValidAPIKey: () => true
    }
  });

  apiCheck(fakeReq, fakeRes, nextSpy);
  t.true(statusSpy.calledWith(403));
  t.true(jsonSpy.calledOnce);
  t.true(nextSpy.notCalled);
  sandbox.restore();
});

ava.test('apiCheck() should respond with status 403 when the key is invalid', (t) => {
  const tConf = configureTests();
  const {
    fakeReq, fakeRes, nextSpy, statusSpy, jsonSpy, sandbox
  } = tConf;
  const { apiCheck } = proxyquire('../lib/api-check', {
    './util': {
      isOverLimit: () => false,
      isValidAPIKey: () => false
    }
  });
  apiCheck(fakeReq, fakeRes, nextSpy);
  t.true(statusSpy.calledWith(403));
  t.true(jsonSpy.calledOnce);
  t.true(nextSpy.notCalled);
  sandbox.restore();
});

ava.test('apiCheck() should respond with status 429 when the rate limit is exceeded', (t) => {
  const tConf = configureTests();
  const {
    fakeReq, fakeRes, nextSpy, statusSpy, jsonSpy, sandbox
  } = tConf;
  const { apiCheck } = proxyquire('../lib/api-check', {
    './util': {
      isOverLimit: () => true, // indicates a rate limit error
      isValidAPIKey: () => true
    }
  });
  apiCheck(fakeReq, fakeRes, nextSpy);
  t.true(statusSpy.calledWith(429));
  t.true(jsonSpy.calledOnce);
  t.true(nextSpy.notCalled);
  sandbox.restore();
});
