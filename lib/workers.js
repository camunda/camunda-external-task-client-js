const forEach = require('foreach');
const extend = require('extend');

const defaultOptions = {
  workerId: 'some-random-id',
  maxTasks: 10,
  interval: 300,
  lockDuration: 50000,
};

function Workers(customOptions) {

  if (!customOptions || !customOptions.path.length) throw new Error();

  this.workers = {}; // Map which contains all subscribed topics
  this.options = extend({}, defaultOptions, customOptions);
}

Workers.prototype.registerWorker = function(topic, customOptions, handler) {
  if (this.workers[topic]) throw new Error();

  //handles the case if there is no options being
  if (typeof customOptions  === 'function') {
    handler = customOptions;
    customOptions = null;
  }
  const self = this;
  const workerOptions = extend({}, { lockDuration: this.options.lockDuration }, customOptions );
  console.log(workerOptions);
  // Add topic to workers with the related callback fkt and lockduration
  this.workers[topic] = { handler, workerOptions };

  return (
    extend({},
      { unregister: () => delete self.workers[topic] },
      this.workers[topic],
      { workerOptions })
  );
};

module.exports = Workers;
