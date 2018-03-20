const events = require('events');
jest.mock('got');

const { MISSING_TASK, MISSING_ERROR_CODE, MISSING_NEW_DURATION } = require('../lib/__internal/errors');

const TaskService = require('../lib/TaskService');
const EngineService = require('../lib/__internal/EngineService');
const VariableService = require('../lib/__internal/VariableService');

describe('TaskService', () => {
  let engineService, taskService;
  beforeEach(() => {
    engineService = new EngineService({ workerId: 'someWorker', baseUrl: 'some/baseUrl' });
    taskService = new TaskService(new events(), engineService);
  });

  it('error(event, data) should emit error event with data: ', () => {
    // given
    const emitSpy = jest.spyOn(taskService.events, 'emit');
    const event = 'some_event';
    const expectedEvent = `${event}:error`;
    const expectedData = 'some data';

    // when
    taskService.error(event, expectedData);

    // then
    expect(emitSpy).toBeCalledWith(expectedEvent, expectedData);
  });

  describe('sanitizeTask', () => {
    test('should return task with id when task id is provided', () => {
      expect(taskService.sanitizeTask('2')).toEqual({ id: '2' });
    });

    test('should return task with dirty variables when task is provided', () => {
      // given
      const expectedVariables = { fooVar: { value: 'foo', type: 'String', valueInfo: {} } };
      let variables = new VariableService();
      variables.setAllTyped(expectedVariables);
      const task = { id: '2', variables };
      const expectedSantizedTask = { ...task, variables: expectedVariables };

      // then
      expect(taskService.sanitizeTask({ id: '2', variables })).toEqual(expectedSantizedTask);
    });
  });

  describe('using taskId', () => {
    describe('complete', () => {
      test('should throw an error if no taskid is provided', async() => {
        try {
          await taskService.complete();
        } catch (e) {
          expect(e).toEqual(new Error(MISSING_TASK));
        }
      });

      test('should call api complete with provided task', () => {
        //given
        const completeSpy = jest.spyOn(engineService, 'complete');
        const expectedTaskId = 'foo';

        //when
        taskService.complete(expectedTaskId);

        //then
        expect(completeSpy).toBeCalledWith({ id: expectedTaskId });
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

      test('should call api handleFailure with provided task', () => {
        //given
        const handleFailureSpy = jest.spyOn(engineService, 'handleFailure');
        const expectedTaskId = 'foo';
        const expectedPayload = { errorMessage: 'some error message' };

        //when
        taskService.handleFailure(expectedTaskId, expectedPayload);

        //then
        expect(handleFailureSpy).toBeCalledWith({ id: expectedTaskId }, expectedPayload);
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

      test('should call api handleBpmnError with provided task and error code', () => {
        //given
        const handleBpmnErrorSpy = jest.spyOn(engineService, 'handleBpmnError');
        const expectedTaskId = 'foo';
        const expectedErrorCode = 'foo123';

        //when
        taskService.handleBpmnError(expectedTaskId, expectedErrorCode);

        //then
        expect(handleBpmnErrorSpy).toBeCalledWith({ id: expectedTaskId }, expectedErrorCode);

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

      test('should call api extendLock with provided task and error code', () => {
        //given
        const extendLockSpy = jest.spyOn(engineService, 'extendLock');
        const expectedTaskId = 'foo';
        const expectedNewDuration = 100;

        //when
        taskService.extendLock(expectedTaskId, expectedNewDuration);

        //then
        expect(extendLockSpy).toBeCalledWith({ id: expectedTaskId }, expectedNewDuration);
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

      test('should call api unlock with provided task', () => {
        //given
        const expectedTaskId = 'foo';

        //when
        taskService.unlock(expectedTaskId);

        //then
        expect(unlockSpy).toBeCalledWith({ id: expectedTaskId });
      });
    });
  });

  describe('using task object', () => {
    let variables, task, expectedSantizedTask;
    beforeEach(() => {
      const expectedVariables = { fooVar: { value: 'foo', type: 'String', valueInfo: {} } };
      variables = new VariableService();
      variables.setAllTyped(expectedVariables);
      task = { id: '2', variables };
      expectedSantizedTask = { ...task, variables: expectedVariables };
    });

    describe('complete', () => {
      test('should call api complete with provided task', () => {
        //given
        const completeSpy = jest.spyOn(engineService, 'complete');

        //when
        taskService.complete(task);

        //then
        expect(completeSpy).toBeCalledWith(expectedSantizedTask);
      });
    });

    describe('handleFailure', () => {
      test('should call api handleFailure with provided task and error message', () => {
        //given
        const handleFailureSpy = jest.spyOn(engineService, 'handleFailure');
        const expectedPayload = { errorMessage: 'some error message' };

        //when
        taskService.handleFailure(task, expectedPayload);

        //then
        expect(handleFailureSpy).toBeCalledWith(expectedSantizedTask, expectedPayload);
      });
    });

    describe('handleBpmnError', () => {
      test('should call api handleBpmnError with provided task and error code', () => {
        //given
        const handleBpmnErrorSpy = jest.spyOn(engineService, 'handleBpmnError');
        const expectedErrorCode = 'foo123';

        //when
        taskService.handleBpmnError(task, expectedErrorCode);

        //then
        expect(handleBpmnErrorSpy).toBeCalledWith(expectedSantizedTask, expectedErrorCode);

      });
    });

    describe('extendLock', () => {
      test('should call api extendLock with provided task and lock duration', () => {
        //given
        const extendLockSpy = jest.spyOn(engineService, 'extendLock');
        const expectedNewDuration = 100;

        //when
        taskService.extendLock(task, expectedNewDuration);

        //then
        expect(extendLockSpy).toBeCalledWith(expectedSantizedTask, expectedNewDuration);
      });
    });

    describe('unlock', () => {
      test('should call api unlock with provided task', () => {
        //given
        const unlockSpy = jest.spyOn(engineService, 'unlock');

        //when
        taskService.unlock(task);

        //then
        expect(unlockSpy).toBeCalledWith(expectedSantizedTask);
      });
    });
  });


});