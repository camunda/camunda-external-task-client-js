const { MISSING_TASK, MISSING_ERROR_CODE } = require('./constants');

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

  handleBpmnError(errorCode) {
    if (!errorCode) {
      throw new Error(MISSING_ERROR_CODE);
    }

    return this.api.handleBpmnError(errorCode);
  }
}

module.exports = TaskClient;