const Workers = require('../lib/Workers');

const { WRONG_INTERCEPTOR, MISSING_PATH, ALREADY_REGISTERED, MISSING_HANDLER } = require('../lib/errors');

jest.mock('got');


const customWorkersOptions = {
  path: 'http://localhost:XXXX/engine-rest/external-task',
  workerId: 'foobarId',
  maxTasks: 3,
  interval: 100,
  lockDuration: 30000
};

describe('workers', () => {
  describe('interceptors', () => {
    it('should not add interceptors if they are not provided as a function or array of functions', () => {
      // given
      const options = { ...customWorkersOptions, interceptors: [] };

      // then
      expect(() => new Workers(options)).toThrowError(WRONG_INTERCEPTOR);
    });

    it('should add interceptors if they are provided as a function', () => {
      // given
      const foo = () => {};
      const expectedInterceptors = [foo];
      const options ={ ...customWorkersOptions, interceptors: foo };
      const workers = new Workers(options);

      // then
      expect(workers.engineClient.interceptors).toEqual(expectedInterceptors);
    });

    it('should add interceptors if they are provided as an array of functions', () => {
      // given
      const foo = () => {};
      const expectedInterceptors = [foo];
      const options = { ...customWorkersOptions, interceptors: [foo] };
      const workers = new Workers(options);

      // then
      expect(workers.engineClient.interceptors).toEqual(expectedInterceptors);

    });
  });

  describe('registerWorker', () => {

    test('should throw error if api path wasn\'t passed as parameter', () => {
      expect(() => { new Workers();}).toThrowError(MISSING_PATH);
    });

    let workers, fooWork, customConfig;

    beforeEach( () => {
      workers = new Workers(customWorkersOptions);
      fooWork = () => 'foobar';
      customConfig = { lockDuration: 3000 };
    });

    test('should overwrite default with custom workers config', () =>{
      expect(workers.options.workerId).toBe(customWorkersOptions.workerId);
      expect(workers.options.maxTasks).toBe(customWorkersOptions.maxTasks);
      expect(workers.options.interval).toBe(customWorkersOptions.interval);
      expect(workers.options.lockDuration).toBe(customWorkersOptions.lockDuration);
    });


    test('should register worker without custom config ', () => {
      // given
      const fooWorker = workers.registerWorker('foo', fooWork);

      // then
      expect(fooWorker.handler).not.toBeUndefined();
    });

    test('should register worker with custom config ', () =>{
      // given
      const fooWorker = workers.registerWorker('foo', customConfig, fooWork);

      // then
      expect(fooWorker.lockDuration).toBe(customConfig.lockDuration);
    });

    test('should throw error if try to register twice', () => {
      // given
      workers.registerWorker('foo', fooWork);

      // then
      expect(() => { workers.registerWorker('foo', fooWork); }).toThrowError(ALREADY_REGISTERED);
    });

    test('should throw error if work function is not passed', () => {
      expect(() => { workers.registerWorker('foo2'); }).toThrowError(MISSING_HANDLER);
    });


    test('should allow to unregister a worker from a topic', () => {
      // given
      const fooWorker = workers.registerWorker('foo', fooWork);

      // when
      fooWorker.unregister();

      // then
      expect(workers.workers['foo']).toBeUndefined();
    });



  });
  describe('poll ', () => {
    jest.useFakeTimers();
    let pollSpy, workers, engineClient;
    beforeEach(() => {
      workers = new Workers(customWorkersOptions);
      engineClient = workers.engineClient;
      pollSpy = jest.spyOn(workers, 'poll');
    });

    test('should call itself again after timeout when no worker registered', () => {
      // when
      jest.advanceTimersByTime(2*customWorkersOptions.interval);

      // then
      expect(pollSpy).toHaveBeenCalledTimes(1);
    });

    test('should not call itself again after timeout when there are registered workers', () => {
      // given
      workers.registerWorker('foo', () => {});

      // when
      jest.advanceTimersByTime(2*customWorkersOptions.interval);

      // then
      expect(pollSpy).toHaveBeenCalledTimes(0);
    });

    test('should fetchAndLock and then call itself again when there are registered workers', async() => {
      // given
      const fetchAndLockSpy = jest.spyOn(engineClient, 'fetchAndLock');
      workers.registerWorker('foo', () => {});

      // when
      jest.advanceTimersByTime(2*customWorkersOptions.interval);

      //then
      expect(fetchAndLockSpy).toBeCalled();
      await(engineClient.fetchAndLock({}));
      jest.advanceTimersByTime(customWorkersOptions.interval);
      expect(pollSpy).toHaveBeenCalledTimes(1);
    });

  });
});
