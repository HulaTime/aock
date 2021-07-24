// jest.mock('http');

import { IncomingMessage, ServerResponse } from 'http';

import RequestTest from '../lib/RequestTest';

describe('ReqTest class', () => {
  test('it should exist', () => {
    expect(RequestTest).toBeDefined();
  });

  test('it should return something when instantiated', () => {
    expect(new RequestTest()).toBeDefined();
  });

  describe('class instance', () => {
    let reqTest: RequestTest;
    // const listenerResponse = {} as ServerResponse;

    beforeEach(() => {
      reqTest = new RequestTest();
    });

    describe('Setting test conditions', () => {
      test('there is class method to set each of the http verbs', () => {
        expect(typeof reqTest.get).toBe('function');
        expect(typeof reqTest.post).toBe('function');
        expect(typeof reqTest.patch).toBe('function');
        expect(typeof reqTest.put).toBe('function');
        expect(typeof reqTest.delete).toBe('function');
      });

      test('#get takes a single path parameter which is the path under test', () => {
        reqTest.get('/path');
      });

      test('#get the path paramteter must start with a "/"', () => {
        expect(() => {
          reqTest.get('path');
        }).toThrow('"path" must be prefixed with "/"');
      });
    });

    describe('#createListener', () => {
      test('returns an event listener that is used to determine whether test conditions are met', () => {
        const listener = reqTest.createListener();
        expect(typeof listener).toBe('function');
      });
    });

    describe('Evaluate test conditions', () => {
      const listenerRequest = {
        method: 'get',
        url: '/abc'
      } as IncomingMessage;
      const listenerResponse = {} as ServerResponse;

      test('there is a method #evaluate', () => {
        expect(typeof reqTest.evaluate).toBe('function');
      });

      test('#evaluate should return an object', () => {
        expect(typeof reqTest.evaluate()).toBe('object');
        expect(Array.isArray(reqTest.evaluate())).toBe(false);
      });

      test('#evaluate should return object with isSatisfied "false" if the listener has yet to be called', () => {
        const { isSatisfied } = reqTest.evaluate();
        expect(isSatisfied).toBe(false);
      });

      describe('HTTP verb and path matched', () => {
        describe('GET', () => {
          test('if path is matched, #evaluate should be satisfied if the http verb is the only test condition', () => {
            const listener = reqTest.createListener();
            reqTest.get('/abc');
            listener(listenerRequest, listenerResponse);
            const { isSatisfied } = reqTest.evaluate();
            expect(isSatisfied).toBe(true);
          });

          test('if path is matched, #evaluate should inform the path was matched', () => {
            const listener = reqTest.createListener();
            reqTest.get('/abc');
            listener(listenerRequest, listenerResponse);
            const { pathMatched } = reqTest.evaluate();
            expect(pathMatched).toBe(true);
          });
        });
      });
    });

    // test('it should have a function that returns the number of times the test has been triggered', () => {
    //   expect(reqTest.getCallCount()).toBe(0);
    // });

    // test('should have a method getCallCount', () => {
    //   expect(typeof reqTest.getCallCount).toBe('function');
    // });

    // test('#getCallCount should initially return 0', () => {
    //   expect(reqTest.getCallCount()).toBe(0);
    // });


    // describe('#createListener', () => {
    //   test('returns a listener', () => {
    //     expect(typeof reqTest.createListener()).toBe('function');
    //   });

    //   test('calling the listener increments the class call count', () => {
    //     const listener = reqTest.createListener();
    //     expect(reqTest.getCallCount()).toBe(0);
    //     listener(listenerRequest, listenerResponse);
    //     expect(reqTest.getCallCount()).toBe(1);
    //     listener(listenerRequest, listenerResponse);
    //     expect(reqTest.getCallCount()).toBe(2);
    //   });
    // });
  });
});
