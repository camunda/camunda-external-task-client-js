const events = require('events');

const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('./__internal/errors');
const { isUndefinedOrNull } = require('./__internal/utils');


class TaskClient extends events {
  constructor(api) {
    super();
    this.api = api;
  }

  sanitizeTask(task) {
    return typeof task === 'object' ?
      task.id:
      task;
  }

  async complete(task) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.complete(sanitizedTask);
      this.emit('complete:success');
    } catch (e) {
      this.emit('complete:error', e);
    }
  }

  async handleFailure(task, options) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.handleFailure(sanitizedTask, options);
      this.emit('handleFailure:success');
    } catch (e) {
      this.emit('handleFailure:error', e);
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
      this.emit('handleBpmnError:success');
    } catch (e) {
      this.emit('handleBpmnError:error', e);
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
      this.emit('handleExtendLock:success');
    } catch (e) {
      this.emit('handleExtendLock:error', e);
    }
  }
}

module.exports = TaskClient;
