const forEach = require('foreach');
const extend = require('extend');

const defaultOptions = {
  workerId: 'some-random-id',
  maxTasks: 10,
  interval: 300,
  lockDuration: 50000,
};

function Workers(customOptions) {

  if (!customOptions || !customOptions.path.length) {
    throw new Error();
  }

  this.workers = {}; // Map which contains all subscribed topics
  this.options = extend({}, defaultOptions, customOptions);
}

Workers.prototype.registerWorker = function(topic, customOptions, handler) {
  const self = this;
  const workers = this.workers;
  const options = this.options;
  const lockDuration = options.lockDuration;

  if (workers[topic]) {
    throw new Error();
  }

  //handles the case if there is no options being
  if (typeof customOptions  === 'function') {
    handler = customOptions;
    customOptions = null;
  }

  const unregister = () => {
    delete workers[topic]
  };

  const worker = extend({ handler, unregister, lockDuration }, customOptions);

  // Add topic to workers with the related callback fkt and lockduration
  workers[topic] = worker;
  return worker;
};

module.exports = Workers;
