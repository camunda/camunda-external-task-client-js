const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('./__internal/errors');
const { isUndefinedOrNull } = require('./__internal/utils');


class TaskService {
  constructor(events, api) {
    this.events = events;
    this.api = api;

    this.sanitizeTask = this.sanitizeTask.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.complete = this.complete.bind(this);
    this.handleFailure = this.handleFailure.bind(this);
    this.handleBpmnError = this.handleBpmnError.bind(this);
    this.extendLock = this.extendLock.bind(this);
  }

  sanitizeTask(task) {
    if (typeof task === 'object') {
      const variables = task.variables.getDirtyVariables();
      return { ...task, variables };
    } else {
      return { id: task };
    }
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

  async extendLock(task, newDuration) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!newDuration) {
      throw new Error(MISSING_NEW_DURATION);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.extendLock(sanitizedTask, newDuration);
      this.success('extendLock', task);
    } catch (e) {
      this.error('extendLock', task, e);
    }
  }

  async unlock(task) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.unlock(sanitizedTask);
      this.success('unlock', task);
    } catch (e) {
      this.error('unlock', task, e);
    }
  }
}

module.exports = TaskService;
