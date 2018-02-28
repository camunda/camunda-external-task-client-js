const { MISSING_TASK } = require('./constants');

class TaskClient {
  constructor(api) {
    this.api = api;
  }

  complete(task) {
    if (!task && task !== 0) {
      throw new Error(MISSING_TASK);
    }

    return this.api.complete(task);
  }

  handleFailure(task, options) {
    if (!task && task !== 0) {
      throw new Error(MISSING_TASK);
    }

    return this.api.handleFailure(task, options);
  }
}

module.exports = TaskClient;