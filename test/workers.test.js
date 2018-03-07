const Workers = require('../lib/Workers');

const {
  WRONG_INTERCEPTOR,
  MISSING_PATH,
  ALREADY_REGISTERED,
  MISSING_HANDLER,
  WRONG_MIDDLEWARES
} = require('../lib/__internal/errors');

jest.mock('got');


const customWorkersOptions = {
  path: 'http://localhost:XXXX/engine-rest/',
  workerId: 'foobarId',
  maxTasks: 3,
  interval: 100,
  lockDuration: 30000
};

describe('workers', () => {
  describe('poll ', () => {
    jest.useFakeTimers();
    describe('when autoPoll is false', () => {
      let pollSpy, workers, engineClient;

      beforeEach(() => {
        workers = new Workers({ ...customWorkersOptions, autoPoll: false });
        engineClient = workers.engineClient;
        pollSpy = jest.spyOn(workers, 'poll');
      });

      test('calling start should call poll', () => {
        // when
        workers.start();

        //then
        expect(pollSpy).toHaveBeenCalled();
      });

      test('should call itself again after timeout when no worker is registered', () => {
        // when
        workers.start();
        jest.advanceTimersByTime(customWorkersOptions.interval);

        // then
        expect(pollSpy).toHaveBeenCalledTimes(2);
      });

      test('should not call itself again after timeout when there are registered workers', () => {
        //given
        workers.subscribe('foo', () => {});

        // when
        workers.start();
        jest.advanceTimersByTime(customWorkersOptions.interval);

        // then
        expect(pollSpy).toHaveBeenCalledTimes(1);
      });

      test('should fetchAndLock and then call itself again when there are registered workers', async() => {
        // given
        const fetchAndLockSpy = jest.spyOn(engineClient, 'fetchAndLock');
        workers.subscribe('foo', () => {});

        // when
        workers.start();
        jest.advanceTimersByTime(customWorkersOptions.interval);

        //then
        expect(fetchAndLockSpy).toBeCalled();
        await(engineClient.fetchAndLock({}));
        jest.advanceTimersByTime(customWorkersOptions.interval);
        expect(pollSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe('when autoPoll is true', () => {
      it('should call itself automatically when autoPoll is true', () => {
        // given
        const workers = new Workers({ ...customWorkersOptions, autoPoll: true });
        const pollSpy = jest.spyOn(workers, 'poll');

        //when
        jest.advanceTimersByTime(2*customWorkersOptions.interval);

        // then
        expect(pollSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('stop', () => {
      it('should stop polling', () => {
        // given: we advance time twice then call stop
        const workers = new Workers(customWorkersOptions);
        jest.advanceTimersByTime(2*customWorkersOptions.interval);
        workers.stop();
        const pollSpy = jest.spyOn(workers, 'poll');

        // when
        jest.advanceTimersByTime(2*customWorkersOptions.interval);

        // then
        expect(pollSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('subscribe', () => {

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


    test('should subscribe worker without custom config ', () => {
      // given
      const fooWorker = workers.subscribe('foo', fooWork);

      // then
      expect(fooWorker.handler).not.toBeUndefined();
    });

    test('should subscribe worker with custom config ', () =>{
      // given
      const fooWorker = workers.subscribe('foo', customConfig, fooWork);

      // then
      expect(fooWorker.lockDuration).toBe(customConfig.lockDuration);
    });

    test('should throw error if try to register twice', () => {
      // given
      workers.subscribe('foo', fooWork);

      // then
      expect(() => { workers.subscribe('foo', fooWork); }).toThrowError(ALREADY_REGISTERED);
    });

    test('should throw error if work function is not passed', () => {
      expect(() => { workers.subscribe('foo2'); }).toThrowError(MISSING_HANDLER);
    });


    test('should allow to unregister a worker from a topic', () => {
      // given
      const fooWorker = workers.subscribe('foo', fooWork);

      // when
      fooWorker.unregister();

      // then
      expect(workers.workers['foo']).toBeUndefined();
    });



  });

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

  describe('middlewares', () => {
    it('should not add middlewares if they are not provided as a function or array of functions', () => {
      // given
      const options = { ...customWorkersOptions, use: [] };

      // then
      expect(() => new Workers(options)).toThrowError(WRONG_MIDDLEWARES);
    });

    it('should accept middleware function', () => {
      //given
      const middleware = jest.fn();
      const options = { ...customWorkersOptions, use: middleware };
      const workers = new Workers(options);

      //then
      expect(middleware).toBeCalledWith(workers);
    });

    it('should accept middlewares array', () => {
      //given
      const middlewares = [jest.fn(), jest.fn()];
      const options = { ...customWorkersOptions, use: middlewares };
      const workers = new Workers(options);

      //then
      middlewares.forEach(middleware => expect(middleware).toBeCalledWith(workers));
    });
  });
});
