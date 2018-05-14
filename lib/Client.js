const events = require("events");

const EngineService = require("./__internal/EngineService");
const TaskService = require("./TaskService");
const Variables = require("./Variables");

const {
  MISSING_BASE_URL,
  ALREADY_REGISTERED,
  MISSING_HANDLER,
  WRONG_INTERCEPTOR,
  WRONG_MIDDLEWARES
} = require("./__internal/errors");

const {
  isFunction,
  isArrayOfFunctions,
  isUndefinedOrNull
} = require("./__internal/utils");

const defaultOptions = {
  workerId: "some-random-id",
  maxTasks: 10,
  interval: 300,
  lockDuration: 50000,
  autoPoll: true
};

/**
 * @throws Error
 * @param customOptions
 * @param customOptions.baseUrl: baseUrl to api | REQUIRED
 * @param customOptions.workerId
 * @param customOptions.maxTasks
 * @param customOptions.interval
 * @param customOptions.lockDuration
 * @param customOptions.autoPoll
 * @param customOptions.asyncResponseTimeout
 * @param customOptions.interceptors
 * @param customOptions.use
 * @constructor
 */
class Client extends events {
  constructor(customOptions) {
    super();

    /**
     * Bind member methods
     */
    this.sanitizeOptions = this.sanitizeOptions.bind(this);
    this.start = this.start.bind(this);
    this.poll = this.poll.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.executeTask = this.executeTask.bind(this);
    this.stop = this.stop.bind(this);

    /**
     *  Initialize data
     */
    this.sanitizeOptions(customOptions);
    this.topicSubscriptions = {}; // Map which contains all subscribed topics
    this.engineService = new EngineService(this.options);
    this.taskService = new TaskService(this, this.engineService);

    if (this.options.use) {
      this.options.use.forEach(f => f(this));
    }

    if (this.options.autoPoll) {
      this.start();
    }
  }

  /**
   * @throws Error
   * @param customOptions
   */
  sanitizeOptions(customOptions) {
    this.options = { ...defaultOptions, ...customOptions };

    if (
      !customOptions ||
      !customOptions.baseUrl ||
      !customOptions.baseUrl.length
    ) {
      throw new Error(MISSING_BASE_URL);
    }

    const { interceptors, use } = customOptions;

    // sanitize request interceptors
    if (
      interceptors &&
      !isFunction(interceptors) &&
      !isArrayOfFunctions(interceptors)
    ) {
      throw new Error(WRONG_INTERCEPTOR);
    }

    if (isFunction(interceptors)) {
      this.options.interceptors = [interceptors];
    }

    // sanitize middlewares
    if (use && !isFunction(use) && !isArrayOfFunctions(use)) {
      throw new Error(WRONG_MIDDLEWARES);
    }

    if (isFunction(use)) {
      this.options.use = [use];
    }
  }

  /**
   * Starts polling
   */
  start() {
    this._isPollAllowed = true;
    this.poll();
  }

  /**
   * Polls tasks from engine and executes them
   */
  async poll() {
    if (!this._isPollAllowed) {
      return;
    }

    this.emit("poll:start");

    const { topicSubscriptions, engineService, executeTask, poll } = this;
    const { maxTasks, interval, asyncResponseTimeout } = this.options;

    // setup polling options
    let pollingOptions = { maxTasks };
    if (asyncResponseTimeout) {
      pollingOptions = { ...pollingOptions, asyncResponseTimeout };
    }

    // if there are no topic subscriptions, reschedule polling
    if (!Object.keys(topicSubscriptions).length) {
      return setTimeout(this.poll, interval);
    }

    // collect topics that have subscriptions
    const topics = Object.entries(topicSubscriptions).map(
      ([topicName, { lockDuration, variables, businessKey }]) => {
        let topic = { topicName, lockDuration };

        if (!isUndefinedOrNull(variables)) {
          topic.variables = variables;
        }

        if (!isUndefinedOrNull(businessKey)) {
          topic.businessKey = businessKey;
        }

        return topic;
      }
    );

    const requestBody = { ...pollingOptions, topics };

    try {
      const tasks = await engineService.fetchAndLock(requestBody);
      this.emit("poll:success", tasks);
      tasks.forEach(executeTask);
    } catch (e) {
      this.emit("poll:error", e);
    }
    setTimeout(poll, interval);
  }

  /**
   * Subscribes a handler by adding a topic subscription
   * @param topic
   * @param customOptions
   * @param customOptions.lockDuration
   * @param handler
   */
  subscribe(topic, customOptions, handler) {
    const topicSubscriptions = this.topicSubscriptions;
    const options = this.options;
    const lockDuration = options.lockDuration;

    if (topicSubscriptions[topic]) {
      throw new Error(ALREADY_REGISTERED);
    }

    //handles the case if there is no options being
    if (typeof customOptions === "function") {
      handler = customOptions;
      customOptions = null;
    }

    if (!handler) {
      throw new Error(MISSING_HANDLER);
    }
    const unsubscribe = () => {
      delete topicSubscriptions[topic];
      this.emit("unsubscribe");
    };

    const topicSubscription = {
      handler,
      unsubscribe,
      lockDuration,
      ...customOptions
    };
    topicSubscriptions[topic] = topicSubscription;
    this.emit("subscribe", topic, topicSubscription);

    return topicSubscription;
  }

  /**
   * Executes task using the worker registered to its topic
   */
  executeTask(task) {
    const taskService = this.taskService;
    const topicSubscription = this.topicSubscriptions[task.topicName];
    const variables = new Variables(task.variables, {
      readOnly: true,
      processInstanceId: task.processInstanceId,
      engineService: this.engineService
    });
    const newTask = { ...task, variables };
    try {
      topicSubscription.handler({ task: newTask, taskService });
      this.emit("handler:success", task);
    } catch (e) {
      this.emit("handler:error", e);
    }
  }

  /**
   * Stops polling
   */
  stop() {
    this._isPollAllowed = false;
    this.emit("poll:stop");
  }
}

module.exports = Client;
