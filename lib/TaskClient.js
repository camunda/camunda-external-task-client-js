const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('./errors');

const isUndefinedOrNull = a => typeof a === 'undefined' || a === null;

class TaskClient {
  constructor(api) {
    this.api = api;
  }

  complete(task) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    return this.api.complete(task);
  }

  handleFailure(task, options) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    return this.api.handleFailure(task, options);
  }

  handleBpmnError(task, errorCode) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!errorCode) {
      throw new Error(MISSING_ERROR_CODE);
    }

    return this.api.handleBpmnError(task, errorCode);
  }

  handleExtendLock(task, newDuration) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!newDuration) {
      throw new Error(MISSING_NEW_DURATION);
    }

    return this.api.handleExtendLock(task, newDuration);
  }
}

module.exports = TaskClient;
