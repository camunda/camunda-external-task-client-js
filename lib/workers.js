const forEach = require('foreach');
const EngineClient = require('./engineClient');

/**
 * Error messages
 */
const WORKERS_ERROR = 'Couldn\'t instantiate Workers, missing configuration parameter \'path\'';
const REGISTER_ERROR = 'Couldn\'t register worker already registered for this topic';

const defaultOptions = {
  workerId: 'some-random-id',
  maxTasks: 10,
  interval: 300,
  lockDuration: 50000,
};

function defer(timeout, action, context) {
  return setTimeout(action.bind(context), timeout);
}

/**
 *
 * @param customOptions
 * @param customOptions.path: path to api | REQUIRED
 * @param customOptions.workerId
 * @param customOptions.maxTasks
 * @param customOptions.interval
 * @constructor
 */
function Workers(customOptions) {

  if (!customOptions || !customOptions.path || !customOptions.path.length) {
    throw new Error(WORKERS_ERROR);
  }
  this.workers = {}; // Map which contains all subscribed topics
  this.options = Object.assign({}, defaultOptions, customOptions);
  this.engineClient = new EngineClient(this.options);
  defer( this.options.interval, this.poll, this);
}

/**
 *
 * @param topic
 * @param customOptions
 * @param customOptions.lockDuration
 * @param handler
 * @returns {*}
 */
Workers.prototype.registerWorker = function(topic, customOptions, handler) {
  const workers = this.workers;
  const options = this.options;
  const lockDuration = options.lockDuration;

  if (workers[topic]) {
    throw new Error(REGISTER_ERROR);
  }

  //handles the case if there is no options being
  if (typeof customOptions  === 'function') {
    handler = customOptions;
    customOptions = null;
  }

  const unregister = () => {
    delete workers[topic];
  };

  const worker = Object.assign({ handler, unregister, lockDuration }, customOptions);
  // Add topic to workers with the related callback fkt and lockduration
  workers[topic] = worker;
  return worker;
};


Workers.prototype.poll = function() {
  const self = this;
  const workers = this.workers;
  const engineClient = this.engineClient;
  const { maxTasks, interval } = this.options;
  const pollingOptions = { maxTasks };//, this.customOptions);
  let topics = [];

  console.log('...');

  // if no workers are registered, reschedule polling
  if (!Object.keys(workers).length) {
    return defer(interval, this.poll, this);
  }

  // collect topics workers are registered on
  forEach(workers, function(worker, key) {
    topics.push({
      topicName: key,
      lockDuration: worker.lockDuration
      //variables;
    });
  });

  const requestBody = Object.assign({}, pollingOptions, { topics });

  return engineClient.fetchAndLock(requestBody)
    .then(tasks => {
      forEach(tasks, function(task) {
        console.log('task fetched and locked');
      });
      defer(interval, self.poll, self);
    })
    .catch(console.error);
};

module.exports = Workers;
