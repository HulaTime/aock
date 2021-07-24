
import { IncomingMessage, ServerResponse } from 'http';

// interface SObject {
//   [key: string]: string;
// }
// interface TestCondition {
//   (): boolean;
// }

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
}

class RequestTest {
  private called = false;
  private _callCount = 0;
  private _method = Methods.GET;
  private _path = '/';
  // private _headers?: SObject;
  // private _query?: SObject;
  // private _testConditions?: TestCondition[];

  private _isSatisfied = false;
  private _methodMatched = false;
  private _pathMatched = false;
  private _methodMatchedOnCall?: number;
  private _pathMatchedOnCall?: number;

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

  private _handleMethodMatch() {
    this._methodMatched = true;
    this._methodMatchedOnCall = this.getCallCount() || undefined;
  }

  private _handlePathMatch() {
    this._pathMatched = true;
    this._pathMatchedOnCall = this.getCallCount() || undefined;
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

      const { method, url } = req;
      if (method === this._method) {
        this._handleMethodMatch();
        if (url === this._path) {
          this._handlePathMatch();
        }
        this._called();
      }
    };
  }

  public getCallCount(): number {
    return this._callCount;
  }

  public evaluate(): TestEvaluation {
    if (this._pathMatched && this._methodMatched) {
      this._isSatisfied = true;
    }
    return {
      isSatisfied: this._isSatisfied,
      methodMatched: this._methodMatched,
      methodMatchedOnCall: this._methodMatchedOnCall,
      pathMatched: this._pathMatched,
      pathMatchedOnCall: this._pathMatchedOnCall,
    };
  }
}

export default RequestTest;
