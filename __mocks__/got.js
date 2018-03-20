const handleRequest = (url, { errorType, error }) => {
  switch (errorType) {
  case 'FAIL_WITHOUT_RESPONSE':
  case 'FAIL_WITH_RESPONSE':
    return Promise.reject(error);
  default:
    return Promise.resolve({ body: [] });
  }
};


const got = handleRequest;
got.post = got.get = handleRequest;


module.exports = jest.fn().mockImplementation(got);