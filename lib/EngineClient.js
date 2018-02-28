const got = require('got');

class EngineClient {
  constructor(options) {
    this.workerId = options.workerId;
    this.path = options.path;
    this.fetchAndLock = this.fetchAndLock.bind(this);
    this.complete = this.complete.bind(this);
  }

  fetchAndLock(requestBody) {
    return got.post(`${this.path}/fetchAndLock`, {
      json: true, body: Object.assign({}, requestBody, { workerId: this.workerId })
    }).then(({ body }) => body );
  }


  complete(taskId) {
    return got.post( `${this.path}/${taskId}/complete`,
      { json: true, body: { workerId: this.workerId } })
      .then(({ body }) => body);
  }

  handleFailure(taskId, options) {
    return got.post( `${this.path}/${taskId}/failure`,
      { json: true, body: Object.assign({}, options, { workerId: this.workerId } ) })
      .then(({ body }) => body);
  }

  handleBpmnError(taskId, errorCode) {
    return got.post( `${this.path}/${taskId}/bpmnError`,
      { json: true, body: Object.assign({}, errorCode, { workerId: this.workerId }) })
      .then(({ body }) => body);
  }

  handleExtendLock(taskId, newDuration) {
    return got.post( `${this.path}/${taskId}/bpmnError`,
      { json: true, body: Object.assign({}, newDuration, { workerId: this.workerId }) })
      .then(({ body }) => body);
  }
}

module.exports = EngineClient;