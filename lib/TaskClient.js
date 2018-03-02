const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('./__internal/errors');
const { isUndefinedOrNull } = require('./__internal/utils');


class TaskClient {
  constructor(events, api) {
    this.events = events;
    this.api = api;

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
  }

  sanitizeTask(task) {
    return typeof task === 'object' ?
      task.id:
      task;
  }

  success(event, ...args) {
    this.events.emit(`${event}:success`, ...args);
  }

  error(event, ...args) {
    this.events.emit(`${event}:error`, ...args);
  }

  async complete(task) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.complete(sanitizedTask);
      this.success('complete', task);
    } catch (e) {
      this.error('complete', task, e);
    }
  }

  async handleFailure(task, options) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.handleFailure(sanitizedTask, options);
      this.success('handleFailure', task);
    } catch (e) {
      this.error('handleFailure', task, e);
      this.events.emit('handleFailure:error', task, e);
    }
  }

  async handleBpmnError(task, errorCode) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!errorCode) {
      throw new Error(MISSING_ERROR_CODE);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.handleBpmnError(sanitizedTask, errorCode);
      this.success('handleBpmnError', task);
    } catch (e) {
      this.error('handleBpmnError', task, e);
    }
  }

  async handleExtendLock(task, newDuration) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!newDuration) {
      throw new Error(MISSING_NEW_DURATION);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.handleExtendLock(sanitizedTask, newDuration);
      this.success('handleExtendLock', task);
    } catch (e) {
      this.error('handleExtendLock', task, e);
    }
  }
}

module.exports = TaskClient;
