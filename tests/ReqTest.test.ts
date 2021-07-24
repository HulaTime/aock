import { IncomingMessage, ServerResponse } from 'http';

import RequestTest, { TestListener } from '../lib/RequestTest';

const uriUnderTest = '/foo/bar';
const headersUnderTest = {
  'authorization': 'Bearer 123',
  'content-type': 'application/json',
};

const listenerRequest = {
  method: 'get',
  url: uriUnderTest,
  headers: headersUnderTest,
} as IncomingMessage;
const listenerResponse = {} as ServerResponse;

describe('ReqTest class', () => {
  test('it should exist', () => {
    expect(RequestTest).toBeDefined();
  });

  test('it should return something when instantiated', () => {
    expect(new RequestTest()).toBeDefined();
  });

  describe('class instance', () => {
    let reqTest: RequestTest;

    beforeEach(() => {
      reqTest = new RequestTest();
    });

    test('it should have a function that returns the number of times the test has been triggered', () => {
      expect(reqTest.getCallCount()).toBe(0);
    });

    test('should have a method getCallCount', () => {
      expect(typeof reqTest.getCallCount).toBe('function');
    });

    test('#getCallCount should initially return 0', () => {
      expect(reqTest.getCallCount()).toBe(0);
    });

    describe('Setting test conditions', () => {
      test('there is class method to set each of the http verbs', () => {
        expect(typeof reqTest.get).toBe('function');
        expect(typeof reqTest.post).toBe('function');
        expect(typeof reqTest.patch).toBe('function');
        expect(typeof reqTest.put).toBe('function');
        expect(typeof reqTest.delete).toBe('function');
      });

      test('#get takes a single path parameter which is the path under test and returns the class instance', () => {
        const res = reqTest.get('/path');
        expect(res).toBe(reqTest);
      });

      test('#get the path paramteter must start with a "/"', () => {
        expect(() => {
          reqTest.get('path');
        }).toThrow('"path" must be prefixed with "/"');
      });

      test('#headers sets the expected headers and returns the class instance', () => {
        const res = reqTest.headers({});
        expect(res).toBe(reqTest);
      });
    });

    describe('#createListener', () => {
      test('returns an event listener that is used to determine whether test conditions are met', () => {
        const listener = reqTest.createListener();
        expect(typeof listener).toBe('function');
      });

      test('if method and path have been set, calling the listener with a matching request increments the call count', () => {
        reqTest.get(uriUnderTest);
        const listener = reqTest.createListener();
        expect(reqTest.getCallCount()).toBe(0);
        listener(listenerRequest, listenerResponse);
        expect(reqTest.getCallCount()).toBe(1);
        listener(listenerRequest, listenerResponse);
        expect(reqTest.getCallCount()).toBe(2);
      });

      test('if method and path have been set, calling the listener with a request that does not match, does not increment the call count', () => {
        reqTest.get('/bar/foo');
        const listener = reqTest.createListener();
        expect(reqTest.getCallCount()).toBe(0);
        listener(listenerRequest, listenerResponse);
        expect(reqTest.getCallCount()).toBe(0);
      });
    });

    describe('Evaluate test conditions', () => {
      let listener: TestListener;

      beforeEach(() => {
        listener = reqTest.createListener();
      });

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

      describe('Evaluate Get request', () => {
        test('if path is matched, #evaluate should be satisfied if the http verb is the only test condition', () => {
          reqTest.get(uriUnderTest);
          listener(listenerRequest, listenerResponse);
          const { isSatisfied } = reqTest.evaluate();
          expect(isSatisfied).toBe(true);
        });

        test('if path is matched, #evaluate should inform the path was matched', () => {
          reqTest.get(uriUnderTest);
          listener(listenerRequest, listenerResponse);
          const { pathMatched } = reqTest.evaluate();
          expect(pathMatched).toBe(true);
        });

        test('If path is not matched for the request, can\'t get no satisfaction', () => {
          reqTest.get('/i/cant/get/no');
          listener(listenerRequest, listenerResponse);
          const { isSatisfied: satisfaction } = reqTest.evaluate();
          expect(satisfaction).toBe(false);
        });

        test('If path is not matched for the request, #evaluate should return pathMatched false', () => {
          reqTest.get('/i/cant/get/no');
          listener(listenerRequest, listenerResponse);
          const { pathMatched } = reqTest.evaluate();
          expect(pathMatched).toBe(false);
        });
      });

      describe('Evaluate Get request with headers', () => {
        test('when all conditions are satisfied', () => {
          reqTest
            .get(uriUnderTest)
            .headers({ 'Content-Type': headersUnderTest['content-type'] });
          listener(listenerRequest, listenerResponse);
          const { isSatisfied, headersMatched } = reqTest.evaluate();
          expect(headersMatched).toBe(true);
          expect(isSatisfied).toBe(true);
        });

        test('when not all test headers are present in the request', () => {
          reqTest
            .get(uriUnderTest)
            .headers({
              'Content-Type': headersUnderTest['content-type'],
              'x-correlation-id': '07ad9596-1019-4dad-bbed-17c1075e33b7'
            });
          listener(listenerRequest, listenerResponse);
          const { isSatisfied, headersMatched } = reqTest.evaluate();
          expect(headersMatched).toBe(false);
          expect(isSatisfied).toBe(false);
        });
      });
    });
  });
});
