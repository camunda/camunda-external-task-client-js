/**
 * Error messages
 */
const WORKERS_ERROR = 'Couldn\'t instantiate Workers, missing configuration parameter \'path\'';
const REGISTER_ERROR = 'Couldn\'t register, worker already registered for this topic';
const WORK_ERROR = 'Couldn\'t register, work function has not been passed';
const MISSING_TASK = 'Couldn\'t complete task, task id is missing';


module.exports = {
  WORKERS_ERROR,
  REGISTER_ERROR,
  WORK_ERROR,
  MISSING_TASK
};
