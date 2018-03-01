const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('./errors');

const isUndefinedOrNull = a => typeof a === 'undefined' || a === null;

class TaskClient {
  constructor(api) {
    this.api = api;
  }

  sanitizeTask(task) {
    return typeof task === 'object' ?
      task.id:
      task;
  }

  complete(task) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    return this.api.complete(sanitizedTask);
  }

  handleFailure(task, options) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    return this.api.handleFailure(sanitizedTask, options);
  }

  handleBpmnError(task, errorCode) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!errorCode) {
      throw new Error(MISSING_ERROR_CODE);
    }

    const sanitizedTask = this.sanitizeTask(task);
    return this.api.handleBpmnError(sanitizedTask, errorCode);
  }

  handleExtendLock(task, newDuration) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!newDuration) {
      throw new Error(MISSING_NEW_DURATION);
    }

    const sanitizedTask = this.sanitizeTask(task);
    return this.api.handleExtendLock(sanitizedTask, newDuration);
  }
}

module.exports = TaskClient;
