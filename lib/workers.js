const forEach = require('foreach');

const EngineClient = require('./EngineClient');
const TaskClient = require('./TaskClient');

const { WORKERS_ERROR, REGISTER_ERROR, WORK_ERROR } = require('./constants');

const defaultOptions = {
  workerId: 'some-random-id',
  maxTasks: 10,
  interval: 300,
  lockDuration: 50000,
};

/**
 *
 * @param customOptions
 * @param customOptions.path: path to api | REQUIRED
 * @param customOptions.workerId
 * @param customOptions.maxTasks
 * @param customOptions.interval
 * @constructor
 */
class Workers {
  constructor(customOptions) {
    if (!customOptions || !customOptions.path || !customOptions.path.length) {
      throw new Error(WORKERS_ERROR);
    }

    this.workers = {}; // Map which contains all subscribed topics
    this.options = Object.assign({}, defaultOptions, customOptions);
    this.engineClient = new EngineClient(this.options);
    this.taskClient = new TaskClient(this.engineClient);

    /**
     * bind member methods
     */
    this.registerWorker = this.registerWorker.bind(this);
    this.poll = this.poll.bind(this);
    this.executeTask = this.executeTask.bind(this);

    setTimeout(this.poll, this.options.interval);
  }

  executeTask(task) {
    const worker = this.workers[task.topicName];
    worker.handler({ task, api: this.taskClient });
  }

  /**
   *
   * @param topic
   * @param customOptions
   * @param customOptions.lockDuration
   * @param handler
   * @returns {*}
   */
  registerWorker(topic, customOptions, handler) {
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

    if (!handler){
      throw new Error(WORK_ERROR);
    }

    const unregister = () => {
      delete workers[topic];
    };

    const worker = Object.assign({ handler, unregister, lockDuration }, customOptions);
    // Add topic to workers with the related callback fkt and lockduration
    workers[topic] = worker;
    return worker;
  }

  async poll() {
    const self = this;
    const workers = this.workers;
    const engineClient = this.engineClient;
    const { maxTasks, interval } = this.options;
    const pollingOptions = { maxTasks };//, this.customOptions);
    let topics = [];

    console.log('...');

    // if no workers are registered, reschedule polling
    if (!Object.keys(workers).length) {
      return setTimeout(this.poll, interval);
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

    try {
      const tasks = await engineClient.fetchAndLock(requestBody);
      forEach(tasks, self.executeTask);
    } catch (e) {
      console.log(e);
    }
    setTimeout(self.poll, interval);
  }

}

module.exports = Workers;
