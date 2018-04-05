const { MISSING_AUTH_PARAMS } = require("./__internal/errors");

class BasicAuthInterceptor {
  /**
   * @throws Error
   */
  constructor(options) {
    if (!options || !options.username || !options.password) {
      throw new Error(MISSING_AUTH_PARAMS);
    }

    /**
     * Bind member methods
     */
    this.getHeader = this.getHeader.bind(this);
    this.interceptor = this.interceptor.bind(this);

    this.header = this.getHeader(options);

    return this.interceptor;
  }

  getHeader({ username, password }) {
    const encoded = new Buffer(`${username}:${password}`).toString("base64");
    return { Authorization: `Basic ${encoded}` };
  }

  interceptor(config) {
    return { ...config, headers: { ...config.headers, ...this.header } };
  }
}

module.exports = BasicAuthInterceptor;
