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

const { red, green } = require("chalk");

/**
 * @returns a formatted success message
 */
const success = message => `${green("✓")} ${green(message)}`;

/**
 * @returns a formatted error message
 */
const error = message => `${red("✖")} ${red(message)}`;

/**
 * logs various events from client
 * @param client
 */
const logger = client => {
  client.on("subscribe", topic => {
    console.log(success(`subscribed to topic ${topic}`));
  });

  client.on("unsubscribe", topic => {
    console.log(success(`unsubscribed from topic ${topic}`));
  });

  client.on("poll:start", () => {
    console.log("polling");
  });

  client.on("poll:stop", () => {
    console.log(error("polling stopped"));
  });

  client.on("poll:success", tasks => {
    const output = success(`polled ${tasks.length} tasks`);
    console.log(output);
  });

  client.on("poll:error", e => {
    const output = error(`polling failed with ${e}`);
    console.log(output);
  });

  client.on("complete:success", ({ id }) => {
    console.log(success(`completed task ${id}`));
  });

  client.on("complete:error", ({ id }, e) => {
    console.log(error(`couldn't complete task ${id}, ${e}`));
  });

  client.on("handleFailure:success", ({ id }) => {
    console.log(success(`handled failure of task ${id}`));
  });

  client.on("handleFailure:error", ({ id }, e) => {
    console.log(error(`couldn't handle failure of task ${id}, ${e}`));
  });

  client.on("handleBpmnError:success", ({ id }) => {
    console.log(success(`handled BPMN error of task ${id}`));
  });

  client.on("handleBpmnError:error", ({ id }, e) => {
    console.log(error(`couldn't handle BPMN error of task ${id}, ${e}`));
  });

  client.on("extendLock:success", ({ id }) => {
    console.log(success(`handled extend lock of task ${id}`));
  });

  client.on("extendLock:error", ({ id }, e) => {
    console.log(error(`couldn't handle extend lock of task ${id}, ${e}`));
  });

  client.on("unlock:success", ({ id }) => {
    console.log(success(`unlocked task ${id}`));
  });

  client.on("unlock:error", ({ id }, e) => {
    console.log(error(`couldn't unlock task ${id}, ${e}`));
  });
};

// export logger & attach to it success and error methods
module.exports = Object.assign(logger, { success, error });
