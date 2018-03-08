const got = require('got');

class EngineClient {
  constructor({ workerId, path, interceptors }) {
    this.workerId = workerId;
    this.baseUrl = `${path.replace(/\/$/, '')}/external-task`;
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
    let newOptions = { method, ...options };

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
      json: true, body: { ...requestBody, workerId: this.workerId  }
    }).then(({ body }) => body );
  }

  complete(taskId) {
    return this.post(`/${taskId}/complete`,
      { json: true, body: { workerId: this.workerId } })
      .then(({ body }) => body);
  }

  handleFailure(taskId, options) {
    return this.post( `/${taskId}/failure`,
      { json: true, body: { ...options, workerId: this.workerId } })
      .then(({ body }) => body);
  }

  handleBpmnError(taskId, errorCode) {
    return this.post( `/${taskId}/bpmnError`,
      { json: true, body: { errorCode, workerId: this.workerId } })
      .then(({ body }) => body);
  }

  extendLock(taskId, newDuration) {
    return this.post( `/${taskId}/extendLock`,
      { json: true, body: { newDuration,  workerId: this.workerId } })
      .then(({ body }) => body);
  }

  unlock(taskId) {
    return this.post( `/${taskId}/unlock`, { json: true })
      .then(({ body }) => body);
  }
}

module.exports = EngineClient;