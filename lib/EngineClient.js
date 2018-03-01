const got = require('got');

class EngineClient {
  constructor({ workerId, path, interceptors }) {
    this.workerId = workerId;
    this.path = path;
    this.interceptors = interceptors;


    /**
     * Bind member methods
     */
    this.request = this.request.bind(this);
    this.post = this.post.bind(this);
    this.get = this.get.bind(this);
    this.fetchAndLock = this.fetchAndLock.bind(this);
    this.complete = this.complete.bind(this);
    this.handleFailure = this.handleFailure.bind(this);
  }

  request(url, options) {
    let newOptions = options;
    if (this.interceptors) {
      newOptions = this.interceptors.reduce((config, interceptor) => {
        return interceptor(config);
      }, newOptions);
    }
    return got(url, newOptions);
  }

  post(url, options) {
    return this.request(url, Object.assign({}, options, { method: 'POST' }));
  }

  get(url, options) {
    return this.request(url, Object.assign({}, options, { method: 'GET' }));
  }

  fetchAndLock(requestBody) {
    return this.post(`${this.path}/fetchAndLock`, {
      json: true, body: Object.assign({}, requestBody, { workerId: this.workerId })
    }).then(({ body }) => body );
  }

  complete(taskId) {
    return this.post( `${this.path}/${taskId}/complete`,
      { json: true, body: { workerId: this.workerId } })
      .then(({ body }) => body);
  }

  handleFailure(taskId, options) {
    return this.post( `${this.path}/${taskId}/failure`,
      { json: true, body: Object.assign({}, options, { workerId: this.workerId } ) })
      .then(({ body }) => body);
  }

  handleBpmnError(taskId, errorCode) {
    return this.post( `${this.path}/${taskId}/bpmnError`,
      { json: true, body: Object.assign({}, { errorCode }, { workerId: this.workerId }) })
      .then(({ body }) => body);
  }

  handleExtendLock(taskId, newDuration) {
    return this.post( `${this.path}/${taskId}/extendLock`,
      { json: true, body: Object.assign({}, { newDuration }, { workerId: this.workerId }) })
      .then(({ body }) => body);
  }
}

module.exports = EngineClient;