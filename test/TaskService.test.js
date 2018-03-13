const events = require('events');
jest.mock('got');

const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('../lib/__internal/errors');

const TaskService = require('../lib/TaskService');

const EngineService = require('../lib/__internal/EngineService');

describe('TaskService', () => {
  let engineService, taskService;
  beforeEach(() => {
    engineService = new EngineService({ workerId: 'someWorker', baseUrl: 'some/baseUrl' });
    taskService = new TaskService(new events(), engineService);
  });

  describe('sanitizeTask', () => {
    test('should return task id when task id is provided', () => {
      expect(taskService.sanitizeTask('2')).toBe('2');
    });

    test('should return task id when task is provided', () => {
      expect(taskService.sanitizeTask({ id: '2' })).toBe('2');
    });
  });

  describe('complete', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskService.complete();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should call api complete with provided task id if task id provided', () => {
      //given
      const completeSpy = jest.spyOn(engineService, 'complete');
      const expectedTaskId = 'foo';

      //when
      taskService.complete(expectedTaskId);

      //then
      expect(completeSpy).toBeCalledWith(expectedTaskId);
    });

    test('should call api complete with provided task id if task provided', () => {
      //given
      const completeSpy = jest.spyOn(engineService, 'complete');
      const expectedTaskId = 'foo';

      //when
      taskService.complete({ id: expectedTaskId });

      //then
      expect(completeSpy).toBeCalledWith(expectedTaskId);
    });
  });

  describe('handleFailure', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskService.handleFailure();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should call api handleFailure with provided task id if task id provided', () => {
      //given
      const handleFailureSpy = jest.spyOn(engineService, 'handleFailure');
      const expectedTaskId = 'foo';
      const expectedPayload = { errorMessage: 'some error message' };

      //when
      taskService.handleFailure(expectedTaskId, expectedPayload);

      //then
      expect(handleFailureSpy).toBeCalledWith(expectedTaskId, expectedPayload);
    });

    test('should call api handleFailure with provided task id if task provided', () => {
      //given
      const handleFailureSpy = jest.spyOn(engineService, 'handleFailure');
      const expectedTaskId = 'foo';
      const expectedPayload = { errorMessage: 'some error message' };

      //when
      taskService.handleFailure({ id: expectedTaskId }, expectedPayload);

      //then
      expect(handleFailureSpy).toBeCalledWith(expectedTaskId, expectedPayload);
    });
  });

  describe('handleBpmnError', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskService.handleBpmnError();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should throw an error if no error code is provided', async() => {
      try {
        await taskService.handleBpmnError('fooId');
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_ERROR_CODE));
      }
    });

    test('should call api handleBpmnError with provided task id and error code if task id provided', () => {
      //given
      const handleBpmnErrorSpy = jest.spyOn(engineService, 'handleBpmnError');
      const expectedTaskId = 'foo';
      const expectedErrorCode = 'foo123';

      //when
      taskService.handleBpmnError(expectedTaskId, expectedErrorCode);

      //then
      expect(handleBpmnErrorSpy).toBeCalledWith(expectedTaskId, expectedErrorCode);

    });

    test('should call api handleBpmnError with provided task id and error code if task provided', () => {
      //given
      const handleBpmnErrorSpy = jest.spyOn(engineService, 'handleBpmnError');
      const expectedTaskId = 'foo';
      const expectedErrorCode = 'foo123';

      //when
      taskService.handleBpmnError({ id: expectedTaskId }, expectedErrorCode);

      //then
      expect(handleBpmnErrorSpy).toBeCalledWith(expectedTaskId, expectedErrorCode);

    });
  });

  describe('extendLock', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskService.extendLock();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should throw an error if no new lock duration is provided', async() => {
      try {
        await taskService.extendLock('fooId');
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_NEW_DURATION));
      }
    });

    test('should call api extendLock with provided task id and error code if task id provided', () => {
      //given
      const extendLockSpy = jest.spyOn(engineService, 'extendLock');
      const expectedTaskId = 'foo';
      const expectedNewDuration = 100;

      //when
      taskService.extendLock(expectedTaskId, expectedNewDuration);

      //then
      expect(extendLockSpy).toBeCalledWith(expectedTaskId, expectedNewDuration);
    });

    test('should call api extendLock with provided task id and error code if task provided', () => {
      //given
      const extendLockSpy = jest.spyOn(engineService, 'extendLock');
      const expectedTaskId = 'foo';
      const expectedNewDuration = 100;

      //when
      taskService.extendLock({ id: expectedTaskId }, expectedNewDuration);

      //then
      expect(extendLockSpy).toBeCalledWith(expectedTaskId, expectedNewDuration);
    });
  });

  describe('unlock', () => {
    let unlockSpy;
    beforeEach(() => {
      unlockSpy = jest.spyOn(engineService, 'unlock');
    });

    test('should throw an error if no task id is provided', async() => {
      try {
        await taskService.unlock();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should call api unlock with provided task id if task id provided', () => {
      //given
      const expectedTaskId = 'foo';

      //when
      taskService.unlock(expectedTaskId);

      //then
      expect(unlockSpy).toBeCalledWith(expectedTaskId);
    });

    test('should call api unlock with provided task id if task provided', () => {
      //given
      const expectedTaskId = 'boo';

      //when
      taskService.unlock({ id: expectedTaskId });

      //then
      expect(unlockSpy).toBeCalledWith(expectedTaskId);
    });
  });

});