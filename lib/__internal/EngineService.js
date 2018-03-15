const got = require('got');

class EngineService {
  constructor({ workerId, baseUrl, interceptors }) {
    this.workerId = workerId;
    this.baseUrl = `${baseUrl.replace(/\/$/, '')}/external-task`;
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

  complete({ id, variables }) {
    return this.post(`/${id}/complete`,
      { json: true, body: { workerId: this.workerId, variables } })
      .then(({ body }) => body);
  }

  handleFailure({ id }, options) {
    return this.post( `/${id}/failure`,
      { json: true, body: { ...options, workerId: this.workerId } })
      .then(({ body }) => body);
  }

  handleBpmnError({ id }, errorCode) {
    return this.post( `/${id}/bpmnError`,
      { json: true, body: { errorCode, workerId: this.workerId } })
      .then(({ body }) => body);
  }

  extendLock({ id }, newDuration) {
    return this.post( `/${id}/extendLock`,
      { json: true, body: { newDuration,  workerId: this.workerId } })
      .then(({ body }) => body);
  }

  unlock({ id }) {
    return this.post( `/${id}/unlock`, { json: true })
      .then(({ body }) => body);
  }
}

module.exports = EngineService;