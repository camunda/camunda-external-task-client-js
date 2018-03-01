const { MISSING_AUTH_PARAMS } = require('./errors');

class BasicAuthInterceptor {
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

  getHeader({ username, password } ) {
    const encoded = new Buffer(`${username}:${password}`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }

  interceptor(config) {
    const headers = Object.assign({}, config.headers, this.header);
    return Object.assign({}, config, { headers });
  }
}

module.exports = BasicAuthInterceptor;