jest.mock('got');

const got = require('got');

const EngineClient = require('../lib/EngineClient');

describe('EngineClient', () => {
  let engineClient, postSpy;
  beforeEach(() => {
    engineClient = new EngineClient({ workerId: 'someWorker', path: 'some/path' });
    postSpy = jest.spyOn(engineClient, 'post');
  });

  test('post', () => {
    //given
    const expectedUrl = 'some/url';
    const expectedPayload = { key: 'some value' };

    //when
    engineClient.post(expectedUrl, expectedPayload);

    //then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  test('fetchAndLock', () => {
    //given
    const expectedUrl = '/fetchAndLock';
    const expectedReqBody = { someKey: 'some value' };
    const expectedPayload = {
      json: true,
      body: Object.assign({}, expectedReqBody, { workerId: engineClient.workerId })
    };

    // when
    engineClient.fetchAndLock(expectedReqBody);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  test('complete', () => {
    // given
    const expectedTaskId = 'foo';
    const expectedUrl = `/${expectedTaskId}/complete`;
    const expectedPayload = {
      json: true,
      body: { workerId: engineClient.workerId }
    };

    // when
    engineClient.complete(expectedTaskId);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);

  });

  test('handleFailure', () => {
    // given
    const expectedTaskId = 'foo';
    const expectedUrl = `/${expectedTaskId}/failure`;
    const expectedRequestBody = { errorMessage: 'some error message' };
    const expectedPayload = {
      json: true,
      body: Object.assign({}, expectedRequestBody, { workerId: engineClient.workerId })
    };

    // when
    engineClient.handleFailure(expectedTaskId, expectedRequestBody);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);

  });

  test('handleBpmnError', () => {
    // given
    const expectedTaskId = 'foo';
    const expectedUrl = `/${expectedTaskId}/bpmnError`;
    const expectedErrorCode =  'some error code';
    const expectedPayload = {
      json: true,
      body: Object.assign({}, { errorCode: expectedErrorCode }, { workerId: engineClient.workerId })
    };

    // when
    engineClient.handleBpmnError(expectedTaskId, expectedErrorCode);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);

  });

  test('extendLockTime', () => {
    // given
    const expectedTaskId = 'foo';
    const expectedUrl = `/${expectedTaskId}/extendLock`;
    const expectedNewDuration = 100 ;
    const expectedPayload = { json: true, body: Object.assign({}, { newDuration: expectedNewDuration }, { workerId: engineClient.workerId }) };

    // when
    engineClient.handleExtendLock(expectedTaskId, expectedNewDuration);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);

  });

  describe('request', () => {
    jest.mock('got', () => jest.fn());
    it('should send request with given options', () => {
      //given

      const method = 'POST';
      const path = '/some/url';
      const expectedUrl = `${engineClient.baseUrl}${path}`;
      const expectedPayload = { method, key: 'some value' };

      //when
      engineClient.request(method, path, expectedPayload);

      //then
      expect(got).toBeCalledWith(expectedUrl, expectedPayload);
    });

    it('should get request options from interceptors', () => {
      //given
      const method = 'POST';
      const path = '/some/url';
      const expectedUrl = `${engineClient.baseUrl}${path}`;
      const expectedInitialPayload = { key: 'some value' };
      const someExpectedAddedPaylod = { someNewKey: 'some new value' };
      const anotherExpectedAddedPaylod = { anotherNewKey: 'another new value' };
      const someInterceptor = (config) => Object.assign({}, config, someExpectedAddedPaylod);
      const anotherInterceptor = (config) => Object.assign({}, config, anotherExpectedAddedPaylod);
      engineClient.interceptors = [someInterceptor, anotherInterceptor];
      const expectedPayload = Object.assign(
        { method },
        expectedInitialPayload,
        someExpectedAddedPaylod,
        anotherExpectedAddedPaylod
      );

      //when
      engineClient.request(method, path, expectedPayload);

      //then
      expect(got).toBeCalledWith(expectedUrl, expectedPayload);

    });
  });
});
