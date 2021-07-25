
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';

export enum Methods {
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
  methodMatched: boolean
  headersMatched: boolean
  queryMatched: boolean
  pathMatchedOnCall?: number
  methodMatchedOnCall?: number
}

type StringObject = Record<string, string>;

class RequestTest {
  private called = false;
  private _callCount = 0;
  private _path = '/';
  private _method?: Methods;
  private _requestHeaders?: IncomingHttpHeaders;
  private _requestQueryParams?: StringObject;

  private _testHeaders?: StringObject;
  private _testQueryParams?: StringObject;

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

  private _handleMethodMatch() {
    this._methodMatched = true;
    this._methodMatchedOnCall = this.getCallCount() || undefined;
  }

  private _handlePathMatch() {
    this._pathMatched = true;
    this._pathMatchedOnCall = this.getCallCount() || undefined;
  }

  private _getUri(url = '/') {
    const [uri] = url.split('?');
    return uri;
  }

  private _getQueryString(url: string) {
    const [, queryString] = url.split('?');
    return queryString;
  }

  private _extractQueryParams(url = '/'): StringObject {
    const queryString = this._getQueryString(url);
    if (!queryString) {
      return {};
    }
    const queryParamsArr = queryString.split('&');
    return queryParamsArr.reduce((acc: StringObject, paramPair: string): StringObject => {
      const [key, value] = paramPair.split('=');
      acc[key] = value;
      return acc;
    }, {});
  }

  private _aIsSubesetOfB(a: StringObject, b: StringObject): boolean {
    const aKeys = Object.keys(a);
    for (let i = 0; i < aKeys.length; i++) {
      if (!b[aKeys[i]]) {
        return false;
      }
    }
    return true;
  }

  private _reqIncludesTestHeaders(): boolean {
    if (!this._testHeaders) {
      // No headers to match against so return true
      return true;
    }
    if (!this._requestHeaders || Object.keys(this._requestHeaders).length === 0) {
      // If there are no headers in the request to match against but 
      // test headers are defined, then must return false
      return false;
    }

    // Check if the req headers include all the the test headers, 
    // if not return false
    return this._aIsSubesetOfB(this._testHeaders, this._requestHeaders as StringObject);
  }

  private _reqIncludesTestQuery(): boolean {
    if (!this._testQueryParams) {
      // No query params to match against so return true
      return true;
    }
    if (!this._requestQueryParams || Object.keys(this._requestQueryParams).length === 0) {
      // If there are no query params in the request to match against but 
      // test query params are defined, then must return false
      return false;
    }

    return this._aIsSubesetOfB(this._testQueryParams, this._requestQueryParams);
  }

  private _getSatisfaction(): boolean {
    return this._pathMatched
      && this._methodMatched
      && this._reqIncludesTestHeaders()
      && this._reqIncludesTestQuery();
  }

  private _called() {
    if (!this.called) {
      this.called = true;
    }
    this._callCount++;
  }

  public get(path: string): RequestTest {
    this._setPath(path);
    this._method = Methods.GET;
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

  public headers(matchHeaders: StringObject): RequestTest {
    if (!this._method) {
      throw new Error('Cannot set headers before setting request type');
    }
    this._testHeaders = this._lowerCaseObjectKeys(matchHeaders);
    return this;
  }

  public query(params: StringObject): RequestTest {
    if (!this._method) {
      throw new Error('Cannot set query params before setting request type');
    }
    this._testQueryParams = params;
    return this;
  }

  public createListener(): TestListener {
    return (req: IncomingMessage, res: ServerResponse): void => {
      res;

      const { method, url, headers } = req;
      if (this._getUri(url) === this._path) {
        this._handlePathMatch();
        if (method === this._method) {
          this._handleMethodMatch();
          this._requestHeaders = this._lowerCaseObjectKeys(headers as StringObject);
          this._requestQueryParams = this._extractQueryParams(url);
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
      queryMatched: this._reqIncludesTestQuery(),
    };
  }
}

export default RequestTest;
