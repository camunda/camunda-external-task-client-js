const got = require('got');

class EngineClient {
  constructor(options) {
    this.workerId = options.workerId;
    this.path = options.path;
    this.fetchAndLock = this.fetchAndLock.bind(this);
  }

  fetchAndLock(requestBody) {
    return got.post(`${this.path}/fetchAndLock`, {
      json: true, body: Object.assign({}, requestBody, { workerId: this.workerId })
    }).then(({ statusCode, body }) => ({ statusCode, body }) );
  }
}
module.exports = EngineClient;