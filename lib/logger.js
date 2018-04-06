const { red, green } = require("chalk");

class Logger {
  constructor() {
    return this.addListeners;
  }

  /**
   * Intercepts the workers events and logs them in a nice way
   * @param workers: a workers instance
   */
  addListeners(client) {
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
  }
}

/**
 * @returns a formatted success message
 */
function success(message) {
  return `${green("✓")} ${green(message)}`;
}

/**
 * @returns a formatted error message
 */
function error(message) {
  return `${red("✖")} ${red(message)}`;
}

module.exports = new Logger();
Object.assign(module.exports, { success, error });
