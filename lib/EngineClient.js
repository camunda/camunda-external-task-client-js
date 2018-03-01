const got = require('got');

class EngineClient {
  constructor({ workerId, path, interceptors }) {
    this.workerId = workerId;
    this.baseUrl = path;
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

  request(method, path, options) {
    const url = `${this.baseUrl}${path}`;
    let newOptions = Object.assign({ method }, options);

    if (this.interceptors) {
      newOptions = this.interceptors.reduce((config, interceptor) => {
        return interceptor(config);
      }, newOptions);
    }

    return got(url, newOptions);
  }

  post(path, options) {
    return this.request('POST', path, options);
  }

  get(path, options) {
    return this.request('GET', path, options);
  }

  fetchAndLock(requestBody) {
    return this.post('/fetchAndLock', {
      json: true, body: Object.assign({}, requestBody, { workerId: this.workerId })
    }).then(({ body }) => body );
  }


  complete(taskId) {
    return this.post(`/${taskId}/complete`,
      { json: true, body: { workerId: this.workerId } })
      .then(({ body }) => body);
  }

  handleFailure(taskId, options) {
    return this.post( `/${taskId}/failure`,
      { json: true, body: Object.assign({}, options, { workerId: this.workerId } ) })
      .then(({ body }) => body);
  }

  handleBpmnError(taskId, errorCode) {
    return this.post( `/${taskId}/bpmnError`,
      { json: true, body: Object.assign({}, errorCode, { workerId: this.workerId }) })
      .then(({ body }) => body);
  }

  handleExtendLock(taskId, newDuration) {
    return this.post( `/${taskId}/bpmnError`,
      { json: true, body: Object.assign({}, newDuration, { workerId: this.workerId }) })
      .then(({ body }) => body);
  }
}

module.exports = EngineClient;