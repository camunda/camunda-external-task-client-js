jest.mock('got');

const got = require('got');

const EngineClient = require('../lib/EngineClient');

describe('EngineClient', () => {
  const engineClient = new EngineClient({ workerId: 'someWorker', path: 'some/path' });
  const postSpy = jest.spyOn(got, 'post');

  test('fetchAndLock', () => {
    //given
    const expectedUrl = `${engineClient.path}/fetchAndLock`;
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
    const expectedUrl = `${engineClient.path}/${expectedTaskId}/complete`;
    const expectedPayload = {
      json: true,
      body: { workerId: engineClient.workerId }
    };

    // when
    engineClient.complete(expectedTaskId);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);

  });
});