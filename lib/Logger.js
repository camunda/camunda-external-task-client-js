const readline = require('readline');
const { red, green } = require('chalk');

function Loader() {
  const spinner =   '...';
  let idx = 0;

  this.next = () => {
    const spin = spinner.slice(0, idx+1);
    idx = (idx + 1) % spinner.length;
    return spin;
  };
}

class Logger {
  constructor(options) {
    /**
     * Bind member methods
     */
    this.hackConsoleLog = this.hackConsoleLog.bind(this);
    this.log = this.log.bind(this);
    this.logLine = this.logLine.bind(this);
    this.logLineAt = this.logLineAt.bind(this);
    this.addListeners = this.addListeners.bind(this);

    this.lines = 0;
    this.hackConsoleLog();

    return this.addListeners;
  }

  hackConsoleLog() {
    this._log = console.log;
    console.log = this.log;
  }

  log(...args) {
    const result = args.reduce((res, arg) => res += arg, '');
    this.lines += result.split('\n').length;
    this._log(...args);
  }

  logLine(message) {
    this.logLineAt(this.lines, message);
    return this.lines - 1;
  }

  logLineAt(index, message) {
    let n = this.lines - index;
    let stdout = process.stdout;
    readline.cursorTo(stdout, 0);
    readline.moveCursor(stdout, 0, -n);
    stdout.write(message);
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

  addListeners(workers) {
    let loader = new Loader();
    let pollStartLine;


    workers.on('worker:register:success', () => {
      this.logLine(success('worker registered'));
    });

    workers.on('poll:start', (...args) => {
      // if we are logging poll:start for the first time
      if (!pollStartLine && pollStartLine !== 0) {
        pollStartLine = this.logLine('polling started');
        return;
      }

      const message = `polling ${loader.next()}`;
      this.logLineAt(pollStartLine, message);
    });

    workers.on('poll:stop', (...args) => {
      pollStartLine = null;
      loader = new Loader();
      this.logLine(error('polling stopped'));
    });

    workers.on('poll:success', (tasks) => {
      if (tasks && tasks.length > 0) {
        this.logLineAt(pollStartLine, success('polled tasks'));
      }
    });

    workers.on('complete:success', ({ id }) => {
      this.logLine(success(`task ${id} completed`));
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

function success(message) {
  return `${message} ${green('✓')}`;
}

function error(message) {
  return `${message} ${red('✖')}`;
}

module.exports = Logger;