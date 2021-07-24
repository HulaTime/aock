
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';

enum Methods {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete'
}

export type TestListener = (req: IncomingMessage, res: ServerResponse) => void;

interface TestEvaluation {
  isSatisfied: boolean
  pathMatched: boolean
  pathMatchedOnCall?: number
  methodMatched: boolean
  methodMatchedOnCall?: number
  headersMatched?: boolean
}

type StringObject = Record<string, string>;

class RequestTest {
  private called = false;
  private _callCount = 0;
  private _method = Methods.GET;
  private _path = '/';
  private _headers?: IncomingHttpHeaders;

  private _matchHeaders?: Record<string, string>;

  // private _isSatisfied = false;
  private _methodMatched = false;
  private _pathMatched = false;
  private _methodMatchedOnCall?: number;
  private _pathMatchedOnCall?: number;

  private _lowerCaseObjectKeys(input: StringObject): StringObject {
    const inputKeys = Object.keys(input);
    const lowerCaseReducer = (acc: StringObject, inputKey: string): StringObject => {
      acc[inputKey.toLowerCase()] = input[inputKey];
      return acc;
    };
    return inputKeys.reduce(lowerCaseReducer, {});
  }

  private _setPath(path: string) {
    if (path[0] !== '/') {
      throw new Error('"path" must be prefixed with "/"');
    }
    this._path = path;
  }

  public get(path: string): RequestTest {
    this._setPath(path);
    return this;
  }

  public post(path: string): RequestTest {
    this._setPath(path);
    this._method = Methods.POST;
    return this;
  }

  public patch(path: string): RequestTest {
    this._setPath(path);
    this._method = Methods.PATCH;
    return this;
  }

  public put(path: string): RequestTest {
    this._setPath(path);
    this._method = Methods.PUT;
    return this;
  }

  public delete(path: string): RequestTest {
    this._setPath(path);
    this._method = Methods.DELETE;
    return this;
  }

  public headers(matchHeaders: Record<string, string>): RequestTest {
    this._matchHeaders = this._lowerCaseObjectKeys(matchHeaders);
    return this;
  }

  private _handleMethodMatch() {
    this._methodMatched = true;
    this._methodMatchedOnCall = this.getCallCount() || undefined;
  }

  private _handlePathMatch() {
    this._pathMatched = true;
    this._pathMatchedOnCall = this.getCallCount() || undefined;
  }

  private _reqIncludesTestHeaders(): boolean {
    if (!this._matchHeaders) {
      // No headers to match against so return true
      return true;
    }
    if (!this._headers || Object.keys(this._headers).length === 0) {
      // If there are no headers in the request to match against but 
      // test headers are defined, then must return false
      return false;
    }

    // Check if the req headers include all the the test headers, 
    // if not return false
    const testHeaderKeys = Object.keys(this._matchHeaders);
    for (let i = 0; i < testHeaderKeys.length; i++) {
      if (!this._headers[testHeaderKeys[i]]) {
        return false;
      }
    }
    return true;
  }

  private _getSatisfaction(): boolean {
    return this._pathMatched
    && this._methodMatched
    && this._reqIncludesTestHeaders();
  }

  private _called() {
    if (!this.called) {
      this.called = true;
    }
    this._callCount++;
  }

  public createListener(): TestListener {
    return (req: IncomingMessage, res: ServerResponse): void => {
      res;

      const { method, url, headers } = req;
      if (url === this._path) {
        this._handlePathMatch();
        if (method === this._method) {
          this._handleMethodMatch();
          this._headers = this._lowerCaseObjectKeys(headers as StringObject);
          this._called();
        }
      }
    };
  }

  public getCallCount(): number {
    return this._callCount;
  }

  public evaluate(): TestEvaluation {
    return {
      isSatisfied: this._getSatisfaction(),
      methodMatched: this._methodMatched,
      methodMatchedOnCall: this._methodMatchedOnCall,
      pathMatched: this._pathMatched,
      pathMatchedOnCall: this._pathMatchedOnCall,
      headersMatched: this._reqIncludesTestHeaders(),
    };
  }
}

export default RequestTest;
