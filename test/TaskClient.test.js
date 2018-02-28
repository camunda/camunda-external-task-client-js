/* eslint-disable no-mixed-spaces-and-tabs */
jest.mock('got');

const { MISSING_TASK, MISSING_ERROR_CODE } = require('../lib/constants');

const TaskClient = require('../lib/TaskClient');

const EngineClient = require('../lib/EngineClient');

describe('TaskClient', () => {
  const engineClient = new EngineClient({ workerId: 'someWorker', path: 'some/path' });
  const taskClient = new TaskClient(engineClient);

  describe('complete', () => {
    test('should throw an error if no taskid is provided', () => {
      expect(() => taskClient.complete()).toThrowError(MISSING_TASK);
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
  });

  describe('handleFailure', () => {
    test('should throw an error if no taskid is provided', () => {
      expect(() => taskClient.handleFailure()).toThrowError(MISSING_TASK);
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
  });

  describe('handleBpmnError', () => {
    test('should throw an error if no taskid is provided', () => {
      expect(() => taskClient.handleBpmnError()).toThrowError(MISSING_TASK);
    });
    test('should throw an error if no error code is provided', () => {
      expect( () => taskClient.handleBpmnError('fooId')).toThrow(MISSING_ERROR_CODE);
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

  });

});

