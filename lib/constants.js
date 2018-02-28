/**
 * Error messages
 */
const WORKERS_ERROR = 'Couldn\'t instantiate Workers, missing configuration parameter \'path\'';
const REGISTER_ERROR = 'Couldn\'t register, worker already registered for this topic';
const WORK_ERROR = 'Couldn\'t register, no work function is provided';
const MISSING_TASK = 'Couldn\'t complete task, task id is missing';
const MISSING_ERROR_CODE = 'Couldn\'t throw BPMNerror, no error code is provided.'

module.exports = {
  WORKERS_ERROR,
  REGISTER_ERROR,
  WORK_ERROR,
  MISSING_TASK,
  MISSING_ERROR_CODE
};
