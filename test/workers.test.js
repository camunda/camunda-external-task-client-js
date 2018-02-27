const Workers = require('../lib/Workers');

const customWorkersOptions = {
  path: 'http://localhost:XXXX/engine-rest/external-task',
  workerId: 'foobarId',
  maxTasks: 3,
  interval: 100,
  lockDuration: 30000
};

describe('workers', () => {
  describe('registerWorker method', () => {

    test('should throw error if api path wasn\'t passed as parameter', () => {
      expect(() => { new Workers();}).toThrow();
    });

    const workers = new Workers(customWorkersOptions);

    test('should overwrite default with custom workers config', () =>{
      expect(workers.options.workerId).toBe(customWorkersOptions.workerId);
      expect(workers.options.maxTasks).toBe(customWorkersOptions.maxTasks);
      expect(workers.options.interval).toBe(customWorkersOptions.interval);
      expect(workers.options.lockDuration).toBe(customWorkersOptions.lockDuration);
    });

    // Register workers
    const fooWork = () => 'foobar';
    const customConfig = { lockDuration: 3000 };

    test('should register worker without custom config ', () => {
      const barWorker = workers.registerWorker('bar', fooWork);
      expect(barWorker.handler).not.toBeUndefined();
    });

    test('should register worker with custom config ', () =>{
      const fooWorker = workers.registerWorker('bar2', customConfig, fooWork);
      expect(fooWorker.lockDuration).toBe(customConfig.lockDuration);
    });

    // REDO test description
    test('should throw error if work function is not passed', () => {
      workers.registerWorker('foo', fooWork);
      expect(() => { workers.registerWorker('foo', fooWork); }).toThrow();
    });
  });
  describe('poll method ', () => {
    jest.useFakeTimers();
    const workers = new Workers(customWorkersOptions);
    test('should call itself again after timeout when no worker registered', () => {
      expect(setTimeout)
        .toHaveBeenLastCalledWith(workers.poll, customWorkersOptions.interval );
    });
  });
});
