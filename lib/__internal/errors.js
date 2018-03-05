// Workers
const MISSING_PATH = 'Couldn\'t instantiate Workers, missing configuration parameter \'path\'';
const WRONG_INTERCEPTOR = 'Interceptors should be a function or an array of functions';
const WRONG_MIDDLEWARES = 'Middleware(s) should be a function or an array of functions';
const ALREADY_REGISTERED = 'Couldn\'t register worker, since it\'s already registered for this topic';
const MISSING_HANDLER = 'Couldn\'t register worker, missing handler function';

// Task Client
const MISSING_TASK = 'Couldn\'t complete task, task id is missing';
const MISSING_ERROR_CODE = 'Couldn\'t throw BPMN Error, no error code was provided.';
const MISSING_NEW_DURATION = 'Couldn\'t extend lock time, no new duration was provided.';

// Basic Auth Interceptor
const MISSING_AUTH_PARAMS = 'Couldn\'t instantiate BasicAuthInterceptor, missing configuration parameter ' +
  '\'username\' or \'password\'';



module.exports = {
  MISSING_PATH,
  ALREADY_REGISTERED,
  MISSING_HANDLER,
  MISSING_TASK,
  WRONG_INTERCEPTOR,
  MISSING_ERROR_CODE,
  MISSING_NEW_DURATION,
  MISSING_AUTH_PARAMS,
  WRONG_MIDDLEWARES
};
