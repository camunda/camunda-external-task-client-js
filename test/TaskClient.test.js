const events = require('events');
jest.mock('got');

const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('../lib/__internal/errors');

const TaskClient = require('../lib/TaskClient');

const EngineClient = require('../lib/__internal/EngineClient');

describe('TaskClient', () => {
  let engineClient, taskClient;
  beforeEach(() => {
    engineClient = new EngineClient({ workerId: 'someWorker', path: 'some/path' });
    taskClient = new TaskClient(new events(), engineClient);
  });

  describe('sanitizeTask', () => {
    test('should return task id when task id is provided', () => {
      expect(taskClient.sanitizeTask('2')).toBe('2');
    });

    test('should return task id when task is provided', () => {
      expect(taskClient.sanitizeTask({ id: '2' })).toBe('2');
    });
  });

  describe('complete', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskClient.complete();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should call api complete with provided task id if task id provided', () => {
      //given
      const completeSpy = jest.spyOn(engineClient, 'complete');
      const expectedTaskId = 'foo';

      //when
      taskClient.complete(expectedTaskId);

      //then
      expect(completeSpy).toBeCalledWith(expectedTaskId);
    });

    test('should call api complete with provided task id if task provided', () => {
      //given
      const completeSpy = jest.spyOn(engineClient, 'complete');
      const expectedTaskId = 'foo';

      //when
      taskClient.complete({ id: expectedTaskId });

      //then
      expect(completeSpy).toBeCalledWith(expectedTaskId);
    });
  });

  describe('handleFailure', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskClient.handleFailure();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should call api handleFailure with provided task id if task id provided', () => {
      //given
      const handleFailureSpy = jest.spyOn(engineClient, 'handleFailure');
      const expectedTaskId = 'foo';
      const expectedPayload = { errorMessage: 'some error message' };

      //when
      taskClient.handleFailure(expectedTaskId, expectedPayload);

      //then
      expect(handleFailureSpy).toBeCalledWith(expectedTaskId, expectedPayload);
    });

    test('should call api handleFailure with provided task id if task provided', () => {
      //given
      const handleFailureSpy = jest.spyOn(engineClient, 'handleFailure');
      const expectedTaskId = 'foo';
      const expectedPayload = { errorMessage: 'some error message' };

      //when
      taskClient.handleFailure({ id: expectedTaskId }, expectedPayload);

      //then
      expect(handleFailureSpy).toBeCalledWith(expectedTaskId, expectedPayload);
    });
  });

  describe('handleBpmnError', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskClient.handleBpmnError();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should throw an error if no error code is provided', async() => {
      try {
        await taskClient.handleBpmnError('fooId');
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_ERROR_CODE));
      }
    });

    test('should call api handleBpmnError with provided task id and error code if task id provided', () => {
      //given
      const handleBpmnErrorSpy = jest.spyOn(engineClient, 'handleBpmnError');
      const expectedTaskId = 'foo';
      const expectedErrorCode = 'foo123';

      //when
      taskClient.handleBpmnError(expectedTaskId, expectedErrorCode);

      //then
      expect(handleBpmnErrorSpy).toBeCalledWith(expectedTaskId, expectedErrorCode);

    });

    test('should call api handleBpmnError with provided task id and error code if task provided', () => {
      //given
      const handleBpmnErrorSpy = jest.spyOn(engineClient, 'handleBpmnError');
      const expectedTaskId = 'foo';
      const expectedErrorCode = 'foo123';

      //when
      taskClient.handleBpmnError({ id: expectedTaskId }, expectedErrorCode);

      //then
      expect(handleBpmnErrorSpy).toBeCalledWith(expectedTaskId, expectedErrorCode);

    });
  });

  describe('extendLock', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskClient.extendLock();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should throw an error if no new lock duration is provided', async() => {
      try {
        await taskClient.extendLock('fooId');
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_NEW_DURATION));
      }
    });

    test('should call api extendLock with provided task id and error code if task id provided', () => {
      //given
      const extendLockSpy = jest.spyOn(engineClient, 'extendLock');
      const expectedTaskId = 'foo';
      const expectedNewDuration = 100;

      //when
      taskClient.extendLock(expectedTaskId, expectedNewDuration);

      //then
      expect(extendLockSpy).toBeCalledWith(expectedTaskId, expectedNewDuration);
    });

    test('should call api extendLock with provided task id and error code if task provided', () => {
      //given
      const extendLockSpy = jest.spyOn(engineClient, 'extendLock');
      const expectedTaskId = 'foo';
      const expectedNewDuration = 100;

      //when
      taskClient.extendLock({ id: expectedTaskId }, expectedNewDuration);

      //then
      expect(extendLockSpy).toBeCalledWith(expectedTaskId, expectedNewDuration);
    });
  });

  describe('unlock', () => {
    let unlockSpy;
    beforeEach(() => {
      unlockSpy = jest.spyOn(engineClient, 'unlock');
    });

    test('should throw an error if no task id is provided', async() => {
      try {
        await taskClient.unlock();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should call api unlock with provided task id if task id provided', () => {
      //given
      const expectedTaskId = 'foo';

      //when
      taskClient.unlock(expectedTaskId);

      //then
      expect(unlockSpy).toBeCalledWith(expectedTaskId);
    });

    test('should call api unlock with provided task id if task provided', () => {
      //given
      const expectedTaskId = 'boo';

      //when
      taskClient.unlock({ id: expectedTaskId });

      //then
      expect(unlockSpy).toBeCalledWith(expectedTaskId);
    });
  });

});