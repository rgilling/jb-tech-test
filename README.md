# JB Hifi Tech Challenge

## Getting Started
Clone the repository:

`git clone git@github.com:rgilling/jb-tech-test.git`

then install dependencies:  `npm install`

## First run the test to make sure it's working okay

To run unit tests

`npm run tests`

To run integration tests

`npm run e2e`

To run eslint

`npm run lint`

## How to run the server?

`npm start`

Then use the sample request:

http://localhost:9080/weather?country=au&city=Sydney&key=87879849838292

Send five requests, and on the sixth you should be blocked with a 429 status and an error code.

Try a few invalid requests:

- http://localhost:9080/weather?country=au&city=Sydney&key=8789838292
- http://localhost:9080/weather?country=au&key=87879849838292
- http://localhost:9080/weather?country=au&city=Invalid&key=87879849838292



### Dependencies: 

express - For hosting the service
lodash - Object utilities, specifically get.
request - Library for making an http request from NodeJS.

### Dev Dependencies:

eslint & extensions - Uses a modified Airbnb lint configuration.
sinon - For mocking and stubbing.
proxyquire - For stubbing dependencies without require bugs.
ava - Test runner like Mocha etc. but has assertions built in.
supertest - Used in the e2e tests. (supertest-as-promised)



