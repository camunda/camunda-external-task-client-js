/* eslint-disable no-mixed-spaces-and-tabs */
jest.mock('got');

const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('../lib/errors');

const TaskClient = require('../lib/TaskClient');

const EngineClient = require('../lib/EngineClient');

describe('TaskClient', () => {
  const engineClient = new EngineClient({ workerId: 'someWorker', path: 'some/path' });
  const taskClient = new TaskClient(engineClient);

  describe('complete', () => {
    test('should throw an error if no taskid is provided', async() => {
      try {
        await taskClient.complete();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
    });

    test('should call api complete with provided task id', () => {
      //given
      const completeSpy = jest.spyOn(engineClient, 'complete');
      const expectedTaskId = 'foo';

      //when
      taskClient.complete(expectedTaskId);

      //then
      expect(completeSpy).toBeCalledWith(expectedTaskId);
    });

    test('should call api complete with provided task', () => {
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

    test('should call api handleFailure with provided task id', () => {
      //given
      const handleFailureSpy = jest.spyOn(engineClient, 'handleFailure');
      const expectedTaskId = 'foo';
      const expectedPayload = { errorMessage: 'some error message' };

      //when
      taskClient.handleFailure(expectedTaskId, expectedPayload);

      //then
      expect(handleFailureSpy).toBeCalledWith(expectedTaskId, expectedPayload);
    });

    test('should call api handleFailure with provided task', () => {
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

	  test('should call api handleBpmnError with povided task id and error code', () => {
		  //given
		  const handleBpmnErrorSpy = jest.spyOn(engineClient, 'handleBpmnError');
		  const expectedTaskId = 'foo';
		  const expectedErrorCode = 'foo123';

		  //when
		  taskClient.handleBpmnError(expectedTaskId, expectedErrorCode);

		  //then
		  expect(handleBpmnErrorSpy).toBeCalledWith(expectedTaskId, expectedErrorCode);

	  });

	  test('should call api handleBpmnError with povided task and error code', () => {
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

  describe('handleExtendLock', () => {
	  test('should throw an error if no taskid is provided', async() => {
      try {
        await taskClient.handleExtendLock();
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_TASK));
      }
	  });

    test('should throw an error if no new lock duration is provided', async() => {
      try {
        await taskClient.handleExtendLock('fooId');
      } catch (e) {
        expect(e).toEqual(new Error(MISSING_NEW_DURATION));
      }
    });

	  test('should call api handleExtendLock with povided task id and error code', () => {
		  //given
		  const handleExtendLockSpy = jest.spyOn(engineClient, 'handleExtendLock');
      const expectedTaskId = 'foo';
		  const expectedNewDuration = 100;

		  //when
		  taskClient.handleExtendLock(expectedTaskId, expectedNewDuration);

		  //then
		  expect(handleExtendLockSpy).toBeCalledWith(expectedTaskId, expectedNewDuration);
	  });

	  test('should call api handleExtendLock with povided task and error code', () => {
		  //given
		  const handleExtendLockSpy = jest.spyOn(engineClient, 'handleExtendLock');
      const expectedTaskId = 'foo';
		  const expectedNewDuration = 100;

		  //when
		  taskClient.handleExtendLock({ id: expectedTaskId }, expectedNewDuration);

		  //then
		  expect(handleExtendLockSpy).toBeCalledWith(expectedTaskId, expectedNewDuration);
	  });
  });

});