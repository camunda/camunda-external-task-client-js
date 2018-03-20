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

  /**
   * @throws HTTPError
   * @param path
   * @param options
   * @returns {Promise}
   */
  post(path, options) {
    return this.request('POST', path, options)
      .then(({ body }) => body)
      .catch((e) => {
        throw e.response ? e.response.body.message : e;
      });
  }

  /**
   * @throws HTTPError
   * @param path
   * @param options
   * @returns {Promise}
   */
  get(path, options) {
    return this.request('GET', path, options)
      .then(({ body }) => body)
      .catch((e) => {
        throw e.response ? e.response.body.message : e;
      });
  }

  /**
   * @throws HTTPError
   * @param requestBody
   * @returns {Promise}
   */
  fetchAndLock(requestBody) {
    return this.post('/fetchAndLock', {
      json: true, body: { ...requestBody, workerId: this.workerId  }
    });
  }

  /**
   * @throws HTTPError
   * @param id
   * @param variables
   * @returns {Promise}
   */
  complete({ id, variables }) {
    return this.post(`/${id}/complete`, {
      json: true, body: { workerId: this.workerId, variables }
    });
  }

  /**
   * @throws HTTPError
   * @param id
   * @param options
   * @returns {Promise}
   */
  handleFailure({ id }, options) {
    return this.post( `/${id}/failure`, {
      json: true, body: { ...options, workerId: this.workerId }
    });
  }

  /**
   * @throws HTTPError
   * @param id
   * @param errorCode
   * @returns {Promise}
   */
  handleBpmnError({ id }, errorCode) {
    return this.post( `/${id}/bpmnError`, {
      json: true, body: { errorCode, workerId: this.workerId }
    });
  }

  /**
   * @throws HTTPError
   * @param id
   * @param newDuration
   * @returns {Promise}
   */
  extendLock({ id }, newDuration) {
    return this.post( `/${id}/extendLock`, {
      json: true, body: { newDuration,  workerId: this.workerId }
    });
  }

  /**
   * @throws HTTPError
   * @param id
   * @returns {Promise}
   */
  unlock({ id }) {
    return this.post( `/${id}/unlock`, { json: true });
  }
}

module.exports = EngineService;