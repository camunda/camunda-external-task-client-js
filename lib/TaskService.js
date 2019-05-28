/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership. Camunda licenses this file to you under the Apache License,
 * Version 2.0; you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {
  MISSING_TASK,
  MISSING_ERROR_CODE,
  MISSING_NEW_DURATION
} = require("./__internal/errors");
const { isUndefinedOrNull } = require("./__internal/utils");
const Variables = require("./Variables");

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
    if (typeof task === "object") {
      return { id: task.id };
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

  /**
   * @throws Error
   * @param task
   * @returns {Promise<void>}
   */
  async complete(task, variables, localVariables) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      const requestBody = { ...sanitizedTask };
      if (variables instanceof Variables) {
        requestBody.variables = variables.getDirtyVariables();
      }
      if (localVariables instanceof Variables) {
        requestBody.localVariables = localVariables.getDirtyVariables();
      }
      await this.api.complete(requestBody);
      this.success("complete", task);
    } catch (e) {
      this.error("complete", task, e);
    }
  }

  /**
   * @throws Error
   * @param task
   * @param options
   * @returns {Promise<void>}
   */
  async handleFailure(task, options) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.handleFailure(sanitizedTask, options);
      this.success("handleFailure", task);
    } catch (e) {
      this.error("handleFailure", task, e);
    }
  }

  /**
   * @throws Error
   * @param task
   * @param errorCode
   * @param errorMessage
   * @param variables
   * @returns {Promise<void>}
   */
  async handleBpmnError(task, errorCode, errorMessage, variables) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }
    if (!errorCode) {
      throw new Error(MISSING_ERROR_CODE);
    }

    const sanitizedTask = this.sanitizeTask(task);

    try {
      await this.api.handleBpmnError(
        sanitizedTask,
        errorCode,
        errorMessage,
        variables instanceof Variables
          ? variables.getDirtyVariables()
          : undefined
      );
      this.success("handleBpmnError", task);
    } catch (e) {
      this.error("handleBpmnError", task, e);
    }
  }

  /**
   * @throws Error
   * @param task
   * @param newDuration
   * @returns {Promise<void>}
   */
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
      this.success("extendLock", task);
    } catch (e) {
      this.error("extendLock", task, e);
    }
  }

  /**
   * @throws Error
   * @param task
   * @returns {Promise<void>}
   */
  async unlock(task) {
    if (isUndefinedOrNull(task)) {
      throw new Error(MISSING_TASK);
    }

    const sanitizedTask = this.sanitizeTask(task);
    try {
      await this.api.unlock(sanitizedTask);
      this.success("unlock", task);
    } catch (e) {
      this.error("unlock", task, e);
    }
  }
}

module.exports = TaskService;
