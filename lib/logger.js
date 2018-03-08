const { red, green } = require('chalk');


class Logger {
  constructor() {
    return this.addListeners;
  }

  /**
   * Intercepts the workers events and logs them in a nice way
   * @param workers: a workers instance
   */
  addListeners(workers) {
    workers.on('worker:subscribe:success', (topic) => {
      console.log(success(`worker registered to topic ${topic}`));
    });

    workers.on('poll:start', () => {
      console.log('polling');
    });

    workers.on('poll:stop', () => {
      console.log(error('polling stopped'));
    });

    workers.on('poll:success', (tasks) => {
      const output = success(`polled ${tasks.length} tasks`);
      console.log(output);
    });

    workers.on('poll:error', (e) => {
      const output = error(`polling failed with ${e}`);
      console.log(output);
    });

    workers.on('complete:success', ({ id }) => {
      console.log(success(`completed task ${id}`));
    });

    workers.on('complete:error', (e, { id }) => {
      console.log(error(`couldn't complete task ${id}`));
    });

    workers.on('handleFailure:success', ({ id }) => {
      console.log(success(`handled failure of task ${id}`));
    });

    workers.on('handleFailure:error', (e, { id }) => {
      console.log(error(`couldn't handle failure of task ${id}`));
    });

    workers.on('handleBpmnError:success', ({ id }) => {
      console.log(success(`handled BPMN error of task ${id}`));
    });

    workers.on('handleBpmnError:error', (e, { id }) => {
      console.log(error(`couldn't handle BPMN error of task ${id}`));
    });

    workers.on('extendLock:success', ({ id }) => {
      console.log(success(`handled extend lock of task ${id}`));
    });

    workers.on('extendLock:error', (e, { id }) => {
      console.log(error(`couldn't handle extend lock of task ${id}`));
    });
  }

}

/**
 * @returns a formatted success message
 */
function success(message) {
  return `${green('✓')} ${green(message)}`;
}

/**
 * @returns a formatted error message
 */
function error(message) {
  return `${red('✖')} ${red(message)}`;
}

module.exports = new Logger();