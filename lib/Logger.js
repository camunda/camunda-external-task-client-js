const readline = require('readline');
const { red, green } = require('chalk');


class Logger {
  constructor(options) {
    /**
     * Bind member methods
     */
    this.proxyConsoleLog = this.proxyConsoleLog.bind(this);
    this.log = this.log.bind(this);
    this.logLine = this.logLine.bind(this);
    this.logLineAt = this.logLineAt.bind(this);
    this.logLoader = this.logLoader.bind(this);
    this.addListeners = this.addListeners.bind(this);

    this.lines = 0;
    this.proxyConsoleLog();

    return this.addListeners;
  }

  proxyConsoleLog() {
    this._log = console.log;
    console.log = this.log;
  }

  /**
   * A proxy for console.log
   */
  log(...args) {
    const result = args.reduce((res, arg) => res += arg, '');
    this.lines += result.split('\n').length;
    this._log(...args);
  }

  /**
   * Logs a single line
   * @param line
   * @returns {number}
   */
  logLine(line) {
    this.logLineAt(this.lines, line);
    return this.lines - 1;
  }

  /**
   * Logs a single line at position index
   * @param index
   * @param line
   */
  logLineAt(index, line) {
    let n = this.lines - index;
    let stdout = process.stdout;
    readline.cursorTo(stdout, 0);
    readline.moveCursor(stdout, 0, -n);
    stdout.write(line);
    readline.clearLine(stdout, 1);
    readline.cursorTo(stdout, 0);

    let newMove;
    if (n > this.lines || n === 0) {
      this.lines += n + 1;
      newMove = n + 1;
    } else {
      newMove = n;
    }
    readline.moveCursor(stdout, 0, newMove);
  }

  /**
   * Logs a dynamic loader with a message at a new line
   * @param message
   */
  logLoader(message) {
    let loader = new Loader();

    const pollStartLine = this.logLine(`${message} ${loader.next()}`);

    const createInterval = () => (
      setInterval(() => {
        this.logLineAt(pollStartLine, `${message} ${loader.next()}`);
      }, 200)
    );

    let interval =  createInterval();
    let timeout;

    /**
     * Replaces the loading line with message for time milliseconds
     * @param message
     * @param time
     */
    const pauseWithMessage = (message, time) => {
      clearInterval(interval);
      this.logLineAt(pollStartLine, message);
      timeout = setTimeout(() => {
        interval = createInterval();
      }, time);
    };

    /**
     * Clears the interval used for animating the loader
     */
    const stop = () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };

    return { pauseWithMessage, stop };
  }

  /**
   * Intercepts the workers events and logs them in a nice way
   * @param workers: a workers instance
   */
  addListeners(workers) {
    let pollingLoader;

    const stopPollingLoader = () => {
      pollingLoader.stop();
      pollingLoader = null;
    };

    workers.on('worker:register:success', (topic) => {
      this.logLine(success(`worker registered to topic ${topic}`));
    });

    workers.on('poll:start', () => {
      if (!pollingLoader) {
        pollingLoader = this.logLoader('polling');
      }
    });

    workers.on('poll:stop', () => {
      stopPollingLoader();
      this.logLine(error('polling stopped'));
    });

    workers.on('poll:success', (tasks) => {
      const output = success(`polled ${tasks.length} tasks`);
      pollingLoader && pollingLoader.pauseWithMessage(output, 1000);
    });

    workers.on('poll:error', (e) => {
      const output = error(`polling failed with ${e}`);
      pollingLoader && pollingLoader.pauseWithMessage(output, 1000);
    });

    workers.on('complete:success', ({ id }) => {
      this.logLine(success(`completed task ${id}`));
    });

    workers.on('complete:error', (e, { id }) => {
      this.logLine(error(`couldn't complete task ${id}`));
    });

    workers.on('handleFailure:success', ({ id }) => {
      this.logLine(success(`handled failure of task ${id}`));
    });

    workers.on('handleFailure:error', (e, { id }) => {
      this.logLine(error(`couldn't handle failure of task ${id}`));
    });

    workers.on('handleBpmnError:success', ({ id }) => {
      this.logLine(success(`handled BPMN error of task ${id}`));
    });

    workers.on('handleBpmnError:error', (e, { id }) => {
      this.logLine(error(`couldn't handle BPMN error of task ${id}`));
    });

    workers.on('handleExtendLock:success', ({ id }) => {
      this.logLine(success(`handled extend lock of task ${id}`));
    });

    workers.on('handleExtendLock:error', (e, { id }) => {
      this.logLine(error(`couldn't handle extend lock of task ${id}`));
    });
  }

}

function Loader() {
  const spinner =   '...';
  let idx = 0;

  this.next = () => {
    const spin = spinner.slice(0, idx+1);
    idx = (idx + 1) % spinner.length;
    return spin;
  };
}

/**
 * @returns a formatted success message
 */
function success(message) {
  return `${message} ${green('✓')}`;
}

/**
 * @returns a formatted error message
 */
function error(message) {
  return `${message} ${red('✖')}`;
}

module.exports = Logger;