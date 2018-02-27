const MISSING_TASK = 'Couldn\'t complete task, task id is missing';

class TaskClient {
  constructor(api) {
    this.api = api;
  }

  complete(task) {
    if (!task && task !== 0) {
      throw new Error(MISSING_TASK);
    }

    return this.api.complete(task);
  }
}

module.exports = TaskClient;