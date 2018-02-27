jest.mock('got');

const TaskClient = require('../lib/TaskClient');

const EngineClient = require('../lib/EngineClient');


describe('TaskClient', () => {
  const engineClient = new EngineClient({ workerId: 'someWorker', path: 'some/path' });
  const taskClient = new TaskClient(engineClient);

  describe('complete', () => {
    test('should throw an error if no taskid is provided', () => {
      expect(() => taskClient.complete()).toThrow();
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
});