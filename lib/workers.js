const forEach = require('foreach');
const extend = require('extend');
const EngineClient = require('./engineClient');

const errorMessages = {
  workersError: 'Configurations are reuqired.',
  registerError: 'Worker is already registered for this topic.'
};


const defaultOptions = {
  workerId: 'some-random-id',
  maxTasks: 10,
  interval: 300,
  lockDuration: 50000,
};

function defer(millis, handler, context) {
  return setTimeout(handler.bind(context), millis);
}

function Workers(customOptions) {

  if (!customOptions || !customOptions.path.length) {
    throw new Error(errorMessages.workersError);
  }
  this.engineClient = new EngineClient(customOptions);
  this.workers = {}; // Map which contains all subscribed topics
  this.options = extend({}, defaultOptions, customOptions);
  defer( this.options.interval, this.poll, this);
}

// // ? how to get rid of it, user doesn't need to have access to it.
// Workers.prototype.reschedule = function() {
//   defer(this.options.interval, this.poll, this);
// };

Workers.prototype.registerWorker = function(topic, customOptions, handler) {
  //const self = this;
  const workers = this.workers;
  const options = this.options;
  const lockDuration = options.lockDuration;

  if (workers[topic]) {
    throw new Error(errorMessages.registerError);
  }

  //handles the case if there is no options being
  if (typeof customOptions  === 'function') {
    handler = customOptions;
    customOptions = null;
  }

  const unregister = () => {
    delete workers[topic];
  };

  const worker = extend({ handler, unregister, lockDuration }, customOptions);
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
  let requestBody = {};
  let topics = [];

  console.log('...');
  // dont fetchAndLock if no topics are set;
  if (!Object.keys(workers).length) {
    return defer( interval, this.poll, this);//this.reschedule();
  }

  // collect topics workers are registered on
  forEach(workers, function(worker, key) {
    topics.push({
      topicName: key,
      lockDuration: worker.lockDuration
      //variables;
    });
  });
  requestBody = extend(pollingOptions , { topics });

  return engineClient.fetchAndLock(requestBody)
    .then(tasks => {
      forEach(tasks, function(task) {
        console.log('task fetched and locked');
      });
      defer( interval, self.poll, self);
    })
    .catch(console.error);
};

module.exports = Workers;
