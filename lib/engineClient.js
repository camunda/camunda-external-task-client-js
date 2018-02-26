const got = require('got');
const extend = require('extend');

class EngineClient {
  constructor(options) {
    this.workerId = options.workerId;
    this.path = options.path;
    this.fetchAndLock = this.fetchAndLock.bind(this);
  }

  fetchAndLock(requestBody) {
    return new Promise( (resolve, reject) =>{
      got.post( `${this.path}/fetchAndLock`, {
        json: true, body: extend( requestBody, { workerId: this.workerId })
      })
        .then(({ body }) => resolve(body))
        .catch((error) => reject(error));
    });
  }
}
module.exports = EngineClient;