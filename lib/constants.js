/**
 * Error messages
 */
const WORKERS_ERROR = 'Couldn\'t instantiate Workers, missing configuration parameter \'path\'';
const REGISTER_ERROR = 'Couldn\'t register worker already registered for this topic';
const MISSING_TASK = 'Couldn\'t complete task, task id is missing';


module.exports = {
  WORKERS_ERROR,
  REGISTER_ERROR,
  MISSING_TASK
};
